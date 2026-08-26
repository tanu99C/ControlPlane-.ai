import os
import asyncio
import json
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .models.schemas import (
    EvaluationRequest, EvaluationResponse, RiskTier,
    IncidentRecord, SystemPolicy, MetricsSummary
)
from .services.fast_checker import fast_checker
from .services.judge_evaluator import judge_evaluator
from .services.adaptive_sampler import adaptive_sampler
from .services.incident_manager import incident_manager
from .services.traffic_simulator import traffic_simulator

app = FastAPI(
    title="ControlPlane Checker API",
    version="1.0.0",
    description="Real-Time AI Oversight, Guardrail & Quality Control Tower Gateway"
)

# Enable CORS for frontend Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket connections manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_json(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

ws_manager = ConnectionManager()

# Link simulator callback to WebSocket broadcast
async def on_simulator_event(event: EvaluationResponse):
    rate_pct, is_adaptive = adaptive_sampler.calculate_sampling_rate()
    anomaly_rate = adaptive_sampler.get_current_anomaly_rate()
    stats = incident_manager.get_metrics_summary(rate_pct, is_adaptive, anomaly_rate)
    
    payload = {
        "type": "NEW_TELEMETRY_EVENT",
        "event": event.dict(),
        "stats": stats.dict()
    }
    await ws_manager.broadcast_json(payload)

traffic_simulator.on_event_callback = on_simulator_event


@app.on_event("startup")
async def startup_event():
    # Pre-seed 8 realistic items into telemetry feed
    for _ in range(8):
        traffic_simulator.generate_synthetic_event()


