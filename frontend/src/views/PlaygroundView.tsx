import React, { useState } from 'react';
import { Play, RefreshCw, Terminal, BookOpen, Plus, Trash2, Sparkles } from 'lucide-react';
import { DEMO_PRESETS } from '../services/presets';
import { DemoPreset, EvaluationResponse } from '../types';
import { evaluatePrompt } from '../services/api';
import { PipelineTrace } from '../components/PipelineTrace';

interface PlaygroundViewProps {
  onNewEvaluation: (ev: EvaluationResponse) => void;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({ onNewEvaluation }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [context, setContext] = useState<string>('');
  const [showContextInput, setShowContextInput] = useState<boolean>(false);
  const [responseOverride, setResponseOverride] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResponse | null>(null);

  const handleSelectPreset = (preset: DemoPreset) => {
    setSelectedPresetId(preset.id);
    setPrompt(preset.prompt);
    if (preset.context) {
      setContext(preset.context);
      setShowContextInput(true);
    } else {
      setContext('');
      setShowContextInput(false);
    }
    setResponseOverride(preset.responseOverride || '');
    setResult(null);
  };

  const handleClear = () => {
    setPrompt('');
    setContext('');
    setResponseOverride('');
    setSelectedPresetId('');
    setShowContextInput(false);
    setResult(null);
  };

  const handleRunEvaluation = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const resp = await evaluatePrompt({
        prompt: prompt.trim(),
        context: showContextInput && context.trim() ? context.trim() : undefined,
        response_override: responseOverride.trim() ? responseOverride.trim() : undefined,
      });
      setResult(resp);
      onNewEvaluation(resp);
    } catch (e) {
      console.error('Evaluation failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto text-[#EDF3FC]">
      
      {/* 1-Click Demo Scenarios */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] font-mono flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>1-Click Live Pitch Presets</span>
          </span>
          <span className="text-[11px] text-[#64748B] font-sans">
            Click any scenario to pre-fill test attack or grounding vectors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#171E2E] border-[#F59E0B] shadow-lg shadow-[#F59E0B]/20 ring-2 ring-[#F59E0B]/50'
                    : 'bg-[#0C0F17] border-[#1E273B] hover:border-[#3B4A6B] shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                    p.badgeType === 'crit' ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40' :
                    p.badgeType === 'warn' ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40' :
                    'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40'
                  }`}>
                    {p.category}
                  </span>
                </div>
                <h4 className="font-display font-semibold text-xs text-white truncate mt-1">
                  {p.title}
                </h4>
                <p className="text-[11px] text-[#94A3B8] font-sans mt-0.5 line-clamp-1">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sandbox Grid (Left: Input | Right: Results) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Clean Prompt Box (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-[#0C0F17] rounded-3xl border border-[#1E273B] p-6 shadow-2xl space-y-4">
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                  Enter User Prompt
                </label>
                {prompt.length > 0 && (
                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    {prompt.length} chars
                  </span>
                )}
              </div>

              {/* High-Contrast Crisp Black Text on White Background */}
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (selectedPresetId) {
                    setSelectedPresetId('');
                    setResponseOverride('');
                  }
                }}
                placeholder="Ask anything (e.g. 'What is machine learning?', or test a PII leak / prompt injection)..."
                className="w-full p-4 rounded-2xl border-2 border-[#CBD5E1] bg-white text-[#0A0D14] placeholder:text-[#64748B] font-sans text-xs font-semibold leading-relaxed focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/30 shadow-inner"
              />
            </div>

            {/* Optional Context Box Toggle */}
            {showContextInput ? (
              <div className="pt-3 border-t border-[#1E273B]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Reference Context (For Hallucination Checking)</span>
                  </label>
                  <button
                    onClick={() => {
                      setShowContextInput(false);
                      setContext('');
                    }}
                    className="text-[11px] text-[#EF4444] hover:underline font-sans cursor-pointer font-semibold"
                  >
                    Remove Context
                  </button>
                </div>

                {/* High-Contrast Crisp Black Text on White Background */}
                <textarea
                  rows={3}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Paste reference document or facts to verify if AI stays grounded..."
                  className="w-full p-3.5 rounded-2xl border-2 border-[#CBD5E1] bg-white text-[#0A0D14] placeholder:text-[#64748B] text-xs font-semibold font-sans leading-relaxed focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/30 shadow-inner"
                />
              </div>
            ) : (
              <button
                onClick={() => setShowContextInput(true)}
                className="flex items-center space-x-1.5 text-xs text-[#F59E0B] hover:text-[#FBBF24] font-semibold py-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ground Truth Document / Reference Context (Optional)</span>
              </button>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1E273B]">
              <button
                onClick={handleClear}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-[#171E2E] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <button
                onClick={handleRunEvaluation}
                disabled={isLoading || !prompt.trim()}
                className="flex items-center space-x-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#07090E] font-display font-bold text-xs shadow-lg shadow-[#F59E0B]/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#07090E]" />
                    <span>Evaluating Gateway...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#07090E] fill-current" />
                    <span>Run Through ControlPlane</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Clean Diagnostics Output (6 cols) */}
        <div className="lg:col-span-6">
          {result ? (
            <PipelineTrace evaluation={result} />
          ) : (
            <div className="bg-[#0C0F17] rounded-3xl border border-dashed border-[#1E273B] p-12 text-center flex flex-col items-center justify-center shadow-xl min-h-[300px]">
              <div className="w-12 h-12 rounded-2xl bg-[#171E2E] border border-[#28334D] flex items-center justify-center text-[#F59E0B] mb-3 shadow-inner">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-white">
                Ready for Live Execution
              </h3>
              <p className="text-xs text-[#94A3B8] font-sans mt-1 max-w-xs leading-relaxed">
                Type your prompt on the left or click a demo preset, then click <strong>"Run Through ControlPlane"</strong>.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
