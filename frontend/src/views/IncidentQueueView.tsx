import React, { useState } from 'react';
import { 
  ShieldAlert, Download, Search, Eye, RefreshCw 
} from 'lucide-react';
import { IncidentRecord, IncidentStatus } from '../types';
import { IncidentModal } from '../components/IncidentModal';

interface IncidentQueueViewProps {
  incidents: IncidentRecord[];
  onResolveIncident: (incidentId: string, action: string, notes?: string) => Promise<void>;
  onRefresh: () => void;
}

export const IncidentQueueView: React.FC<IncidentQueueViewProps> = ({
  incidents,
  onResolveIncident,
  onRefresh,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchesSearch =
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.application_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.risk_category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = incidents.filter((i) => i.status === 'PENDING_REVIEW').length;
  const approvedCount = incidents.filter((i) => i.status === 'APPROVED').length;
  const rejectedCount = incidents.filter((i) => i.status === 'REJECTED').length;

  const exportAuditLog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ControlPlane_Audit_Log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return 'bg-status-warnBg text-status-warn border-status-warnBorder animate-pulse-subtle font-semibold';
      case 'APPROVED':
        return 'bg-status-safeBg text-status-safe border-status-safeBorder font-semibold';
      case 'REJECTED':
        return 'bg-status-critBg text-status-crit border-status-critBorder font-semibold';
      case 'REDIRECTED':
        return 'bg-accent-gold/15 text-accent-gold border-accent-gold/40 font-semibold';
      default:
        return 'bg-dark-800 text-dark-300 border-dark-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-dark-100 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-accent-gold font-mono text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Human-in-the-Loop Oversight Hub</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            Incident Triage & Audit Trail
          </h2>
          <p className="text-xs text-dark-400 font-sans mt-0.5">
            Review intercepted high-risk prompts, audit judge critiques, and execute 1-click remediation actions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-dark-750 bg-dark-900 text-dark-300 hover:text-white hover:bg-dark-800 transition-colors shadow-card-dark"
            title="Refresh Incident Queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={exportAuditLog}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-dark-800 to-dark-750 hover:from-dark-750 hover:to-dark-700 border border-dark-700 text-white text-xs font-semibold shadow-card-dark transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-accent-gold" />
            <span>Export Compliance Audit Package</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-dark-900/90 rounded-3xl border border-dark-750 shadow-card-dark overflow-hidden">
        
        {/* Table Filters Header */}
        <div className="p-4 border-b border-dark-800 bg-dark-850/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center bg-dark-800 p-0.5 rounded-xl border border-dark-700 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'ALL' ? 'bg-dark-700 text-white shadow-sm font-semibold' : 'text-dark-400 hover:text-white'
              }`}
            >
              All ({incidents.length})
            </button>

            <button
              onClick={() => setStatusFilter('PENDING_REVIEW')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'PENDING_REVIEW' ? 'bg-status-warn text-white shadow-sm font-semibold' : 'text-dark-400 hover:text-status-warn'
              }`}
            >
              Pending ({pendingCount})
            </button>

            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'APPROVED' ? 'bg-status-safe text-white shadow-sm font-semibold' : 'text-dark-400 hover:text-status-safe'
              }`}
            >
              Approved ({approvedCount})
            </button>

            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'REJECTED' ? 'bg-status-crit text-white shadow-sm font-semibold' : 'text-dark-400 hover:text-status-crit'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-dark-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, app, prompt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-dark-700 bg-dark-800 text-white placeholder-dark-500 focus:outline-none focus:border-accent-gold font-sans w-60"
            />
          </div>

        </div>

        {/* Incidents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-dark-200">
            <thead className="bg-dark-950/50 border-b border-dark-800 font-mono text-[10px] uppercase tracking-wider text-dark-400">
              <tr>
                <th className="py-3.5 px-4">Incident ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Source App</th>
                <th className="py-3.5 px-4">Threat Category</th>
                <th className="py-3.5 px-4">User Prompt</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-800/60">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-dark-500 font-sans">
                    No incidents matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-dark-850/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedIncident(inc)}
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      {inc.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-dark-400 whitespace-nowrap">
                      {new Date(inc.timestamp).toLocaleTimeString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-dark-300">
                      {inc.application_id}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-dark-800 text-dark-200 border border-dark-700 font-medium">
                        {inc.risk_category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs font-sans text-dark-100 truncate">
                      {inc.prompt}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${getStatusBadge(inc.status)}`}>
                        {inc.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIncident(inc);
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-dark-800 hover:bg-dark-750 text-dark-200 hover:text-white text-[11px] font-medium border border-dark-700 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-accent-gold" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-dark-950/60 border-t border-dark-800 text-[10px] font-mono text-dark-500 flex items-center justify-between">
          <span>Showing {filteredIncidents.length} of {incidents.length} recorded incidents.</span>
          <span className="text-status-safe">● HITL Protocol Compliant</span>
        </div>

      </div>

      {/* Review Modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onResolve={onResolveIncident}
        />
      )}

    </div>
  );
};
