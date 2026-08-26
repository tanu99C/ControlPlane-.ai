import { EvaluationResponse, MetricsSummary, IncidentRecord, SystemPolicy } from '../types';

const API_BASE = 'http://localhost:8000/api';
const WS_BASE = 'ws://localhost:8000/ws/telemetry';

export async function fetchStats(): Promise<MetricsSummary> {
  const res = await fetch(`${API_BASE}/telemetry/stats`);
  if (!res.ok) throw new Error('Failed to fetch telemetry stats');
  return res.json();
}

export async function fetchLiveFeed(): Promise<EvaluationResponse[]> {
  const res = await fetch(`${API_BASE}/telemetry/live-feed`);
  if (!res.ok) throw new Error('Failed to fetch live feed');
  return res.json();
}

export async function fetchIncidents(status: string = 'ALL'): Promise<IncidentRecord[]> {
  const res = await fetch(`${API_BASE}/incidents?status=${status}`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function resolveIncident(incidentId: string, action: string, notes?: string): Promise<IncidentRecord> {
  const res = await fetch(`${API_BASE}/incidents/${incidentId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, notes })
  });
  if (!res.ok) throw new Error('Failed to resolve incident');
  return res.json();
}

export async function fetchPolicies(): Promise<SystemPolicy> {
  const res = await fetch(`${API_BASE}/policies`);
  if (!res.ok) throw new Error('Failed to fetch policies');
  return res.json();
}

export async function updatePolicies(policy: SystemPolicy): Promise<SystemPolicy> {
  const res = await fetch(`${API_BASE}/policies`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(policy)
  });
  if (!res.ok) throw new Error('Failed to update policies');
  return res.json();
}

export async function evaluatePrompt(payload: {
  prompt: string;
  context?: string;
  system_prompt?: string;
  response_override?: string;
  model?: string;
  application_id?: string;
}): Promise<EvaluationResponse> {
  const res = await fetch(`${API_BASE}/proxy/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to evaluate prompt through proxy');
  return res.json();
}

export async function toggleSimulator(running: boolean, speedSec: number = 3.0): Promise<{ simulator_running: boolean }> {
  const res = await fetch(`${API_BASE}/simulator/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ running, speed_sec: speedSec })
  });
  if (!res.ok) throw new Error('Failed to toggle traffic simulator');
  return res.json();
}

export async function triggerAttackSurge(): Promise<{ surge_dispatched: number; adaptive_sampling_rate_pct: number }> {
  const res = await fetch(`${API_BASE}/simulator/surge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to trigger attack surge');
  return res.json();
}

export async function checkHealth(): Promise<{ status: string; groq_active: boolean; simulator_running: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to check health');
  return res.json();
}

export function createTelemetryWebSocket(onMessage: (data: any) => void): WebSocket {
  const ws = new WebSocket(WS_BASE);
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error('Error parsing WS message', e);
    }
  };
  return ws;
}
