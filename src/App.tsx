import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateBrandProfile, generateBrandImage } from './services/geminiService';
import { BrandProfile, BrandAsset } from './types';
import { BrandForm } from './components/BrandForm';
import { BrandDisplay } from './components/BrandDisplay';
import { Header } from './components/Header';
import { Sparkles, Image as ImageIcon, Github, Wand2 } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBuildBrand = async (productName: string, description: string) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await generateBrandProfile(productName, description);
      
      // Initialize assets with loading state
      const initialProfile = {
        ...profile,
        assets: profile.assets.map(asset => ({ ...asset, loading: true }))
      };
      setBrandProfile(initialProfile);
      
      // Sequentially generate images to avoid overwhelming rate limits, or in parallel if allowed
      // Let's do them in parallel for speed if it's just 3 images
      const updatedAssets = await Promise.all(profile.assets.map(async (asset) => {
        try {
          const imageUrl = await generateBrandImage(asset.imagePrompt);
          return { ...asset, imageUrl, loading: false };
        } catch (err) {
          console.error(`Failed to generate image for ${asset.medium}:`, err);
          return { ...asset, loading: false };
        }
      }));

      setBrandProfile(prev => prev ? { ...prev, assets: updatedAssets } : null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBrandProfile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-300 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!brandProfile ? (
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
                    Brand <br /> 
                    <span className="text-amber-500 not-italic font-sans uppercase text-4xl tracking-widest font-bold">Builder</span>
                    <span className="block text-[10px] font-mono text-gray-700 uppercase tracking-[0.4em] mt-6 ml-1">Visual Imagination by Azim Nasir</span>
                  </h1>
                  <p className="text-lg text-gray-400 max-w-md font-sans">
                    A creative engine that visualizes your product across reality-bending advertising mediums.
                  </p>
                  
                  <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-500/60 font-bold">
                      <Wand2 size={14} /> Nano-Banana Engine
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-600">
                      <ImageIcon size={14} /> Multi-Medium Rendering
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <BrandForm onSubmit={handleBuildBrand} isLoading={loading} />
                  {error && (
                    <p className="mt-4 text-rose-500 font-mono text-xs uppercase px-4">{error}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="brand"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <BrandDisplay profile={brandProfile} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-gray-800 mt-24 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600">
          <div className="space-y-1">
            <p>© 2026 BRAND BUILDER // AZIM NASIR</p>
            <p className="text-gray-700">MODEL: NANO-BANANA // AUTH: VERIFIED</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-amber-500 transition-colors">Lab</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Manifesto</a>
            <a href="#" className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <Github size={12} /> Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
