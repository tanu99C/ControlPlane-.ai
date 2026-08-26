from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class RiskTier(str, Enum):
    SAFE = "SAFE"
    WARNING = "WARNING"
    CRITICAL_BLOCKED = "CRITICAL_BLOCKED"

class IncidentStatus(str, Enum):
    PENDING_REVIEW = "PENDING_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    REDIRECTED = "REDIRECTED"

class EvaluationRequest(BaseModel):
    prompt: str
    context: Optional[str] = None
    system_prompt: Optional[str] = None
    response_override: Optional[str] = None  # If testing a pre-generated response
    model: Optional[str] = "llama-3.3-70b-versatile"
    application_id: Optional[str] = "enterprise-customer-bot"
    user_id: Optional[str] = "usr_demo_984"

class PIIMatch(BaseModel):
    entity_type: str  # e.g., CREDIT_CARD, SSN, EMAIL, API_KEY, PHONE
    text_snippet: str
    start: int
    end: int
    confidence: float

class FastCheckResult(BaseModel):
    passed: bool
    latency_ms: float
    detected_pii: List[PIIMatch] = []
    is_prompt_injection: bool = False
    injection_confidence: float = 0.0
    injection_patterns_found: List[str] = []
    token_count: int = 0
    estimated_cost_usd: float = 0.0
    blocked: bool = False
    block_reason: Optional[str] = None

class JudgeEvaluationResult(BaseModel):
    executed: bool = True
    groundedness_score: float = 1.0  # 0.0 (total hallucination) to 1.0 (fully grounded)
    is_hallucinated: bool = False
    unsupported_claims: List[str] = []
    supported_claims: List[str] = []
    toxicity_score: float = 0.0
    bias_detected: bool = False
    reasoning: str = ""
    latency_ms: float = 0.0
    judge_model: str = "llama-3.1-8b-instant"

class EvaluationResponse(BaseModel):
    id: str
    timestamp: str
    application_id: str
    prompt: str
    context: Optional[str] = None
    generated_text: str
    tier: RiskTier
    action_taken: str
    warning_banner: Optional[str] = None
    fast_check: FastCheckResult
    judge_evaluation: Optional[JudgeEvaluationResult] = None
    sampled_for_judge: bool = True
    current_sampling_depth_pct: float = 25.0
    cost_saved_usd: float = 0.0
    total_latency_ms: float = 0.0

class IncidentRecord(BaseModel):
    id: str
    timestamp: str
    application_id: str
    prompt: str
    context: Optional[str] = None
    generated_text: str
    tier: RiskTier
    risk_category: str  # PII_LEAK, PROMPT_INJECTION, FACTUAL_HALLUCINATION, TOXICITY, UNBOUNDED_COST
    status: IncidentStatus = IncidentStatus.PENDING_REVIEW
    details: Dict[str, Any] = {}
    reviewer_notes: Optional[str] = None
    resolved_at: Optional[str] = None

class SystemPolicy(BaseModel):
    pii_blocking_enabled: bool = True
    injection_blocking_enabled: bool = True
    groundedness_threshold: float = 0.75
    toxicity_threshold: float = 0.70
    max_token_limit: int = 4096
    base_sampling_rate_pct: float = 25.0
    anomaly_spike_sampling_rate_pct: float = 85.0
    groq_api_key_configured: bool = False
    judge_model_selected: str = "llama-3.1-8b-instant"
    custom_groq_api_key: Optional[str] = None

class MetricsSummary(BaseModel):
    total_requests: int = 0
    safe_requests: int = 0
    warning_requests: int = 0
    blocked_requests: int = 0
    current_sampling_rate_pct: float = 25.0
    adaptive_mode_active: bool = False
    recent_anomaly_rate_pct: float = 0.0
    avg_fast_check_latency_ms: float = 8.5
    avg_judge_latency_ms: float = 195.0
    total_tokens_consumed: int = 0
    tokens_saved_from_blocks: int = 0
    estimated_hallucination_damage_avoided_usd: float = 0.0
    owasp_breakdown: Dict[str, int] = {}
    last_10_latencies: List[float] = []
