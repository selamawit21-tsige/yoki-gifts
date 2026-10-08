import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Sun,
  Layers,
  Sparkles,
  Check,
  ShieldCheck,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';
import { PaperFinish } from '../types';
import { PAPER_FINISH_OPTIONS } from '../data/products';

interface PaperTexturePreviewProps {
  selectedPaper: PaperFinish;
  onSelectPaper: (finish: PaperFinish) => void;
}

export const PaperTexturePreview: React.FC<PaperTexturePreviewProps> = ({
  selectedPaper,
  onSelectPaper
}) => {
  const [zoomLevel, setZoomLevel] = useState<'1x' | '2.5x'>('1x');
  const [lightAngle, setLightAngle] = useState<'DIFFUSED' | 'RAKING'>('DIFFUSED');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const currentInfo = PAPER_FINISH_OPTIONS[selectedPaper] || PAPER_FINISH_OPTIONS['ARCHIVAL_MATTE'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel !== '2.5x') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#1C1917]/15 p-6 space-y-5 shadow-sm">
      {/* Header and Controls */}
      <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A87B4F] block">
            Tactile Inspection Atelier
          </span>
          <h4 className="font-sans text-lg text-[#1C1917]">
            {currentInfo.name}
          </h4>
        </div>

        {/* Zoom and Light Toggles */}
        <div className="flex items-center gap-2">
          {/* Light Toggle */}
          <button
            type="button"
            onClick={() => setLightAngle(lightAngle === 'DIFFUSED' ? 'RAKING' : 'DIFFUSED')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border transition-colors ${
              lightAngle === 'RAKING'
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-[#FAF8F5] text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]/40'
            }`}
            title="Toggle between Diffused Daylight and Grazing Raking Light"
          >
            <Sun className="w-3 h-3" />
            <span className="hidden sm:inline">{lightAngle === 'RAKING' ? 'Raking Light' : 'Diffused Light'}</span>
          </button>

          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setZoomLevel(zoomLevel === '1x' ? '2.5x' : '1x')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border transition-colors ${
              zoomLevel === '2.5x'
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-[#FAF8F5] text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]/40'
            }`}
            title="Toggle 2.5x Macro Magnifier Loupe"
          >
            {zoomLevel === '2.5x' ? (
              <>
                <ZoomOut className="w-3 h-3" />
                <span>2.5x Loupe</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-3 h-3" />
                <span>1.0x Macro</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive High-Fidelity Macro Viewport */}
      <div
        onMouseMove={handleMouseMove}
        className="relative aspect-[16/10] overflow-hidden bg-[#ECE6DC] border border-[#1C1917]/15 cursor-crosshair group shadow-inner"
      >
        {/* Macro Texture Image */}
        <div
          className={`w-full h-full transition-transform duration-200 ${
            zoomLevel === '2.5x' ? 'scale-[2.5]' : 'scale-100'
          }`}
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`
          }}
        >
          <img
            src={currentInfo.macroImage}
            alt={currentInfo.macroAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-[1.05]"
          />
        </div>

        {/* Dynamic Light Simulation Layer */}
        {lightAngle === 'RAKING' ? (
          /* Raking Grazing Side Light Simulation (Highlights microscopic fibers & grain) */
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
            style={{
              background: 'linear-gradient(115deg, rgba(255,255,255,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(255,255,255,0.5) 100%)'
            }}
          />
        ) : (
          /* Soft Diffused Morning Light */
          <div
            className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8), transparent 70%)'
            }}
          />
        )}

        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          <span className="bg-black/70 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider">
            {currentInfo.weight}
          </span>
          {zoomLevel === '2.5x' && (
            <span className="bg-[#A87B4F] text-white text-[9px] font-mono px-2 py-0.5">
              2.5x Fiber Loupe
            </span>
          )}
        </div>

        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5">
          {lightAngle === 'RAKING' ? 'Side Grazing Light (45°)' : 'Diffused Ambient Light'}
        </div>
      </div>

      {/* Finish Selector Thumbnails Strip */}
      <div>
        <span className="text-[10px] font-mono uppercase text-[#78716C] block mb-2">
          Select Paper Finish Texture:
        </span>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(PAPER_FINISH_OPTIONS).map((finish) => (
            <button
              key={finish.id}
              type="button"
              onClick={() => onSelectPaper(finish.id)}
              className={`p-2 text-left border transition-all flex flex-col justify-between ${
                selectedPaper === finish.id
                  ? 'border-[#1C1917] bg-[#FAF8F5] ring-1 ring-[#1C1917] shadow-sm'
                  : 'border-[#1C1917]/10 bg-white hover:border-[#1C1917]/30'
              }`}
            >
              <div className="aspect-[16/9] w-full overflow-hidden mb-1.5 bg-[#EFECE6] border border-black/5">
                <img
                  src={finish.macroImage}
                  alt={finish.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-xs font-sans text-[#1C1917] font-medium block truncate">
                  {finish.name}
                </span>
                <span className="text-[10px] text-[#A87B4F] font-mono block">
                  {finish.priceAddon === 0 ? 'Included' : `+${finish.priceAddon} ETB`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fiber & Tactile Specs Grid */}
      <div className="bg-[#FAF8F5] p-3.5 border border-[#1C1917]/10 text-xs font-mono space-y-1.5 text-[#57534E]">
        <div className="flex justify-between items-baseline">
          <span className="text-[#78716C]">Composition:</span>
          <strong className="text-[#1C1917] text-right truncate max-w-[190px]">
            {currentInfo.fiberDetails.composition}
          </strong>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-[#78716C]">Sheen & Glare:</span>
          <strong className="text-[#1C1917] text-right truncate max-w-[190px]">
            {currentInfo.fiberDetails.sheenRating}
          </strong>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-[#78716C]">Archival Lifespan:</span>
          <strong className="text-[#1C1917] text-right truncate max-w-[190px]">
            {currentInfo.fiberDetails.archivalRating}
          </strong>
        </div>
      </div>

      {/* Tactile Sensory Note */}
      <p className="font-sans italic text-xs text-[#78716C] leading-relaxed pt-1 border-t border-[#1C1917]/10">
        "{currentInfo.description}"
      </p>
    </div>
  );
};
