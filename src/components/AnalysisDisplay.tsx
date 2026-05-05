import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DecisionAnalysis, ProCon } from '../types';
import { RefreshCcw, ThumbsUp, ThumbsDown, Target, Shield, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: DecisionAnalysis;
  onReset: () => void;
}

export function AnalysisDisplay({ analysis, onReset }: AnalysisDisplayProps) {
  const [activeTab, setActiveTab] = useState<'proscons' | 'swot' | 'comparison'>('proscons');

  const tabs = [
    { id: 'proscons', label: 'Analysis' },
    { id: 'swot', label: 'SWOT Matrix' },
    ...(analysis.comparison ? [{ id: 'comparison', label: 'Comparison' }] : []),
  ];

  return (
    <div className="space-y-12">
      {/* Overview Card / Verdict */}
      <div className="bg-amber-900/5 border border-amber-900/30 rounded-lg p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 z-10">
          <button
            onClick={onReset}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-600 hover:text-amber-500 transition-colors"
          >
            <RefreshCcw size={12} /> Restart Engine
          </button>
        </div>

        <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
          <Target size={300} strokeWidth={0.5} />
        </div>

        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
              <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-500 font-black">Tiebreaker Verdict</label>
            </div>
            <h2 className="text-5xl font-serif italic text-gray-100 tracking-tight leading-tight">
              {analysis.recommendation}
            </h2>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed italic font-serif max-w-2xl bg-[#0d0d0d]/50 p-6 rounded border-l-2 border-amber-800">
            "{analysis.summary}"
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-800 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-10 py-5 font-mono text-[10px] uppercase tracking-[0.3em] transition-all relative shrink-0 ${
              activeTab === tab.id ? 'text-amber-500 font-black' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500 shadow-[0_-2px_10px_rgba(245,158,11,0.4)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'proscons' && <ProsConsView items={analysis.prosCons} />}
        {activeTab === 'swot' && <SwotView swot={analysis.swot} />}
        {activeTab === 'comparison' && analysis.comparison && (
          <ComparisonView rows={analysis.comparison} options={analysis.options} />
        )}
      </div>
    </div>
  );
}

function ProsConsView({ items }: { items: ProCon[] }) {
  const pros = items.filter(i => i.type === 'pro');
  const cons = items.filter(i => i.type === 'con');

  const renderItem = (item: ProCon, isPro: boolean) => (
    <div key={item.item} className="group p-6 border-b border-gray-800/40 last:border-0 hover:bg-gray-800/10 transition-all">
      <div className="flex items-start gap-4">
        <span className={`text-xl font-bold mt-0.5 ${isPro ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPro ? '+' : '–'}
        </span>
        <div className="space-y-1.5">
          <h4 className="font-bold text-gray-100 text-sm tracking-tight">{item.item}</h4>
          <p className="text-xs text-gray-500 leading-relaxed font-sans italic">{item.description}</p>
          <div className="pt-2">
             <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 border border-gray-800 rounded-sm ${
              item.impact === 'high' ? 'bg-amber-900/20 text-amber-500 border-amber-900/50' : 
              'text-gray-600'
            }`}>
              {item.impact} impact
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
      <div className="bg-[#141414] border border-gray-800 rounded-lg flex flex-col shadow-xl overflow-hidden">
         <h3 className="font-serif text-lg text-emerald-100 p-6 border-b border-gray-800 flex items-center justify-between">
          <span>Advantage Indices</span>
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest font-bold">Positive</span>
        </h3>
        <div>{pros.map(item => renderItem(item, true))}</div>
      </div>
      <div className="bg-[#141414] border border-gray-800 rounded-lg flex flex-col shadow-xl overflow-hidden">
        <h3 className="font-serif text-lg text-rose-100 p-6 border-b border-gray-800 flex items-center justify-between">
          <span>Point of Friction</span>
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest font-bold">Negative</span>
        </h3>
        <div>{cons.map(item => renderItem(item, false))}</div>
      </div>
    </div>
  );
}

function SwotView({ swot }: { swot: DecisionAnalysis['swot'] }) {
  const sections = [
    { title: 'Strengths', data: swot.strengths, color: 'border-amber-600/50 text-amber-500' },
    { title: 'Weaknesses', data: swot.weaknesses, color: 'border-gray-600/50 text-gray-500' },
    { title: 'Opportunities', data: swot.opportunities, color: 'border-emerald-600/50 text-emerald-500' },
    { title: 'Threats', data: swot.threats, color: 'border-rose-600/50 text-rose-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
      {sections.map((s) => (
        <div key={s.title} className={`bg-[#1a1a1a] border-l-4 ${s.color} p-8 rounded-r-md shadow-lg space-y-6 hover:bg-[#1f1f1f] transition-all`}>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] font-black">{s.title}</h3>
          <ul className="space-y-4">
            {s.data.map((item, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <span className="text-xs text-gray-600 mt-0.5">•</span>
                <span className="text-sm font-sans text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ComparisonView({ rows, options }: { rows: NonNullable<DecisionAnalysis['comparison']>, options?: DecisionAnalysis['options'] }) {
  return (
    <div className="pt-8 overflow-x-auto">
      <table className="w-full border-collapse bg-[#141414] border border-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-900 text-gray-500 font-mono text-[9px] uppercase tracking-[0.3em] border-b border-gray-800">
            <th className="p-6 text-left border-r border-gray-800 font-black">Metric</th>
            <th className="p-6 text-left border-r border-gray-800 font-black">{options?.alpha || 'Option Alpha'}</th>
            <th className="p-6 text-left border-r border-gray-800 font-black">{options?.beta || 'Option Beta'}</th>
            <th className="p-6 text-center w-36 font-black italic">Differential</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/40">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-800/20 group transition-colors">
              <td className="p-6 border-r border-gray-800 font-mono text-[10px] uppercase tracking-wider text-amber-500/70 font-bold">{row.criterion}</td>
              <td className={`p-6 border-r border-gray-800 text-sm leading-relaxed ${row.score1 > row.score2 ? 'text-amber-500/90 font-medium' : row.score1 === row.score2 ? 'text-gray-300' : 'text-gray-600'}`}>
                {row.option1Value}
              </td>
              <td className={`p-6 border-r border-gray-800 text-sm leading-relaxed ${row.score2 > row.score1 ? 'text-amber-500/90 font-medium' : row.score1 === row.score2 ? 'text-gray-300' : 'text-gray-600'}`}>
                {row.option2Value}
              </td>
              <td className="p-6 text-center">
                <div className="flex flex-col gap-3 items-center">
                  <div className="flex justify-between w-full font-mono text-[9px] text-gray-500">
                    <span className={row.score1 >= row.score2 ? 'text-amber-500 font-bold' : ''}>{row.score1}</span>
                    <span className={row.score2 > row.score1 ? 'text-amber-500 font-bold' : ''}>{row.score2}</span>
                  </div>
                  <div className="w-full grid grid-cols-2 h-1 gap-1">
                    <div className="bg-gray-800 rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-amber-500/60" style={{ width: `${(row.score1 / 10) * 100}%` }} />
                    </div>
                    <div className="bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-500" style={{ width: `${(row.score2 / 10) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
