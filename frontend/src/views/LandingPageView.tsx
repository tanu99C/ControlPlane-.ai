import React from 'react';
import { 
  ShieldCheck, Terminal, ArrowRight, Lock, 
  Sparkles, Zap, Activity
} from 'lucide-react';

interface LandingPageViewProps {
  onOpenControlTower: () => void;
  onExplorePlayground: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenControlTower,
  onExplorePlayground,
}) => {
  return (
    <div className="space-y-12 animate-fade-in text-[#EDF3FC] pb-12">
      
      {/* 1. FULL-WIDTH HERO SECTION WITH IMAGE FILLING THE FRONT PAGE */}
      <section className="relative rounded-3xl overflow-hidden border border-[#1E273B] bg-[#0C0F17] shadow-2xl">
        
        {/* Full-width Hero Banner Image */}
        <div className="relative w-full overflow-hidden group">
          <img
            src="/hero_banner.png"
            alt="ControlPlane.ai Banner - Claude, OpenAI, Gemini, Tanu Shree"
            className="w-full h-auto object-cover max-h-[580px] sm:max-h-[660px] rounded-t-3xl transition-transform duration-500 group-hover:scale-[1.01]"
          />
          
          {/* Subtle dark gradient overlay at bottom of banner for seamless transition */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0C0F17] via-[#0C0F17]/70 to-transparent" />
        </div>

        {/* Hero Interactive Call To Action Container */}
        <div className="px-6 sm:px-10 pb-10 pt-4 max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#171E2E] border border-[#28334D] text-xs font-mono text-[#FDE68A] mb-4 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span>Accenture Innovation Challenge 2026</span>
            <span className="text-gray-500">•</span>
            <span className="text-white font-semibold">AI Governance Control Tower</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            The Real-Time AI Oversight Layer That Catches Risk Before It Costs You.
          </h1>
          
          <p className="mt-4 text-sm sm:text-base text-[#94A3B8] font-sans max-w-3xl mx-auto leading-relaxed">
            Model-agnostic guardrail control tower for enterprise GenAI. Evaluates every LLM interaction across <strong>Performance, Cost, Security, and Factual Grounding</strong> with &lt;15ms fast filters and parallel Judge Models.
          </p>

          {/* PRIMARY CALL TO ACTION BUTTONS (Direct Access) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Open Control Tower Button */}
            <button
              onClick={onOpenControlTower}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00F0FF] text-[#07090E] font-display font-bold text-sm shadow-xl transition-all duration-200 active:scale-95 group cursor-pointer"
            >
              <Activity className="w-5 h-5 text-[#07090E]" />
              <span>Open Control Tower Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#07090E] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Sandbox Gateway Lab Button */}
            <button
              onClick={onExplorePlayground}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#07090E] font-display font-bold text-sm shadow-xl transition-all duration-200 active:scale-95 group cursor-pointer"
            >
              <Terminal className="w-5 h-5 text-[#07090E]" />
              <span>Test Live Gateway Lab</span>
              <ArrowRight className="w-4 h-4 text-[#07090E] group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

          <div className="mt-4 text-[11px] font-mono text-[#64748B]">
            All tabs unlocked • Live Groq Llama 3 connection active • Real-time telemetry enabled
          </div>

        </div>

      </section>

      {/* 2. EXECUTIVE PROBLEM STATEMENT & RESEARCH DATA */}
      <section className="space-y-6">
        
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] font-semibold">
            Supported by 2025 Industry Research
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            The Enterprise AI Oversight Blind Spot
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-sans max-w-2xl mx-auto mt-1.5">
            What happens when an AI gives an answer that sounds right — but isn't? Deploying a model was never the hard part. Trusting what it says is.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-3xl bg-[#0C0F17] border border-[#1E273B] shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-3xl font-extrabold font-display text-[#F59E0B]">
                $67.4B
              </div>
              <h4 className="text-xs font-mono uppercase text-white font-semibold mt-1">
                Hallucination Business Loss
              </h4>
              <p className="text-xs text-[#94A3B8] font-sans mt-2 leading-relaxed">
                Estimated global cost of AI hallucinations and bad decision-making in enterprise workflows in 2024.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] pt-4 border-t border-[#171E2E] mt-4">
              Source: AllAboutAI / Korra Report
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-[#0C0F17] border border-[#1E273B] shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-3xl font-extrabold font-display text-[#EF4444]">
                97%
              </div>
              <h4 className="text-xs font-mono uppercase text-white font-semibold mt-1">
                Security Access Failures
              </h4>
              <p className="text-xs text-[#94A3B8] font-sans mt-2 leading-relaxed">
                Of organizations reporting AI security incidents lacked real-time inline access and prompt-injection guardrails.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] pt-4 border-t border-[#171E2E] mt-4">
              Source: IBM 2025 Findings
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-[#0C0F17] border border-[#1E273B] shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-3xl font-extrabold font-display text-[#00F0FF]">
                63%
              </div>
              <h4 className="text-xs font-mono uppercase text-white font-semibold mt-1">
                Lack Formal Governance
              </h4>
              <p className="text-xs text-[#94A3B8] font-sans mt-2 leading-relaxed">
                Enterprises deploy LLMs to production without automated quality gates, relying solely on uptime logs.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] pt-4 border-t border-[#171E2E] mt-4">
              Source: Deloitte AI Survey
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-[#0C0F17] border border-[#1E273B] shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-3xl font-extrabold font-display text-[#10B981]">
                &lt;15ms
              </div>
              <h4 className="text-xs font-mono uppercase text-white font-semibold mt-1">
                Fast Guard Overhead
              </h4>
              <p className="text-xs text-[#94A3B8] font-sans mt-2 leading-relaxed">
                Synchronous PII and injection inspection intercepts high-threat attacks without adding user latency.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] pt-4 border-t border-[#171E2E] mt-4">
              ControlPlane Checker SLA
            </span>
          </div>

        </div>

      </section>

      {/* 3. DUAL-SPEED ARCHITECTURAL SOLUTION */}
      <section className="space-y-6">
        
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] font-semibold">
            How ControlPlane Checker Solves It
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            Dual-Speed Evaluation & Control Tower
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-sans max-w-2xl mx-auto mt-1.5">
            Not all checks need to run at the same speed. Fast signals run synchronously, while deep judge models verify truth in parallel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-[#0C0F17] border border-[#1E273B] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#171E2E] border border-[#28334D] flex items-center justify-center text-[#EF4444]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              1. Fast Inline Security
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              Scans for PII (Credit Cards, SSNs, API Keys) and adversarial prompt injections in <strong>&lt;15ms</strong>. Stops delivery immediately on high risk.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-[#0C0F17] border border-[#1E273B] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#171E2E] border border-[#28334D] flex items-center justify-center text-[#00F0FF]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              2. Parallel Judge Model
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              Compares LLM answers against ground truth retrieved context (RAG) to catch hallucinations and attach citation warning badges.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-[#0C0F17] border border-[#1E273B] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#171E2E] border border-[#28334D] flex items-center justify-center text-[#F59E0B]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              3. Dynamic Auto-Scaling
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              Samples 25% of routine traffic to conserve compute budget, but dynamically climbs to <strong>85%–100%</strong> during attack spikes.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-3xl bg-[#0C0F17] border border-[#1E273B] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#171E2E] border border-[#28334D] flex items-center justify-center text-[#10B981]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              4. HITL Audit Trail
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              Compliance officers review flagged interactions, perform 1-click overrides or redirects, and export timestamped compliance logs.
            </p>
          </div>

        </div>

      </section>

      {/* 4. BOTTOM ACTION CALLOUT */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#111622] to-[#0C0F17] border border-[#1E273B] shadow-2xl text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Ready to Explore the Live Control Tower?
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-sans">
            Launch the Control Tower to view real-time telemetry, test custom queries in the Gateway Lab, and trigger simulated threat surges.
          </p>

          <div className="pt-3 flex justify-center gap-4 flex-wrap">
            <button
              onClick={onOpenControlTower}
              className="flex items-center space-x-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#38BDF8] text-[#07090E] font-display font-bold text-sm shadow-xl transition-all active:scale-98 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-[#07090E]" />
              <span>Launch Control Tower</span>
              <ArrowRight className="w-4 h-4 text-[#07090E]" />
            </button>

            <button
              onClick={onExplorePlayground}
              className="flex items-center space-x-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#07090E] font-display font-bold text-sm shadow-xl transition-all active:scale-98 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-[#07090E]" />
              <span>Gateway Lab Sandbox</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