@app.get("/api/health")
def get_health():
    return {
        "status": "healthy",
        "service": "ControlPlane Checker",
        "groq_active": judge_evaluator.is_groq_active(),
        "simulator_running": traffic_simulator.is_running,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/api/proxy/evaluate", response_model=EvaluationResponse)
async def evaluate_request(request: EvaluationRequest, background_tasks: BackgroundTasks):
    import uuid
    req_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + "Z"
    policy = incident_manager.policy

    # 1. FAST INLINE CHECKS (<15ms)
    fast_check = fast_checker.evaluate(
        prompt=request.prompt,
        generated_text=request.response_override,
        pii_blocking=policy.pii_blocking_enabled,
        injection_blocking=policy.injection_blocking_enabled
    )

    should_sample, current_sampling_rate, is_adaptive = adaptive_sampler.should_sample_for_judge(force_sample=True)

    # If Fast Check Blocked
    if fast_check.blocked:
        cost_saved = 4200.0
        generated_text = f"[BLOCKED BY CONTROLPLANE CHECKER: {fast_check.block_reason}]"
        
        response = EvaluationResponse(
            id=req_id,
            timestamp=timestamp,
            application_id=request.application_id or "playground-client",
            prompt=request.prompt,
            context=request.context,
            generated_text=generated_text,
            tier=RiskTier.CRITICAL_BLOCKED,
            action_taken="INTERRUPT_DELIVERY_AND_ALERT_HITL",
            warning_banner=None,
            fast_check=fast_check,
            judge_evaluation=None,
            sampled_for_judge=False,
            current_sampling_depth_pct=current_sampling_rate,
            cost_saved_usd=cost_saved,
            total_latency_ms=fast_check.latency_ms
        )
        incident_manager.record_evaluation(response)
        adaptive_sampler.record_outcome(True)
        
        # Broadcast to dashboard
        stats = incident_manager.get_metrics_summary(current_sampling_rate, is_adaptive, adaptive_sampler.get_current_anomaly_rate())
        await ws_manager.broadcast_json({"type": "NEW_TELEMETRY_EVENT", "event": response.dict(), "stats": stats.dict()})
        return response

    # 2. GENERATE OR ADOPT RESPONSE
    if request.response_override:
        generated_text = request.response_override
    else:
        generated_text = ""
        if judge_evaluator.is_groq_active():
            for model_candidate in ["groq/compound-mini", "groq/compound", "openai/gpt-oss-120b"]:
                try:
                    groq_resp = judge_evaluator._groq_client.chat.completions.create(
                        model=model_candidate,
                        messages=[
                            {"role": "system", "content": request.system_prompt or "You are an intelligent enterprise AI assistant. Provide a clear, thorough, structured, and helpful explanation with examples."},
                            {"role": "user", "content": f"Context: {request.context or 'None'}\n\nPrompt: {request.prompt}"}
                        ],
                        max_tokens=800
                    )
                    generated_text = groq_resp.choices[0].message.content.strip()
                    if generated_text:
                        break
                except Exception as e:
                    print(f"[Main] Groq attempt with {model_candidate} failed: {e}")
                    continue

        # If LLM is offline or all candidates timed out, use rich domain synthesizer
        if not generated_text:
            import re
            p_lower = request.prompt.lower()
            if re.search(r'\bsoftware engineering\b|\bsoftware developer\b|\bsoftware development\b', p_lower):
                generated_text = (
                    "Software Engineering is the disciplined, systematic application of engineering principles to design, develop, test, "
                    "and maintain high-quality software systems. To build a successful career:\n\n"
                    "1. Master Core Fundamentals: Data Structures, Algorithms, and Object-Oriented/Functional Programming (Python, TypeScript, Java, or C++).\n"
                    "2. Build Production Projects: Develop full-stack applications, APIs, and databases, and publish them on GitHub.\n"
                    "3. Learn System Design & DevOps: Understand distributed systems, caching, CI/CD pipelines, Docker, and cloud infrastructure (AWS/GCP/Azure).\n"
                    "4. Contribute & Network: Participate in open-source projects, prepare for technical system design interviews, and collaborate on real-world engineering challenges."
                )
            elif re.search(r'\bdata science\b', p_lower):
                generated_text = (
                    "Data Science is an interdisciplinary field that extracts actionable knowledge and insights from structured and unstructured data. Key pillars include:\n\n"
                    "1. Statistics & Mathematics: Probability distributions, hypothesis testing, linear algebra, and statistical inference.\n"
                    "2. Machine Learning & Modeling: Supervised learning (Regression, Random Forests, XGBoost), Unsupervised learning (K-Means, PCA), and Deep Learning.\n"
                    "3. Data Engineering & EDA: Data cleaning with Pandas/NumPy, SQL database pipelines, and interactive visualization with Tableau or Seaborn.\n"
                    "4. Business Value Delivery: Translating quantitative predictive models into measurable executive decisions and automated production APIs."
                )
            elif re.search(r'\bbusiness analytic[s]?\b', p_lower):
                generated_text = (
                    "Business Analytics refers to the systematic exploration and quantitative analysis of enterprise data to drive strategic decision-making. "
                    "It spans descriptive analytics (what happened), diagnostic analytics (why it happened), predictive analytics (what will happen), "
                    "and prescriptive analytics (how to act)."
                )
            elif re.search(r'\b(?:ai|artificial intelligence|llm|machine learning|deep learning)\b', p_lower):
                generated_text = (
                    "Artificial Intelligence (AI) and Machine Learning (ML) enable computational systems to learn patterns from data, reason through "
                    "complex problems, and perform cognitive tasks such as natural language processing, computer vision, and predictive decision-making."
                )
            elif request.context and len(request.context.strip()) > 10:
                generated_text = f"Based on the provided reference context: {request.context.strip()}"
            else:
                generated_text = (
                    f"Comprehensive Analysis for '{request.prompt}':\n\n"
                    "In modern enterprise architectures, implementing structured methodologies, robust quality guardrails, and data-driven "
                    "decision frameworks ensures scalable, dependable, and high-performance outcomes across distributed workflows."
                )





    # 3. ASYNC / PARALLEL JUDGE EVALUATION
    judge_res = await judge_evaluator.evaluate(
        prompt=request.prompt,
        generated_text=generated_text,
        context=request.context,
        judge_model=policy.judge_model_selected
    )

    # 4. TIER CLASSIFICATION
    if judge_res.is_hallucinated or judge_res.groundedness_score < policy.groundedness_threshold:
        tier = RiskTier.WARNING
        action = "ATTACH_CITATION_WARNING_BANNER"
        warning_banner = f"⚠️ Citation Warning: Groundedness score ({round(judge_res.groundedness_score*100)}%) is below enterprise policy threshold ({round(policy.groundedness_threshold*100)}%). Verify assertions."
        cost_saved = 850.0
        is_flagged = True
    elif judge_res.toxicity_score > policy.toxicity_threshold:
        tier = RiskTier.CRITICAL_BLOCKED
        action = "BLOCK_TOXIC_OUTPUT_ROUTE_HITL"
        generated_text = "[BLOCKED BY CONTROLPLANE CHECKER: High Toxicity/Brand Risk Detected]"
        warning_banner = None
        cost_saved = 4200.0
        is_flagged = True
    else:
        tier = RiskTier.SAFE
        action = "SAFE_DELIVER_WITH_AUDIT_LOG"
        warning_banner = None
        cost_saved = 0.0
        is_flagged = False

    adaptive_sampler.record_outcome(is_flagged)

    response = EvaluationResponse(
        id=req_id,
        timestamp=timestamp,
        application_id=request.application_id or "playground-client",
        prompt=request.prompt,
        context=request.context,
        generated_text=generated_text,
        tier=tier,
        action_taken=action,
        warning_banner=warning_banner,
        fast_check=fast_check,
        judge_evaluation=judge_res,
        sampled_for_judge=True,
        current_sampling_depth_pct=current_sampling_rate,
        cost_saved_usd=cost_saved,
        total_latency_ms=fast_check.latency_ms + judge_res.latency_ms
    )

    incident_manager.record_evaluation(response)
    
    # Broadcast to dashboard
    stats = incident_manager.get_metrics_summary(current_sampling_rate, is_adaptive, adaptive_sampler.get_current_anomaly_rate())
    await ws_manager.broadcast_json({"type": "NEW_TELEMETRY_EVENT", "event": response.dict(), "stats": stats.dict()})
    
    return response


@app.get("/api/telemetry/stats", response_model=MetricsSummary)
def get_telemetry_stats():
    rate_pct, is_adaptive = adaptive_sampler.calculate_sampling_rate()
    anomaly_rate = adaptive_sampler.get_current_anomaly_rate()
    return incident_manager.get_metrics_summary(rate_pct, is_adaptive, anomaly_rate)


@app.get("/api/telemetry/live-feed", response_model=List[EvaluationResponse])
def get_live_feed():
    return incident_manager.telemetry_history[:50]


@app.get("/api/incidents", response_model=List[IncidentRecord])
def get_incidents(status: Optional[str] = "ALL"):
    return incident_manager.get_incidents(status)


@app.post("/api/incidents/{incident_id}/action", response_model=IncidentRecord)
async def take_incident_action(incident_id: str, payload: dict = Body(...)):
    action = payload.get("action", "APPROVE")
    notes = payload.get("notes")
    record = incident_manager.resolve_incident(incident_id, action, notes)
    if not record:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    # Broadcast incident update
    await ws_manager.broadcast_json({"type": "INCIDENT_UPDATED", "incident": record.dict()})
    return record


@app.get("/api/policies", response_model=SystemPolicy)
def get_policies():
    p = incident_manager.policy
    p.groq_api_key_configured = judge_evaluator.is_groq_active()
    return p


@app.put("/api/policies", response_model=SystemPolicy)
def update_policies(new_policy: SystemPolicy):
    incident_manager.policy = new_policy
    if new_policy.custom_groq_api_key:
        judge_evaluator.update_api_key(new_policy.custom_groq_api_key)
    new_policy.groq_api_key_configured = judge_evaluator.is_groq_active()
    return new_policy


@app.post("/api/simulator/toggle")
async def toggle_simulator(payload: dict = Body(...)):
    running = payload.get("running", True)
    speed = payload.get("speed_sec", 3.0)
    
    traffic_simulator.set_speed(speed)
    if running and not traffic_simulator.is_running:
        loop = asyncio.get_event_loop()
        traffic_simulator.start(loop)
    elif not running and traffic_simulator.is_running:
        traffic_simulator.stop()
        
    return {"simulator_running": traffic_simulator.is_running, "speed_sec": traffic_simulator.delay_seconds}


@app.post("/api/simulator/surge")
async def trigger_attack_surge():
    """Injects 5 high-threat events in rapid succession to showcase the Adaptive Sampler auto-scaling to 85%+"""
    threat_types = ["PROMPT_INJECTION", "PII_LEAK", "HALLUCINATION", "PROMPT_INJECTION", "HALLUCINATION"]
    events = []
    for threat in threat_types:
        event = traffic_simulator.generate_synthetic_event(force_threat=threat)
        events.append(event.dict())
        if traffic_simulator.on_event_callback:
            await traffic_simulator.on_event_callback(event)
        await asyncio.sleep(0.3)
    return {"surge_dispatched": len(events), "adaptive_sampling_rate_pct": adaptive_sampler.calculate_sampling_rate()[0]}


@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Send current initial state upon connect
        rate_pct, is_adaptive = adaptive_sampler.calculate_sampling_rate()
        anomaly_rate = adaptive_sampler.get_current_anomaly_rate()
        initial_stats = incident_manager.get_metrics_summary(rate_pct, is_adaptive, anomaly_rate)
        await websocket.send_json({
            "type": "INITIAL_STATE",
            "stats": initial_stats.dict(),
            "feed": [e.dict() for e in incident_manager.telemetry_history[:25]],
            "incidents": [i.dict() for i in incident_manager.get_incidents()[:25]]
        })
        while True:
            data = await websocket.receive_text()
            # Heartbeat / ping
            await websocket.send_json({"type": "PONG", "timestamp": datetime.utcnow().isoformat()})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)
