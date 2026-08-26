import React, { useState } from 'react';
import { 
  Activity, ShieldAlert, DollarSign, AlertTriangle, 
  Search, ChevronRight, CheckCircle2, XCircle, Terminal 
} from 'lucide-react';
import { MetricsSummary, EvaluationResponse } from '../types';
import { MetricCard } from '../components/MetricCard';
import { SamplingGauge } from '../components/SamplingGauge';
import { PipelineTrace } from '../components/PipelineTrace';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

interface ControlTowerViewProps {
  stats: MetricsSummary | null;
  liveFeed: EvaluationResponse[];
  onSelectEvaluation?: (ev: EvaluationResponse) => void;
}

export const ControlTowerView: React.FC<ControlTowerViewProps> = ({
  stats,
  liveFeed,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'CRITICAL_BLOCKED' | 'WARNING' | 'SAFE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrace, setSelectedTrace] = useState<EvaluationResponse | null>(null);

  const filteredFeed = liveFeed.filter((item) => {
    const matchesFilter = filterType === 'ALL' || item.tier === filterType;
    const matchesSearch = 
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.application_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.fast_check.block_reason && item.fast_check.block_reason.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const total = stats?.total_requests || 1;
  const blockRate = stats ? ((stats.blocked_requests / total) * 100).toFixed(1) : '0.0';
  const warnRate = stats ? ((stats.warning_requests / total) * 100).toFixed(1) : '0.0';
  const safeRate = stats ? ((stats.safe_requests / total) * 100).toFixed(1) : '0.0';

  const owaspData = stats?.owasp_breakdown
    ? Object.entries(stats.owasp_breakdown).map(([name, count]) => ({
        name: name.split(':')[0],
        fullName: name,
        count: count,
      }))
    : [
        { name: 'LLM01', fullName: 'Prompt Injection', count: 8 },
        { name: 'LLM02', fullName: 'Sensitive Info Disclosure', count: 12 },
        { name: 'LLM03', fullName: 'Hallucination & Misinformation', count: 15 },
        { name: 'LLM04', fullName: 'Unbounded Consumption', count: 4 },
      ];

  const OWASP_COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'];

  return (
    <div className="space-y-6 animate-fade-in text-dark-100">
      
      {/* Top Hero KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Evaluated Requests"
          value={stats ? stats.total_requests.toLocaleString() : '---'}
          subtitle={`${safeRate}% delivered cleanly without incident`}
          badge="Live Stream"
          badgeType="safe"
          icon={Activity}
          footnote="Continuously evaluated across all enterprise endpoints"
        />

        <MetricCard
          title="Critical Intercepts (Blocked)"
          value={stats ? stats.blocked_requests.toLocaleString() : '---'}
          subtitle={`${blockRate}% malicious or sensitive exfiltrations stopped`}
          badge={stats && stats.blocked_requests > 0 ? 'High Threat Intercepts' : 'Clear'}
          badgeType="crit"
          icon={ShieldAlert}
          footnote="Synchronous Fast Check overhead: <15ms"
        />

        <MetricCard
          title="Groundedness Warnings"
          value={stats ? stats.warning_requests.toLocaleString() : '---'}
          subtitle={`${warnRate}% responses flagged with citation notices`}
          badge="Judge Verified"
          badgeType="warn"
          icon={AlertTriangle}
          footnote="Parallel Deep Judge evaluation without user lag"
        />

        <MetricCard
          title="Hallucination Liability Avoided"
          value={stats ? `$${Math.round(stats.estimated_hallucination_damage_avoided_usd).toLocaleString()}` : '$0'}
          subtitle="Grounded in $67.4B global AI risk metric"
          badge="+24.8% ROI"
          badgeType="bronze"
          icon={DollarSign}
          footnote="Downstream damage & compliance breach savings"
        />
      </div>

      {/* Middle Analytical Row: Adaptive Gauge + OWASP Risks Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Adaptive Sampling Depth Controller */}
        <div className="lg:col-span-5 flex flex-col">
          <SamplingGauge
            currentRatePct={stats?.current_sampling_rate_pct || 25}
            isAdaptiveActive={stats?.adaptive_mode_active || false}
            anomalyRatePct={stats?.recent_anomaly_rate_pct || 0}
          />
        </div>

        {/* OWASP LLM Vulnerability Heatmap */}
        <div className="lg:col-span-7 bg-dark-900/90 rounded-2xl border border-dark-750 p-5 shadow-card-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400 font-mono">
                OWASP Top 10 for LLMs — Intercepted Threat Distribution
              </span>
              <p className="text-xs text-dark-400 mt-0.5">
                Real-time frequency of security, privacy, and hallucination threats caught by ControlPlane Checker
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-dark-800 text-accent-cyan border border-dark-700">
              Active Firewalls
            </span>
          </div>

          <div className="h-44 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={owaspData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fill: '#8596B8', fontSize: 11, fontFamily: 'monospace' }} width={60} />
                <Tooltip 
                  formatter={(value: any, name: any, item: any) => [`${value} incidents`, item.payload.fullName]}
                  contentStyle={{ backgroundColor: '#0C0F17', borderColor: '#1E273B', borderRadius: '12px', color: '#F3F4F6', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {owaspData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={OWASP_COLORS[index % OWASP_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-dark-800 text-[10px] font-mono text-dark-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" />
              <span className="truncate">LLM01: Injection</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" />
              <span className="truncate">LLM02: Sensitive PII</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" />
              <span className="truncate">LLM03: Hallucination</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
              <span className="truncate">LLM04: Compute Burn</span>
            </div>
          </div>
        </div>

      </div>

      {/* Selected Trace Drawer (if user clicked an item in feed) */}
      {selectedTrace && (
        <div className="relative">
          <button
            onClick={() => setSelectedTrace(null)}
            className="absolute top-4 right-4 z-10 text-xs text-dark-300 hover:text-white bg-dark-800 px-3 py-1 rounded-xl border border-dark-700"
          >
            Close Trace View ✕
          </button>
          <PipelineTrace evaluation={selectedTrace} />
        </div>
      )}

      {/* Live Telemetry Stream Feed */}
      <div className="bg-dark-900/90 rounded-3xl border border-dark-750 shadow-card-dark overflow-hidden">
        
        {/* Header & Controls */}
        <div className="p-5 border-b border-dark-800 bg-dark-850/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-status-safe animate-pulse" />
            <h3 className="font-display font-bold text-base text-white">
              Live Gateway Telemetry Stream
            </h3>
            <span className="text-[11px] font-mono text-dark-400 bg-dark-800 px-2.5 py-0.5 rounded-full border border-dark-700">
              {filteredFeed.length} events logged
            </span>
          </div>

          {/* Filter Pills & Search */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-dark-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search prompt, app, error..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-dark-700 bg-dark-800 text-white placeholder-dark-500 focus:outline-none focus:border-accent-gold font-sans w-48"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center bg-dark-800 p-0.5 rounded-xl border border-dark-700 text-xs font-medium">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'ALL' ? 'bg-dark-700 text-white shadow-sm font-semibold' : 'text-dark-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('CRITICAL_BLOCKED')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'CRITICAL_BLOCKED' ? 'bg-status-crit text-white shadow-sm font-semibold' : 'text-dark-400 hover:text-status-crit'
                }`}
              >
                Blocked ({stats?.blocked_requests || 0})
              </button>
              <button
                onClick={() => setFilterType('WARNING')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'WARNING' ? 'bg-status-warn text-white shadow-sm font-semibold' : 'text-dark-400 hover:text-status-warn'
                }`}
              >
                Warnings ({stats?.warning_requests || 0})
              </button>
              <button
                onClick={() => setFilterType('SAFE')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterType === 'SAFE' ? 'bg-status-safe text-white shadow-sm font-semibold' : 'text-dark-400 hover:text-status-safe'
                }`}
              >
                Clean Safe
              </button>
            </div>

          </div>
        </div>

        {/* Live List */}
        <div className="divide-y divide-dark-800/80 max-h-[480px] overflow-y-auto">
          {filteredFeed.length === 0 ? (
            <div className="p-12 text-center text-dark-500 font-sans text-xs">
              No matching telemetry events. Start the Enterprise Traffic Stream or run a prompt in the Gateway Lab!
            </div>
          ) : (
            filteredFeed.map((item) => {
              const isBlocked = item.tier === 'CRITICAL_BLOCKED';
              const isWarn = item.tier === 'WARNING';
              const isSafe = item.tier === 'SAFE';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTrace(item)}
                  className="p-4 hover:bg-dark-850/80 cursor-pointer transition-colors flex items-start justify-between group text-xs"
                >
                  <div className="flex items-start space-x-3.5 max-w-[75%]">
                    
                    {/* Status Icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      {isBlocked && (
                        <div className="w-7 h-7 rounded-xl bg-status-critBg border border-status-critBorder flex items-center justify-center text-status-crit">
                          <XCircle className="w-4 h-4" />
                        </div>
                      )}
                      {isWarn && (
                        <div className="w-7 h-7 rounded-xl bg-status-warnBg border border-status-warnBorder flex items-center justify-center text-status-warn">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      {isSafe && (
                        <div className="w-7 h-7 rounded-xl bg-status-safeBg border border-status-safeBorder flex items-center justify-center text-status-safe">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-medium text-dark-200 bg-dark-800 px-2 py-0.5 rounded-lg border border-dark-700 text-[10px]">
                          {item.application_id}
                        </span>
                        <span className="text-[10px] text-dark-500 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                        {item.fast_check.blocked && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-status-crit text-white font-bold">
                            BLOCKED BY FAST CHECK
                          </span>
                        )}
                        {item.judge_evaluation?.is_hallucinated && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-status-warnBg text-status-warn border border-status-warnBorder font-bold">
                            HALLUCINATION ({Math.round(item.judge_evaluation.groundedness_score * 100)}%)
                          </span>
                        )}
                      </div>

                      <p className="text-dark-100 font-sans line-clamp-1">
                        <strong>User:</strong> {item.prompt}
                      </p>

                      <p className="text-dark-400 font-mono text-[11px] line-clamp-1">
                        {isBlocked ? (
                          <span className="text-status-crit">🛑 {item.fast_check.block_reason}</span>
                        ) : (
                          <span>Response: {item.generated_text}</span>
                        )}
                      </p>
                    </div>

                  </div>

                  {/* Right Side Latencies & Inspect Action */}
                  <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="text-dark-400">Fast: <strong className="text-dark-200">{item.fast_check.latency_ms}ms</strong></span>
                      {item.judge_evaluation && (
                        <span className="text-dark-500">| Judge: <strong className="text-accent-cyan">{item.judge_evaluation.latency_ms}ms</strong></span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 text-accent-gold font-medium group-hover:translate-x-0.5 transition-transform text-[11px]">
                      <span>Inspect Trace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-dark-950/60 border-t border-dark-800 text-[10px] text-dark-500 font-mono flex items-center justify-between">
          <span>Model-Agnostic Universal Control Tower sitting inline with 100% telemetry.</span>
          <span className="text-status-safe">● WebSocket Telemetry Active</span>
        </div>

      </div>

    </div>
  );
};
