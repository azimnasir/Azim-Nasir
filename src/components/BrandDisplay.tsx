import React from 'react';
import { motion } from 'motion/react';
import { BrandProfile, BrandAsset } from '../types';
import { RefreshCcw, Loader2, Target, Palette, Volume2, Maximize2 } from 'lucide-react';

interface BrandDisplayProps {
  profile: BrandProfile;
  onReset: () => void;
}

export function BrandDisplay({ profile, onReset }: BrandDisplayProps) {
  return (
    <div className="space-y-16 pb-24">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-500 font-black">Brand Identity Established</label>
          </div>
          <h2 className="text-5xl font-serif italic text-gray-100 tracking-tight leading-tight">
            {profile.productName}
          </h2>
          <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
            {profile.description}
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-600 hover:text-amber-500 transition-colors bg-gray-900/50 px-4 py-2 rounded border border-gray-800"
        >
          <RefreshCcw size={12} /> New Brand Concept
        </button>
      </div>

      {/* Brand DNA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DnaCard 
          icon={<Palette size={18} className="text-amber-500" />} 
          label="Visual Identity" 
          value={profile.visualIdentity} 
        />
        <DnaCard 
          icon={<Target size={18} className="text-amber-500" />} 
          label="Target Audience" 
          value={profile.targetAudience} 
        />
        <DnaCard 
          icon={<Volume2 size={18} className="text-amber-500" />} 
          label="Brand Voice" 
          value={profile.brandVoice} 
        />
      </div>

      {/* Assets Grid */}
      <div className="space-y-8">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-gray-700 font-black border-b border-gray-800 pb-4">
          Multi-Medium Renderings
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {profile.assets.map((asset, index) => (
            <AssetCard key={asset.medium} asset={asset} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface DnaCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DnaCard({ icon, label, value }: DnaCardProps) {
  return (
    <div className="bg-[#141414] border border-gray-800 p-8 rounded-lg space-y-4 hover:border-amber-500/30 transition-colors group">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 group-hover:text-amber-500 transition-colors font-bold">{label}</span>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed italic font-serif">
        "{value}"
      </p>
    </div>
  );
}

interface AssetCardProps {
  asset: BrandAsset;
  index: number;
  key?: React.Key;
}

function AssetCard({ asset, index }: AssetCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#141414] border border-gray-800 rounded-lg overflow-hidden flex flex-col shadow-2xl group"
    >
      <div className="relative aspect-video bg-[#0d0d0d] flex items-center justify-center overflow-hidden">
        {asset.loading ? (
          <div className="flex flex-col items-center gap-4 text-gray-600 font-mono text-[10px] uppercase tracking-widest">
            <Loader2 size={32} className="animate-spin text-amber-500/50" />
            Rendering Medium...
          </div>
        ) : asset.imageUrl ? (
          <>
            <img 
              src={asset.imageUrl} 
              alt={`${asset.medium} for brand`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-[#0d0d0d]/80 p-2 rounded backdrop-blur-sm text-gray-400 hover:text-amber-500 transition-colors">
                <Maximize2 size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-rose-500 font-mono text-[10px] uppercase tracking-widest text-center px-6">
            Rendering Failed // Check Logs
          </div>
        )}
      </div>

      <div className="p-8 space-y-6 flex-grow flex flex-col">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber-500/70 font-black">{asset.medium}</span>
            <div className="h-px bg-gray-800 flex-grow ml-4 mx-2 opacity-50" />
          </div>
          <h4 className="text-xl font-serif italic text-gray-100 leading-tight">
            {asset.tagline}
          </h4>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-800/50">
          <label className="font-mono text-[8px] uppercase tracking-widest text-gray-600 block mb-2 font-bold">Imagination Kernel</label>
          <p className="text-[10px] text-gray-500 leading-relaxed font-sans line-clamp-3 group-hover:line-clamp-none transition-all">
            {asset.imagePrompt}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
