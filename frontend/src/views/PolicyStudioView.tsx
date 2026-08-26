import React, { useState } from 'react';
import { 
  Sliders, Key, Zap, Save, CheckCircle2, Lock, 
  Sparkles, RefreshCw 
} from 'lucide-react';
import { SystemPolicy } from '../types';
import { updatePolicies } from '../services/api';

interface PolicyStudioViewProps {
  policy: SystemPolicy | null;
  onPolicyUpdated: (p: SystemPolicy) => void;
}

export const PolicyStudioView: React.FC<PolicyStudioViewProps> = ({
  policy,
  onPolicyUpdated,
}) => {
  const [formData, setFormData] = useState<SystemPolicy>(
    policy || {
      pii_blocking_enabled: true,
      injection_blocking_enabled: true,
      groundedness_threshold: 0.75,
      toxicity_threshold: 0.70,
      max_token_limit: 4096,
      base_sampling_rate_pct: 25.0,
      anomaly_spike_sampling_rate_pct: 85.0,
      groq_api_key_configured: true,
      judge_model_selected: 'groq/compound-mini',
      custom_groq_api_key: '',
    }
  );

  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: SystemPolicy = {
        ...formData,
        custom_groq_api_key: apiKeyInput.trim() ? apiKeyInput.trim() : formData.custom_groq_api_key
      };
      const updated = await updatePolicies(payload);
      onPolicyUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto text-dark-100">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-accent-gold font-mono text-xs uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Enterprise Policy & Guardrails Configuration</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            Policy Studio & Model Gateway Rules
          </h2>
          <p className="text-xs text-dark-400 font-sans mt-0.5">
            Configure synchronous inline filters, hallucination tolerances, and dynamic auto-scaling thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-accent-gold to-amber-500 hover:from-amber-400 hover:to-amber-600 text-dark-950 font-bold text-xs shadow-glow-gold transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin text-dark-950" />
          ) : saveSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-dark-950" />
          ) : (
            <Save className="w-4 h-4 text-dark-950" />
          )}
          <span>{saveSuccess ? 'Saved & Deployed!' : 'Save Policy Changes'}</span>
        </button>
      </div>

      {/* SECTION 1: Groq API Key & Judge Model Integration */}
      <div className="bg-dark-900/90 rounded-3xl border border-dark-750 p-6 shadow-card-dark space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-dark-850 border border-dark-700 flex items-center justify-center text-accent-gold shadow-inner">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Groq API & Cloud Inference Engine
              </h3>
              <p className="text-xs text-dark-400 font-sans">
                Ultra-low latency inference engine running Meta Llama 3 & compound models
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full border bg-status-safeBg text-status-safe border-status-safeBorder font-semibold">
            ✓ Groq Engine Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-mono uppercase font-semibold text-dark-300 block mb-1">
              Active API Key (Masked & Secure)
            </label>
            <input
              type="password"
              placeholder="•••••••••••••••••••••••••••••••• (Active & Encrypted)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-dark-750 bg-dark-850 text-white font-mono text-xs focus:outline-none focus:border-accent-gold"
            />
            <span className="text-[10px] text-dark-500 font-sans mt-1 block">
              Key is securely stored in <code>.env</code> and masked from client views.
            </span>
          </div>

          <div>
            <label className="font-mono uppercase font-semibold text-dark-300 block mb-1">
              Active Judge Engine
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-dark-750 bg-dark-850 text-dark-200 font-mono text-xs flex items-center justify-between">
              <span>groq/compound-mini (Live ~150ms)</span>
              <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Synchronous Fast Inline Guardrails */}
      <div className="bg-dark-900/90 rounded-3xl border border-dark-750 p-6 shadow-card-dark space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-dark-800">
          <div className="w-10 h-10 rounded-2xl bg-dark-850 border border-dark-700 flex items-center justify-center text-accent-rose shadow-inner">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Synchronous Fast Guardrails (&lt;15ms)
            </h3>
            <p className="text-xs text-dark-400 font-sans">
              Critical security firewalls that execute inline and immediately block or sanitize delivery
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* PII Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-850 border border-dark-750">
            <div>
              <div className="font-sans font-semibold text-xs text-white">
                PII & Secret Exfiltration Firewall
              </div>
              <p className="text-[11px] text-dark-400 font-sans mt-0.5">
                Automatically scans for Credit Cards (Luhn), SSNs, API Keys (Groq, OpenAI, AWS), and Emails.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.pii_blocking_enabled}
              onChange={(e) => setFormData({ ...formData, pii_blocking_enabled: e.target.checked })}
              className="w-4 h-4 accent-accent-gold cursor-pointer"
            />
          </div>

          {/* Prompt Injection Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-850 border border-dark-750">
            <div>
              <div className="font-sans font-semibold text-xs text-white">
                Prompt Injection & Jailbreak Interceptor
              </div>
              <p className="text-[11px] text-dark-400 font-sans mt-0.5">
                Detects instruction overrides, system delimiter breakouts, and DAN mode jailbreaks.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.injection_blocking_enabled}
              onChange={(e) => setFormData({ ...formData, injection_blocking_enabled: e.target.checked })}
              className="w-4 h-4 accent-accent-gold cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Groundedness & Hallucination Tolerance */}
      <div className="bg-dark-900/90 rounded-3xl border border-dark-750 p-6 shadow-card-dark space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-dark-800">
          <div className="w-10 h-10 rounded-2xl bg-dark-850 border border-dark-700 flex items-center justify-center text-accent-cyan shadow-inner">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Parallel Judge Groundedness Tolerances
            </h3>
            <p className="text-xs text-dark-400 font-sans">
              Fine-tune the sensitivity of citation warning banners and unverified factual checks
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-mono uppercase font-semibold text-dark-300">
                Groundedness Threshold (Hallucination Sensitivity)
              </label>
              <span className="font-mono font-bold text-accent-gold text-sm">
                {Math.round(formData.groundedness_threshold * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.40"
              max="0.95"
              step="0.05"
              value={formData.groundedness_threshold}
              onChange={(e) => setFormData({ ...formData, groundedness_threshold: parseFloat(e.target.value) })}
              className="w-full accent-accent-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-dark-500 mt-1">
              <span>Lenient (50%)</span>
              <span className="text-dark-300">Balanced (75%)</span>
              <span>Strict Compliance (95%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Dynamic Adaptive Sampling Settings */}
      <div className="bg-dark-900/90 rounded-3xl border border-dark-750 p-6 shadow-card-dark space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-dark-800">
          <div className="w-10 h-10 rounded-2xl bg-dark-850 border border-dark-700 flex items-center justify-center text-accent-gold shadow-inner">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Dynamic Adaptive Sampling Engine
            </h3>
            <p className="text-xs text-dark-400 font-sans">
              Auto-scales parallel judge inspection depth during elevated threat periods
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-mono uppercase font-semibold text-dark-300 block mb-1">
              Base Routine Sampling Rate (%)
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={formData.base_sampling_rate_pct}
              onChange={(e) => setFormData({ ...formData, base_sampling_rate_pct: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-dark-750 bg-dark-850 text-white font-mono text-xs focus:outline-none focus:border-accent-gold"
            />
          </div>

          <div>
            <label className="font-mono uppercase font-semibold text-dark-300 block mb-1">
              Peak Surge Sampling Rate (%)
            </label>
            <input
              type="number"
              min="60"
              max="100"
              value={formData.anomaly_spike_sampling_rate_pct}
              onChange={(e) => setFormData({ ...formData, anomaly_spike_sampling_rate_pct: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-dark-750 bg-dark-850 text-white font-mono text-xs focus:outline-none focus:border-accent-gold"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
