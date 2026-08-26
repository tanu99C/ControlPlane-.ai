export type RiskTier = 'SAFE' | 'WARNING' | 'CRITICAL_BLOCKED';

export type IncidentStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'REDIRECTED';

export interface PIIMatch {
  entity_type: string;
  text_snippet: string;
  start: number;
  end: number;
  confidence: number;
}

export interface FastCheckResult {
  passed: boolean;
  latency_ms: number;
  detected_pii: PIIMatch[];
  is_prompt_injection: boolean;
  injection_confidence: number;
  injection_patterns_found: string[];
  token_count: number;
  estimated_cost_usd: number;
  blocked: boolean;
  block_reason?: string | null;
}

export interface JudgeEvaluationResult {
  executed: boolean;
  groundedness_score: number;
  is_hallucinated: boolean;
  unsupported_claims: string[];
  supported_claims: string[];
  toxicity_score: number;
  bias_detected: boolean;
  reasoning: string;
  latency_ms: number;
  judge_model: string;
}

export interface EvaluationResponse {
  id: string;
  timestamp: string;
  application_id: string;
  prompt: string;
  context?: string | null;
  generated_text: string;
  tier: RiskTier;
  action_taken: string;
  warning_banner?: string | null;
  fast_check: FastCheckResult;
  judge_evaluation?: JudgeEvaluationResult | null;
  sampled_for_judge: boolean;
  current_sampling_depth_pct: number;
  cost_saved_usd: number;
  total_latency_ms: number;
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  application_id: string;
  prompt: string;
  context?: string | null;
  generated_text: string;
  tier: RiskTier;
  risk_category: string;
  status: IncidentStatus;
  details: {
    fast_check_latency_ms?: number;
    block_reason?: string;
    pii_detected?: PIIMatch[];
    judge_reasoning?: string;
    groundedness_score?: number;
    unsupported_claims?: string[];
  };
  reviewer_notes?: string | null;
  resolved_at?: string | null;
}

export interface SystemPolicy {
  pii_blocking_enabled: boolean;
  injection_blocking_enabled: boolean;
  groundedness_threshold: number;
  toxicity_threshold: number;
  max_token_limit: number;
  base_sampling_rate_pct: number;
  anomaly_spike_sampling_rate_pct: number;
  groq_api_key_configured: boolean;
  judge_model_selected: string;
  custom_groq_api_key?: string | null;
}

export interface MetricsSummary {
  total_requests: number;
  safe_requests: number;
  warning_requests: number;
  blocked_requests: number;
  current_sampling_rate_pct: number;
  adaptive_mode_active: boolean;
  recent_anomaly_rate_pct: number;
  avg_fast_check_latency_ms: number;
  avg_judge_latency_ms: number;
  total_tokens_consumed: number;
  tokens_saved_from_blocks: number;
  estimated_hallucination_damage_avoided_usd: number;
  owasp_breakdown: Record<string, number>;
  last_10_latencies: number[];
}

export interface DemoPreset {
  id: string;
  title: string;
  category: 'PII Exfiltration' | 'Hallucination & Grounding' | 'Prompt Injection Attack' | 'Grounded RAG Pass';
  badge: string;
  badgeType: 'crit' | 'warn' | 'safe';
  prompt: string;
  context?: string;
  responseOverride?: string;
  description: string;
}
