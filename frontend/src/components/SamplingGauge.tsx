import React from 'react';
import { Gauge, Sparkles } from 'lucide-react';

interface SamplingGaugeProps {
  currentRatePct: number;
  isAdaptiveActive: boolean;
  anomalyRatePct: number;
}

export const SamplingGauge: React.FC<SamplingGaugeProps> = ({
  currentRatePct,
  isAdaptiveActive,
  anomalyRatePct,
}) => {
  const isElevated = currentRatePct > 40;
  const isCritical = currentRatePct > 70;

  const getStatusColor = () => {
    if (isCritical) return 'text-status-crit bg-status-critBg border-status-critBorder';
    if (isElevated) return 'text-status-warn bg-status-warnBg border-status-warnBorder';
    return 'text-status-safe bg-status-safeBg border-status-safeBorder';
  };

  const getBarColor = () => {
    if (isCritical) return 'bg-gradient-to-r from-status-warn to-status-crit';
    if (isElevated) return 'bg-gradient-to-r from-accent-gold to-status-warn';
    return 'bg-gradient-to-r from-accent-cyan to-status-safe';
  };

  return (
    <div className="bg-dark-900/90 rounded-2xl border border-dark-750 p-5 shadow-card-dark flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-accent-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400 font-mono">
              Adaptive Sampling Depth
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${getStatusColor()}`}>
            {isAdaptiveActive ? '⚡ Surge Auto-Scaling' : '✓ Nominal Routine Mode'}
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              {currentRatePct}%
            </div>
            <p className="text-xs text-dark-400 mt-1">
              of live responses actively verified by parallel Judge Model
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-semibold text-dark-200">
              Threat Rate: {anomalyRatePct}%
            </div>
            <div className="text-[10px] text-dark-500 font-mono">
              Threshold: 15%
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4 relative w-full h-3 bg-dark-800 rounded-full overflow-hidden border border-dark-700">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${getBarColor()}`}
            style={{ width: `${Math.min(Math.max(currentRatePct, 5), 100)}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[10px] font-mono text-dark-500">
          <span>0% (Silent)</span>
          <span className="text-dark-300 font-medium">25% (Base Routine)</span>
          <span className="text-status-warn">70% (Elevated)</span>
          <span className="text-status-crit">100% (Full Lock)</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-dark-800 flex items-start space-x-2 text-[11px] text-dark-300 bg-dark-850 p-3 rounded-xl border border-dark-750">
        <Sparkles className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Two-Speed Architecture:</strong> Executes fast inline security on 100% of traffic, while auto-scaling deep judge verification only during threat spikes.
        </span>
      </div>
    </div>
  );
};
