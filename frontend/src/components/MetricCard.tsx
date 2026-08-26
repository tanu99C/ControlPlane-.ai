import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeType?: 'safe' | 'warn' | 'crit' | 'neutral' | 'bronze';
  icon: LucideIcon;
  footnote?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  badgeType = 'neutral',
  icon: Icon,
  footnote,
}) => {
  const getBadgeClass = () => {
    switch (badgeType) {
      case 'safe':
        return 'bg-status-safeBg text-status-safe border-status-safeBorder';
      case 'warn':
        return 'bg-status-warnBg text-status-warn border-status-warnBorder';
      case 'crit':
        return 'bg-status-critBg text-status-crit border-status-critBorder';
      case 'bronze':
        return 'bg-accent-gold/15 text-accent-gold border-accent-gold/40';
      default:
        return 'bg-dark-800 text-dark-300 border-dark-700';
    }
  };

  return (
    <div className="bg-dark-900/90 rounded-2xl border border-dark-750 p-5 shadow-card-dark hover:border-dark-600 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400 font-mono">
            {title}
          </span>
          <div className="w-8 h-8 rounded-xl bg-dark-850 border border-dark-700 flex items-center justify-center text-dark-300 group-hover:text-accent-gold transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            {value}
          </div>
          {badge && (
            <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeClass()}`}>
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-1.5 text-xs text-dark-400 font-sans leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {footnote && (
        <div className="mt-4 pt-3 border-t border-dark-800/80 text-[10px] font-mono text-dark-500 flex items-center justify-between">
          <span>{footnote}</span>
        </div>
      )}
    </div>
  );
};
