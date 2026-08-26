import React from 'react';
import { 
  Activity, PlayCircle, PauseCircle, Zap, Sliders, AlertTriangle, 
  Terminal, Home 
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'control-tower' | 'playground' | 'incidents' | 'policies';
  setActiveTab: (tab: 'home' | 'control-tower' | 'playground' | 'incidents' | 'policies') => void;
  isSimulatorRunning: boolean;
  onToggleSimulator: () => void;
  onTriggerSurge: () => void;
  isSurging: boolean;
  groqActive: boolean;
  pendingIncidentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isSimulatorRunning,
  onToggleSimulator,
  onTriggerSurge,
  isSurging,
  groqActive,
  pendingIncidentsCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#07090E]/90 backdrop-blur-xl text-[#EDF3FC] border-b border-[#1E273B] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Title (Enterprise badge removed) */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3.5 cursor-pointer group flex-shrink-0"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-[#0C0F17] border border-[#28334D] shadow-inner overflow-hidden group-hover:border-[#F59E0B]/60 transition-colors">
              <img 
                src="/logo.png" 
                alt="ControlPlane Logo" 
                className="w-8 h-8 object-contain drop-shadow-md" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  ControlPlane
                </span>
                <span className="font-display font-bold text-xl tracking-tight text-[#F59E0B]">
                  .ai
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] font-sans tracking-wide">
                AI Oversight & Guardrail Control Tower
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Spaced with distinct highlight color on active */}
          <nav className="flex items-center space-x-2 sm:space-x-3 bg-[#0C0F17] p-1.5 rounded-2xl border border-[#1E273B]">
            
            {/* 1. Home Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#07090E] shadow-lg shadow-[#F59E0B]/25 scale-105'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#171E2E]'
              }`}
            >
              <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-[#07090E]' : 'text-[#94A3B8]'}`} />
              <span>Home</span>
            </button>

            {/* 2. Control Tower Tab */}
            <button
              onClick={() => setActiveTab('control-tower')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'control-tower'
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#38BDF8] text-[#07090E] shadow-lg shadow-[#00F0FF]/25 scale-105'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#171E2E]'
              }`}
            >
              <Activity className={`w-4 h-4 ${activeTab === 'control-tower' ? 'text-[#07090E]' : 'text-[#00F0FF]'}`} />
              <span>Control Tower</span>
            </button>

            {/* 3. Gateway Lab Tab */}
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'playground'
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#07090E] shadow-lg shadow-[#F59E0B]/25 scale-105'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#171E2E]'
              }`}
            >
              <Terminal className={`w-4 h-4 ${activeTab === 'playground' ? 'text-[#07090E]' : 'text-[#F59E0B]'}`} />
              <span>Gateway Lab</span>
            </button>

            {/* 4. HITL Queue Tab */}
            <button
              onClick={() => setActiveTab('incidents')}
              className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'incidents'
                  ? 'bg-gradient-to-r from-[#EF4444] to-[#F87171] text-white shadow-lg shadow-[#EF4444]/25 scale-105'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#171E2E]'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 ${activeTab === 'incidents' ? 'text-white' : 'text-[#EF4444]'}`} />
              <span>HITL Queue</span>
              {pendingIncidentsCount > 0 && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'incidents' ? 'bg-white text-[#EF4444]' : 'bg-[#EF4444] text-white'
                }`}>
                  {pendingIncidentsCount}
                </span>
              )}
            </button>

            {/* 5. Policies Tab */}
            <button
              onClick={() => setActiveTab('policies')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'policies'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white shadow-lg shadow-[#8B5CF6]/25 scale-105'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#171E2E]'
              }`}
            >
              <Sliders className={`w-4 h-4 ${activeTab === 'policies' ? 'text-white' : 'text-[#8B5CF6]'}`} />
              <span>Policies</span>
            </button>

          </nav>

          {/* Right Section: Simulator, Threat Surge & Tanu Shree Lead Badge */}
          <div className="flex items-center space-x-3">
            
            {/* Live Traffic Simulator Toggle */}
            <button
              onClick={onToggleSimulator}
              className={`hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isSimulatorRunning
                  ? 'bg-[#171E2E] border-[#F59E0B]/50 text-[#F59E0B]'
                  : 'bg-[#0C0F17] border-[#1E273B] text-[#94A3B8] hover:text-white hover:bg-[#171E2E]'
              }`}
              title={isSimulatorRunning ? 'Pause live enterprise traffic stream' : 'Start live enterprise traffic stream'}
            >
              {isSimulatorRunning ? (
                <>
                  <PauseCircle className="w-3.5 h-3.5 text-[#F59E0B] animate-pulse" />
                  <span>Stream Active</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>Stream Sim</span>
                </>
              )}
            </button>

            {/* Trigger Threat Surge Button */}
            <button
              onClick={onTriggerSurge}
              disabled={isSurging}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#07090E] shadow-lg shadow-[#F59E0B]/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Inject a rapid burst of attacks to demonstrate Adaptive Sampling auto-climb to 85%"
            >
              <Zap className={`w-3.5 h-3.5 ${isSurging ? 'animate-bounce' : ''}`} />
              <span>{isSurging ? 'Surging...' : 'Threat Surge'}</span>
            </button>

            {/* Tanu Shree Lead Badge */}
            <div className="flex items-center space-x-2.5 pl-3 border-l border-[#1E273B]">
              <div className="w-8 h-8 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/50 flex items-center justify-center text-[#F59E0B] font-bold text-xs overflow-hidden shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Tanu Shree" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-tight">
                  Tanu Shree
                </div>
                <div className="text-[10px] text-[#F59E0B] font-mono">
                  Accenture Lead
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
