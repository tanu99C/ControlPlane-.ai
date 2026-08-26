import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, XCircle, CornerUpRight } from 'lucide-react';
import { IncidentRecord } from '../types';

interface IncidentModalProps {
  incident: IncidentRecord | null;
  onClose: () => void;
  onResolve: (incidentId: string, action: string, notes?: string) => Promise<void>;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  incident,
  onClose,
  onResolve,
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!incident) return null;

  const handleAction = async (action: string) => {
    setIsSubmitting(true);
    try {
      await onResolve(incident.id, action, notes);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryBadge = () => {
    switch (incident.risk_category) {
      case 'PII_LEAK':
        return 'bg-status-critBg text-status-crit border-status-critBorder';
      case 'PROMPT_INJECTION':
        return 'bg-status-critBg text-status-crit border-status-critBorder';
      case 'FACTUAL_HALLUCINATION':
        return 'bg-status-warnBg text-status-warn border-status-warnBorder';
      default:
        return 'bg-dark-800 text-dark-300 border-dark-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md animate-fade-in text-dark-100">
      <div className="bg-dark-900 border border-dark-750 w-full max-w-3xl max-h-[90vh] rounded-3xl flex flex-col shadow-glow-card overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-dark-800 bg-dark-850 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center shadow-card text-white">
              <ShieldAlert className="w-5 h-5 text-status-warn" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Incident Review: {incident.id}
                </h3>
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${getCategoryBadge()}`}>
                  {incident.risk_category}
                </span>
              </div>
              <p className="text-xs text-dark-400 font-sans mt-0.5">
                App: <span className="font-mono font-medium text-dark-200">{incident.application_id}</span> • Reported at {new Date(incident.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-dark-200">
          
          {/* User Prompt */}
          <div>
            <span className="font-mono uppercase font-semibold text-dark-400 block mb-1.5">
              1. User Prompt Submitted
            </span>
            <div className="bg-dark-850 p-3.5 rounded-2xl border border-dark-750 font-sans text-dark-100 leading-relaxed">
              {incident.prompt}
            </div>
          </div>

          {/* Reference Grounding Context (if available) */}
          {incident.context && (
            <div>
              <span className="font-mono uppercase font-semibold text-dark-400 block mb-1.5">
                2. Retrieved Knowledge / Ground Truth Context
              </span>
              <div className="bg-dark-850 p-3.5 rounded-2xl border border-dark-750 text-dark-300 font-sans leading-relaxed text-[11px]">
                {incident.context}
              </div>
            </div>
          )}

          {/* Model Output / Intercepted Content */}
          <div>
            <span className="font-mono uppercase font-semibold text-dark-400 block mb-1.5">
              3. LLM Generated Output (Evaluated)
            </span>
            <div className="bg-dark-950 text-dark-100 p-3.5 rounded-2xl border border-dark-800 font-mono text-[11px] leading-relaxed break-words">
              {incident.generated_text}
            </div>
          </div>

          {/* Safety Reason & Judge Critique */}
          <div className="bg-dark-850 p-4 rounded-2xl border border-dark-750 space-y-2">
            <span className="font-mono uppercase font-semibold text-dark-300 block">
              4. ControlPlane Checker Diagnostic Findings
            </span>

            {incident.details?.block_reason && (
              <div className="text-status-crit font-mono font-medium">
                🛑 {incident.details.block_reason}
              </div>
            )}

            {incident.details?.judge_reasoning && (
              <div className="text-dark-300 font-sans leading-relaxed">
                <strong>Judge Rationale:</strong> {incident.details.judge_reasoning}
              </div>
            )}

            {incident.details?.unsupported_claims && incident.details.unsupported_claims.length > 0 && (
              <div className="mt-2 space-y-1">
                <span className="text-status-warn font-semibold font-mono text-[11px]">
                  Detected Factual Inconsistencies:
                </span>
                {incident.details.unsupported_claims.map((claim, idx) => (
                  <div key={idx} className="text-status-warn bg-status-warnBg px-2.5 py-1 rounded-xl border border-status-warnBorder font-mono text-[11px]">
                    • {claim}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviewer Notes Input */}
          <div>
            <label className="font-mono uppercase font-semibold text-dark-400 block mb-1.5">
              5. HITL Reviewer Annotation & Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified by compliance officer - false positive approved."
              className="w-full px-3.5 py-2.5 rounded-xl border border-dark-750 bg-dark-850 text-white placeholder-dark-500 focus:outline-none focus:border-accent-gold text-xs font-sans"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-dark-800 bg-dark-850 flex items-center justify-between">
          <span className="text-xs text-dark-400 font-sans">
            Status: <strong className="font-mono text-white">{incident.status}</strong>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAction('REDIRECT')}
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-dark-800 border border-dark-700 text-status-warn hover:bg-dark-750 transition-colors"
            >
              <CornerUpRight className="w-3.5 h-3.5" />
              <span>Redirect to Canned Response</span>
            </button>

            <button
              onClick={() => handleAction('REJECT')}
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-status-crit text-white hover:bg-red-700 transition-colors shadow-sm"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject & Blacklist</span>
            </button>

            <button
              onClick={() => handleAction('APPROVE')}
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-status-safe text-white hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve & Deliver</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
