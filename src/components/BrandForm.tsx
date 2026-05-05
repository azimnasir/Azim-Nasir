import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface BrandFormProps {
  onSubmit: (productName: string, description: string) => void;
  isLoading: boolean;
}

export function BrandForm({ onSubmit, isLoading }: BrandFormProps) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !description.trim()) return;
    onSubmit(productName, description);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-gray-800 p-10 rounded-lg shadow-2xl">
      <div className="space-y-10">
        <div className="space-y-3">
          <label className="font-mono text-[10px] uppercase tracking-widest text-gray-500 block font-bold">
            Product Concept
          </label>
          <input
            required
            type="text"
            placeholder="Product Name (e.g., Zenith Watch)"
            className="w-full bg-[#0d0d0d] border border-gray-800 p-5 text-gray-200 text-sm focus:outline-none focus:border-amber-500 transition-all rounded font-sans leading-relaxed"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="font-mono text-[10px] uppercase tracking-widest text-gray-500 block font-bold">
            Product Narrative
          </label>
          <textarea
            required
            placeholder="Describe the product, its features, and the feeling it should evoke..."
            className="w-full bg-[#0d0d0d] border border-gray-800 p-5 text-gray-200 text-sm focus:outline-none focus:border-amber-500 transition-all resize-none h-40 rounded font-sans leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !productName.trim() || !description.trim()}
          className="w-full h-16 bg-amber-600 text-gray-100 font-mono text-[11px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-4 hover:bg-amber-500 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group rounded active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin text-amber-200" size={18} /> Building Identity...
            </>
          ) : (
            <>
              Generate Assets <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
