import React from 'react';
import { ArrowRight, BookOpen, Layers, ShieldCheck, Heart, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { BookSize, BookCategory } from '../types';
import { CATEGORIES_DATA } from '../data/categories';

interface LandingViewProps {
  onStartConfig: (preferredSize?: BookSize, preferredCategory?: BookCategory) => void;
  onGoToUpload: () => void;
  onSelectCategory: (category: BookCategory) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartConfig,
  onGoToUpload,
  onSelectCategory
}) => {
  const categoryKeys: BookCategory[] = [
    'WEDDING',
    'FAMILY',
    'TRAVEL',
    'COUPLE',
    'BIRTHDAY',
    'FRIENDS',
    'TEAM'
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Category Quick-Picker Strip (7 Curated Themes) */}
      <section className="border-b border-[#1C1917]/10 bg-white/70 py-4 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-widest text-[#78716C] font-mono shrink-0 hidden md:block">
            Choose Theme:
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            {categoryKeys.map((catKey) => {
              const cat = CATEGORIES_DATA[catKey];
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="px-4 py-1.5 text-xs font-mono border border-[#1C1917]/15 hover:border-[#1C1917] bg-[#FAF8F5] hover:bg-[#1C1917] hover:text-white transition-all whitespace-nowrap"
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-[#A87B4F] shrink-0 hidden lg:inline">
            7 Curated Templates
          </span>
        </div>
      </section>

      {/* 2. Photo-First Hero Section (Clean, Minimal, Modern Sans) */}
      <section className="px-6 max-w-7xl mx-auto pt-4 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Copy (Minimal, No Text Wall) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#78716C] font-mono">
              Bespoke Memory Atelier · Addis Ababa
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-light tracking-tight text-[#1C1917] leading-[1.08]">
              Your memories bound in tactile linen.
            </h1>

            <p className="text-base text-[#57534E] font-light leading-relaxed">
              Minimalist photobooks and editorial magazines. Smyth-sewn layflat binding with 100% acid-free European papers.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-[#78716C]">
              <span>Layflat 180° Binding</span>
              <span aria-hidden="true">·</span>
              <span>200–310 gsm Papers</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1C1917] font-semibold">From 2,200 ETB</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onStartConfig('A4_HARDCOVER', 'WEDDING')}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs uppercase tracking-wider font-medium text-white bg-[#1C1917] hover:bg-[#2C2825] transition-all shadow-sm group"
              >
                <span>Create Your Book</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onGoToUpload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-medium text-[#1C1917] bg-white hover:bg-[#FAF8F5] border border-[#1C1917]/15 transition-colors"
              >
                <span>Upload Photos (Up to 30)</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Anchor (Expansive Photo Spread) */}
          <div className="lg:col-span-7">
            <div className="bg-[#EFECE6] p-6 sm:p-10 border border-[#1C1917]/10 shadow-xl relative">
              <div className="grid grid-cols-2 bg-[#FAF8F5] aspect-[16/10] border border-[#1C1917]/10 overflow-hidden relative shadow-md">
                {/* Left Page Photo */}
                <div className="relative p-4 sm:p-6 flex flex-col justify-between border-r border-[#1C1917]/10">
                  <div className="relative aspect-square w-full overflow-hidden bg-[#ECE6DC]">
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                      alt="Wedding vows in natural light"
                      className="w-full h-full object-cover filter contrast-[1.03]"
                    />
                  </div>
                  <div className="flex justify-between items-baseline pt-3 text-[10px] font-mono text-[#78716C]">
                    <span className="font-sans font-medium text-[#1C1917]">Plate 01 · Vows in Sunlight</span>
                    <span>p. 18</span>
                  </div>
                  <div className="absolute inset-y-0 right-0 w-8 pointer-events-none spine-shadow-right" />
                </div>

                {/* Right Page Photo */}
                <div className="relative p-4 sm:p-6 flex flex-col justify-between">
                  <div className="relative aspect-square w-full overflow-hidden bg-[#ECE6DC]">
                    <img
                      src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                      alt="Addis coffee ceremony"
                      className="w-full h-full object-cover filter contrast-[1.03]"
                    />
                  </div>
                  <div className="flex justify-between items-baseline pt-3 text-[10px] font-mono text-[#78716C]">
                    <span className="font-sans font-medium text-[#1C1917]">Plate 02 · Morning Roast</span>
                    <span>p. 19</span>
                  </div>
                  <div className="absolute inset-y-0 left-0 w-8 pointer-events-none spine-shadow-left" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#78716C]">
                <span>A4 Hardcover Monograph · Warm Bone Linen</span>
                <span className="text-[#A87B4F] font-semibold">True Layflat 180°</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Browse by Thematic Categories (Photo-First Cards) */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="border-t border-[#1C1917]/10 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#78716C] tracking-widest block mb-1">
                Curated Occasions
              </span>
              <h2 className="text-2xl sm:text-3xl font-sans font-normal text-[#1C1917]">
                Designed for Life's Milestones
              </h2>
            </div>
            <span className="text-xs font-mono text-[#78716C]">
              Select a template to launch with tailored colors, titles & layouts
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categoryKeys.map((catKey) => {
              const cat = CATEGORIES_DATA[catKey];
              const heroImg = cat.samplePhotos[0]?.url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80';

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="bg-white border border-[#1C1917]/10 p-3 text-left hover:border-[#1C1917] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-[#ECE6DC] mb-3">
                    <img
                      src={heroImg}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <span className="font-sans text-sm font-semibold text-[#1C1917] block">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#78716C] font-mono block truncate mt-0.5">
                      {cat.defaultTitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Signature Collections (Photo-Heavy, Concise Copy) */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="border-t border-[#1C1917]/10 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-sans font-normal text-[#1C1917]">
              Signature Book Formats
            </h2>
            <span className="text-xs font-mono text-[#78716C]">Ethiopian Birr (ETB)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: A4 Hardcover */}
            <div className="bg-white border border-[#1C1917]/10 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="aspect-[4/3] bg-[#ECE6DC] relative overflow-hidden mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                    alt="A4 Hardcover Monograph"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#1C1917] text-white text-[9px] font-mono px-2 py-0.5">
                    210 × 297 mm
                  </div>
                </div>

                <div className="text-xs font-mono text-[#78716C] mb-1">Case-Bound Monograph</div>
                <h3 className="text-xl font-sans font-medium text-[#1C1917]">The Heirloom Hardcover</h3>
                <p className="text-xs text-[#57534E] mt-2 font-light leading-relaxed">
                  Heavyweight European flax linen wrapped over 2.5mm binder board. Layflat 180° panoramic opening.
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-[#1C1917]/10 flex items-center justify-between">
                <span className="text-base font-mono font-semibold text-[#1C1917] tabular-nums">
                  3,450 ETB
                </span>
                <button
                  onClick={() => onStartConfig('A4_HARDCOVER')}
                  className="px-4 py-2 text-xs font-mono uppercase bg-[#1C1917] text-white hover:bg-[#2C2825] transition-colors"
                >
                  Configure A4
                </button>
              </div>
            </div>

            {/* Card 2: A5 Magazine */}
            <div className="bg-white border border-[#1C1917]/10 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="aspect-[4/3] bg-[#EFECE6] relative overflow-hidden mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
                    alt="A5 Editorial Magazine"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#1C1917] text-white text-[9px] font-mono px-2 py-0.5">
                    148 × 210 mm
                  </div>
                </div>

                <div className="text-xs font-mono text-[#78716C] mb-1">Softcover Periodical</div>
                <h3 className="text-xl font-sans font-medium text-[#1C1917]">The Editorial Magazine</h3>
                <p className="text-xs text-[#57534E] mt-2 font-light leading-relaxed">
                  Tactile 300gsm flexible textured cover wrap. Modern art journal aesthetic for travels and seasonal memories.
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-[#1C1917]/10 flex items-center justify-between">
                <span className="text-base font-mono font-semibold text-[#1C1917] tabular-nums">
                  2,200 ETB
                </span>
                <button
                  onClick={() => onStartConfig('A5_MAGAZINE')}
                  className="px-4 py-2 text-xs font-mono uppercase bg-[#1C1917] text-white hover:bg-[#2C2825] transition-colors"
                >
                  Configure A5
                </button>
              </div>
            </div>

            {/* Card 3: Voyage Travel */}
            <div className="bg-white border border-[#1C1917]/10 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="aspect-[4/3] bg-[#E8DDD2] relative overflow-hidden mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
                    alt="Voyage Travel Volume"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#965342] text-white text-[9px] font-mono px-2 py-0.5">
                    Terracotta Linen
                  </div>
                </div>

                <div className="text-xs font-mono text-[#78716C] mb-1">Expedition Archive</div>
                <h3 className="text-xl font-sans font-medium text-[#1C1917]">The Voyage Travel Edition</h3>
                <p className="text-xs text-[#57534E] mt-2 font-light leading-relaxed">
                  Sun-baked raw terracotta cloth with coordinate debossing. Built to preserve life expeditions.
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-[#1C1917]/10 flex items-center justify-between">
                <span className="text-base font-mono font-semibold text-[#1C1917] tabular-nums">
                  3,850 ETB
                </span>
                <button
                  onClick={() => onStartConfig('A4_HARDCOVER', 'TRAVEL')}
                  className="px-4 py-2 text-xs font-mono uppercase bg-[#1C1917] text-white hover:bg-[#2C2825] transition-colors"
                >
                  Configure Travel
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean Craft Story Section (Compact, No Text Wall) */}
      <section id="craft-section" className="px-6 max-w-7xl mx-auto">
        <div className="border-t border-[#1C1917]/10 pt-12">
          <div className="bg-[#FAF8F5] border border-[#1C1917]/10 p-8 sm:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono text-center">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#1C1917]/10 flex items-center justify-center mx-auto text-[#1C1917]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-sans font-semibold text-sm text-[#1C1917]">Layflat Binding</h4>
                <p className="text-[#78716C] text-[11px]">Smyth-sewn thread spreads</p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#1C1917]/10 flex items-center justify-center mx-auto text-[#1C1917]">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-sans font-semibold text-sm text-[#1C1917]">Archival Papers</h4>
                <p className="text-[#78716C] text-[11px]">200 – 310 gsm acid-free</p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#1C1917]/10 flex items-center justify-center mx-auto text-[#1C1917]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-sans font-semibold text-sm text-[#1C1917]">Foil Debossing</h4>
                <p className="text-[#78716C] text-[11px]">Brass type heat-stamping</p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-[#1C1917]/10 flex items-center justify-center mx-auto text-[#1C1917]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-sans font-semibold text-sm text-[#1C1917]">Addis Atelier</h4>
                <p className="text-[#78716C] text-[11px]">Inspected & hand-finished</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
