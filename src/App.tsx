import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeDecision } from './services/geminiService';
import { DecisionAnalysis } from './types';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Header } from './components/Header';
import { Sparkles, History, Github } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (decision: string, opt1?: string, opt2?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeDecision(decision, opt1, opt2);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-300 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5 space-y-6">
                  <h1 className="text-6xl font-serif italic text-gray-100 tracking-tighter leading-[0.9]">
                    The <br /> 
                    <span className="text-amber-500 not-italic font-sans uppercase text-4xl tracking-widest font-bold">Tiebreaker</span>
                    <span className="block text-[10px] font-mono text-gray-700 uppercase tracking-[0.4em] mt-6 ml-1">Analytical Engine by Azim Nasir</span>
                  </h1>
                  <p className="text-lg text-gray-400 max-w-md font-sans">
                    An analytical decision engine designed to dissect complex dilemmas with cold, AI-driven logic.
                  </p>
                  
                  <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-500/60 font-bold">
                      <Sparkles size={14} /> Neural Analysis
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-600">
                      <History size={14} /> Version 4.2
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <DecisionForm onSubmit={handleAnalyze} isLoading={loading} />
                  {error && (
                    <p className="mt-4 text-rose-500 font-mono text-xs uppercase px-4">{error}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <AnalysisDisplay analysis={analysis} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-gray-800 mt-24 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600">
          <div className="space-y-1">
            <p>© 2026 THE TIEBREAKER // ANALYTICAL ENGINE</p>
            <p className="text-gray-700">LOG_ID: DEC_7719_X // CONFIDENCE: 88.4%</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">API Docs</a>
            <a href="#" className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <Github size={12} /> Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
