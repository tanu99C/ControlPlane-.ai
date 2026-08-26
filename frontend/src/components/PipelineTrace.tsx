import React from 'react';
import { ShieldCheck, Cpu, CheckCircle2, AlertTriangle, XCircle, Clock, FileText, Lock, Sparkles } from 'lucide-react';
import { EvaluationResponse } from '../types';

interface PipelineTraceProps {
  evaluation: EvaluationResponse;
}

export const PipelineTrace: React.FC<PipelineTraceProps> = ({ evaluation }) => {
  const { fast_check, judge_evaluation, tier, warning_banner } = evaluation;

  const isBlocked = tier === 'CRITICAL_BLOCKED';
  const isWarning = tier === 'WARNING';
  const isSafe = tier === 'SAFE';

  return (
    <div className="bg-dark-900/90 text-dark-100 rounded-3xl border border-dark-750 p-6 shadow-card-dark space-y-4 overflow-hidden">
      
      {/* Header: Title & Big Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-dark-850 border border-dark-700 flex items-center justify-center text-accent-gold shadow-inner">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-display">
              Evaluation & Guardrail Results
            </h3>
            <p className="text-[11px] text-dark-400 font-mono">
              Total Latency: {evaluation.total_latency_ms}ms
            </p>
          </div>
        </div>

        <div>
          {isSafe && (
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-status-safeBg text-status-safe border border-status-safeBorder text-xs font-mono font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TIER 1: SAFE (PASSED)</span>
            </span>
          )}
          {isWarning && (
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-status-warnBg text-status-warn border border-status-warnBorder text-xs font-mono font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>TIER 2: CITATION WARNING</span>
            </span>
          )}
          {isBlocked && (
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-status-critBg text-status-crit border border-status-critBorder text-xs font-mono font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              <span>TIER 3: BLOCKED</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Delivered AI Answer Box */}
      <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-accent-gold font-semibold">
            <FileText className="w-4 h-4" />
            <span>AI Response Output</span>
          </div>
          <span className="text-[11px] font-mono text-dark-400">
            {evaluation.generated_text.length} chars
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 text-white font-sans text-xs leading-relaxed break-words whitespace-pre-wrap selection:bg-accent-gold/30">
          {evaluation.generated_text}
        </div>

        {warning_banner && (
          <div className="mt-3 p-3 rounded-xl bg-status-warnBg border border-status-warnBorder text-xs text-status-warn font-sans flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-status-warn flex-shrink-0 mt-0.5" />
            <span>{warning_banner}</span>
          </div>
        )}
      </div>

      {/* Two Clean Diagnostic Cards (Fast Security vs Judge Accuracy) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* CARD 1: Fast Inline Guard */}
        <div className={`p-4 rounded-2xl border ${
          fast_check.blocked
            ? 'bg-status-critBg border-status-critBorder'
            : 'bg-dark-850 border-dark-750'
        }`}>
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-dark-750">
            <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-white uppercase">
              <Lock className="w-3.5 h-3.5 text-accent-rose" />
              <span>1. Fast Security</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-dark-800 text-dark-300 border border-dark-700 flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5" />
              <span>{fast_check.latency_ms}ms</span>
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-dark-400">PII / Keys:</span>
              {fast_check.detected_pii.length > 0 ? (
                <span className="text-status-crit font-semibold font-mono text-[11px] truncate max-w-[120px]">
                  {fast_check.detected_pii[0].entity_type} DETECTED
                </span>
              ) : (
                <span className="text-status-safe font-mono text-[11px]">Clean (0 found)</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-dark-400">Injection:</span>
              {fast_check.is_prompt_injection ? (
                <span className="text-status-crit font-semibold font-mono text-[11px]">ATTACK DETECTED</span>
              ) : (
                <span className="text-status-safe font-mono text-[11px]">Passed</span>
              )}
            </div>
          </div>

          {fast_check.blocked && (
            <div className="mt-2.5 p-2 rounded-xl bg-status-crit/20 text-[11px] text-red-200 font-mono break-words">
              🛑 {fast_check.block_reason}
            </div>
          )}
        </div>

        {/* CARD 2: Judge Accuracy & Grounding */}
        <div className={`p-4 rounded-2xl border ${
          !judge_evaluation
            ? 'bg-dark-850/50 border-dark-800 opacity-60'
            : judge_evaluation.is_hallucinated
            ? 'bg-status-warnBg border-status-warnBorder'
            : 'bg-dark-850 border-dark-750'
        }`}>
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-dark-750">
            <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-white uppercase">
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              <span>2. Judge Grounding</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-dark-800 text-dark-300 border border-dark-700 flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5" />
              <span>{judge_evaluation ? `${judge_evaluation.latency_ms}ms` : 'Skipped'}</span>
            </span>
          </div>

          {judge_evaluation ? (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-dark-400">Accuracy Score:</span>
                <span className={`font-mono font-bold text-[11px] ${
                  judge_evaluation.groundedness_score >= 0.8
                    ? 'text-status-safe'
                    : judge_evaluation.groundedness_score >= 0.5
                    ? 'text-status-warn'
                    : 'text-status-crit'
                }`}>
                  {Math.round(judge_evaluation.groundedness_score * 100)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-dark-400">Hallucination:</span>
                {judge_evaluation.is_hallucinated ? (
                  <span className="text-status-warn font-semibold font-mono text-[11px]">UNVERIFIED CLAIMS</span>
                ) : (
                  <span className="text-status-safe font-mono text-[11px]">Verified</span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-dark-500 font-mono py-2 text-center">
              {fast_check.blocked ? 'Fast Blocked' : 'Not Sampled'}
            </div>
          )}
        </div>

      </div>

      {/* Judge Model Explanation */}
      {judge_evaluation && judge_evaluation.reasoning && (
        <div className="p-3.5 bg-dark-850 rounded-2xl border border-dark-750 text-xs">
          <span className="text-accent-gold font-mono text-[11px] font-semibold block mb-1">
            Judge Review Rationale:
          </span>
          <p className="text-dark-200 font-sans leading-relaxed break-words text-[11px]">
            {judge_evaluation.reasoning}
          </p>
        </div>
      )}

    </div>
  );
};
