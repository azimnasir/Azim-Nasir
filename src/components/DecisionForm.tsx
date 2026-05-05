import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2, Plus, Minus } from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (decision: string, opt1?: string, opt2?: string) => void;
  isLoading: boolean;
}

export function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [decision, setDecision] = useState('');
  const [isComparison, setIsComparison] = useState(false);
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;
    if (isComparison && (!option1.trim() || !option2.trim())) return;
    
    onSubmit(decision, isComparison ? option1 : undefined, isComparison ? option2 : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-gray-800 p-10 rounded-lg shadow-2xl">
      <div className="space-y-10">
        <div className="space-y-3">
          <label className="font-mono text-[10px] uppercase tracking-widest text-gray-500 block font-bold">
            Inquiry Parameters
          </label>
          <textarea
            required
            placeholder="Describe the decision or dilemma..."
            className="w-full bg-[#0d0d0d] border border-gray-800 p-5 text-gray-200 text-sm focus:outline-none focus:border-amber-500 transition-all resize-none h-40 rounded font-sans leading-relaxed"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[10px] uppercase tracking-widest text-gray-500 block font-bold">
              Comparative Analysis
            </label>
            <button
              type="button"
              onClick={() => setIsComparison(!isComparison)}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
            >
              {isComparison ? (
                <>
                  <Minus size={12} /> Single Path
                </>
              ) : (
                <>
                  <Plus size={12} /> Double Path
                </>
              )}
            </button>
          </div>

          {isComparison && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
            >
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-gray-600 block">Option Alpha</label>
                <input
                  type="text"
                  placeholder="e.g., Status Quo"
                  className="w-full bg-[#0d0d0d] border border-gray-800 p-4 text-gray-200 text-sm focus:outline-none focus:border-amber-500 rounded"
                  value={option1}
                  onChange={(e) => setOption1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-gray-600 block">Option Beta</label>
                <input
                  type="text"
                  placeholder="e.g., Strategic Pivot"
                  className="w-full bg-[#0d0d0d] border border-gray-800 p-4 text-gray-200 text-sm focus:outline-none focus:border-amber-500 rounded"
                  value={option2}
                  onChange={(e) => setOption2(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !decision.trim()}
          className="w-full h-16 bg-amber-600 text-gray-100 font-mono text-[11px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-4 hover:bg-amber-500 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group rounded active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin text-amber-200" size={18} /> Processing Logic...
            </>
          ) : (
            <>
              Execute Analysis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
