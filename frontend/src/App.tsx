import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPageView } from './views/LandingPageView';
import { ControlTowerView } from './views/ControlTowerView';
import { PlaygroundView } from './views/PlaygroundView';
import { IncidentQueueView } from './views/IncidentQueueView';
import { PolicyStudioView } from './views/PolicyStudioView';
import { EvaluationResponse, MetricsSummary, IncidentRecord, SystemPolicy } from './types';
import { 
  fetchStats, 
  fetchIncidents, 
  fetchPolicies, 
  fetchLiveFeed,
  toggleSimulator, 
  triggerAttackSurge, 
  resolveIncident,
  createTelemetryWebSocket 
} from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'control-tower' | 'playground' | 'incidents' | 'policies'>('home');

  // Core Data States
  const [stats, setStats] = useState<MetricsSummary | null>(null);
  const [liveFeed, setLiveFeed] = useState<EvaluationResponse[]>([]);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [policies, setPolicies] = useState<SystemPolicy | null>(null);
  const [isSimulatorRunning, setIsSimulatorRunning] = useState<boolean>(true);
  const [isSurging, setIsSurging] = useState<boolean>(false);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const [s, inc, pol, feed] = await Promise.all([
        fetchStats(),
        fetchIncidents(),
        fetchPolicies(),
        fetchLiveFeed(),
      ]);
      setStats(s);
      setIncidents(inc);
      setPolicies(pol);
      if (feed && feed.length > 0) {
        setLiveFeed(feed);
      }
    } catch (e) {
      console.error('Failed to load initial data', e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // WebSocket Live Stream Connection
  useEffect(() => {
    const ws = createTelemetryWebSocket((ev: EvaluationResponse) => {
      setLiveFeed((prev) => [ev, ...prev.slice(0, 49)]);
      setStats((prev) => {
        if (!prev) return null;
        const isBlocked = ev.tier === 'CRITICAL_BLOCKED';
        const isWarn = ev.tier === 'WARNING';
        const isSafe = ev.tier === 'SAFE';

        return {
          ...prev,
          total_requests: prev.total_requests + 1,
          blocked_requests: prev.blocked_requests + (isBlocked ? 1 : 0),
          warning_requests: prev.warning_requests + (isWarn ? 1 : 0),
          safe_requests: prev.safe_requests + (isSafe ? 1 : 0),
          estimated_hallucination_damage_avoided_usd:
            prev.estimated_hallucination_damage_avoided_usd + (isWarn || isBlocked ? 840 : 0),
        };
      });

      if (ev.tier === 'CRITICAL_BLOCKED' || ev.tier === 'WARNING') {
        fetchIncidents().then(setIncidents).catch(console.error);
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  const handleToggleSimulator = async () => {
    try {
      const res = await toggleSimulator(!isSimulatorRunning);
      setIsSimulatorRunning(res.simulator_running);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerSurge = async () => {
    setIsSurging(true);
    try {
      await triggerAttackSurge();
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSurging(false), 2000);
    }
  };

  const handleResolveIncident = async (incidentId: string, action: string, notes?: string) => {
    try {
      await resolveIncident(incidentId, action, notes);
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const pendingIncidentsCount = incidents.filter((i) => i.status === 'PENDING_REVIEW').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#EDF3FC] font-sans selection:bg-[#F59E0B]/20 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulatorRunning={isSimulatorRunning}
        onToggleSimulator={handleToggleSimulator}
        onTriggerSurge={handleTriggerSurge}
        isSurging={isSurging}
        groqActive={policies?.groq_api_key_configured || false}
        pendingIncidentsCount={pendingIncidentsCount}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'home' && (
          <LandingPageView
            onOpenControlTower={() => setActiveTab('control-tower')}
            onExplorePlayground={() => setActiveTab('playground')}
          />
        )}

        {activeTab === 'control-tower' && (
          <ControlTowerView
            stats={stats}
            liveFeed={liveFeed}
          />
        )}

        {activeTab === 'playground' && (
          <PlaygroundView
            onNewEvaluation={(ev) => {
              setLiveFeed((prev) => [ev, ...prev.slice(0, 49)]);
              fetchData();
            }}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentQueueView
            incidents={incidents}
            onResolveIncident={handleResolveIncident}
            onRefresh={fetchData}
          />
        )}

        {activeTab === 'policies' && (
          <PolicyStudioView
            policy={policies}
            onPolicyUpdated={(p) => setPolicies(p)}
          />
        )}

      </main>

      {/* Modern Dark Footer */}
      <footer className="border-t border-[#171E2E] bg-[#07090E]/90 backdrop-blur-md py-8 text-center text-xs text-[#64748B] font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-display font-bold text-white">ControlPlane.ai</span>
            <span className="text-gray-600">•</span>
            <span className="text-[#94A3B8]">Accenture Innovation Challenge 2026</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px] text-[#64748B]">
            <span>Universal LLM Gateway</span>
            <span>•</span>
            <span>Fast Inline Guard &lt;15ms</span>
            <span>•</span>
            <span>Parallel Judge Models</span>
          </div>

          <div className="text-[#94A3B8] text-[11px]">
            Lead Author: <strong className="text-white">Tanu Shree</strong>
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;
