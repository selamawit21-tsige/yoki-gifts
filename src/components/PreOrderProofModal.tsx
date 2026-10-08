import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  BookOpen,
  LayoutGrid,
  Eye,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { BookConfiguration, PhotoItem } from '../types';
import {
  BOOK_SIZE_OPTIONS,
  PAPER_FINISH_OPTIONS,
  COVER_COLOR_OPTIONS,
  FOIL_OPTIONS,
  BOOK_FONT_OPTIONS,
  getPhotoFilterCss
} from '../data/products';
import { PrintableQRBadge } from './PrintableQRBadge';
import { ArtMotifGraphic } from './ArtMotifGraphic';

interface PreOrderProofModalProps {
  config: BookConfiguration;
  photos: PhotoItem[];
  onApproveProof: () => void;
  onClose: () => void;
  onPreviewQR?: (qr: any) => void;
}

interface ProofSpreadItem {
  id: string;
  type: 'COVER_WRAP' | 'DEDICATION' | 'PHOTOS' | 'BACK_ENDPAPER';
  title: string;
  pageLeftNum?: number;
  pageRightNum?: number;
  leftPhoto?: PhotoItem;
  rightPhoto?: PhotoItem;
}

export const PreOrderProofModal: React.FC<PreOrderProofModalProps> = ({
  config,
  photos,
  onApproveProof,
  onClose,
  onPreviewQR
}) => {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'EACH_PAGE' | 'ALL_IN_ONE'>('EACH_PAGE');

  // Resolved configurations
  const currentSize = BOOK_SIZE_OPTIONS[config.size];
  const currentPaper = PAPER_FINISH_OPTIONS[config.paperFinish];
  const currentColor = COVER_COLOR_OPTIONS.find((c) => c.id === config.coverColor) || COVER_COLOR_OPTIONS[0];
  const currentFoil = FOIL_OPTIONS.find((f) => f.id === config.foilType) || FOIL_OPTIONS[0];
  const currentFontStyle = config.fontStyle || 'MODERN';
  const currentFont = BOOK_FONT_OPTIONS[currentFontStyle];

  // Resolve cover photo and style
  const coverPhoto = photos.find((p) => p.id === config.coverPhotoId) || photos.find((p) => p.isCover) || photos[0];
  const coverStyle = config.coverStyle || 'CAMEO_INSET';

  // Helper to render photo with canvas transform styles
  const renderTransformedImage = (photo: PhotoItem, extraClasses: string = '') => {
    const transform = photo.transform;
    const zoom = transform?.zoom ?? 1;
    const rotate = transform?.rotate ?? 0;
    const filterStyle = getPhotoFilterCss(transform?.filter, transform?.filterIntensity);

    return (
      <div className={`relative w-full h-full overflow-hidden ${extraClasses}`}>
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotate}deg)`,
            filter: filterStyle
          }}
        >
          <img
            src={photo.url}
            alt={photo.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />
        </div>

        {/* In-Image Text Overlay */}
        {transform?.textOverlay && (
          <div
            className="absolute pointer-events-none z-10 text-center px-2 py-0.5 select-none"
            style={
              typeof transform.textPositionX === 'number' && typeof transform.textPositionY === 'number'
                ? {
                    left: `${transform.textPositionX}%`,
                    top: `${transform.textPositionY}%`,
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '85%'
                  }
                : transform.textPosition === 'TOP'
                ? { top: '8%', left: '50%', transform: 'translateX(-50%)', maxWidth: '85%' }
                : transform.textPosition === 'CENTER'
                ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '85%' }
                : { bottom: '8%', left: '50%', transform: 'translateX(-50%)', maxWidth: '85%' }
            }
          >
            <div
              className={`px-2.5 py-1 rounded-xs transition-all ${
                transform.showTextBg ? 'shadow-xs border border-white/20' : ''
              }`}
              style={{
                backgroundColor: transform.showTextBg ? `${transform.textBgColorHex || '#1C1917'}E6` : 'transparent',
                backdropFilter: transform.showTextBg ? 'blur(4px)' : 'none'
              }}
            >
              <p
                className={`tracking-wide font-medium leading-tight ${currentFont.cssClass} ${
                  transform.textFontSize === 'xs'
                    ? 'text-[10px]'
                    : transform.textFontSize === 'sm'
                    ? 'text-xs'
                    : transform.textFontSize === 'lg'
                    ? 'text-base font-semibold'
                    : transform.textFontSize === 'xl'
                    ? 'text-lg font-bold'
                    : 'text-xs'
                }`}
                style={{
                  color: transform.textColorHex || (transform.textColor === 'DARK' ? '#1C1917' : '#FFFFFF'),
                  textShadow: transform.showTextBg
                    ? 'none'
                    : (transform.textColorHex || (transform.textColor === 'DARK' ? '#1C1917' : '#FFFFFF')) === '#FFFFFF'
                    ? '0 2px 4px rgba(0,0,0,0.85), 0 0 6px rgba(0,0,0,0.6)'
                    : '0 2px 4px rgba(255,255,255,0.85)'
                }}
              >
                {transform.textOverlay}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Build the complete sequential spreads proof
  const spreads: ProofSpreadItem[] = [];

  // Spread 1: Cover Wrap (Back + Spine + Front)
  spreads.push({
    id: 'proof-cover',
    type: 'COVER_WRAP',
    title: 'Cover Wrap'
  });

  // Spread 2: Dedication & Motif
  if (config.message?.enabled || config.qrMedia?.enabled) {
    spreads.push({
      id: 'proof-dedication',
      type: 'DEDICATION',
      title: 'Dedication & Colophon',
      pageLeftNum: 1,
      pageRightNum: 2
    });
  }

  // Spreads 3..N: Photo Pairs
  const photoStart = config.message?.enabled || config.qrMedia?.enabled ? 1 : 0;
  for (let i = photoStart; i < photos.length; i += 2) {
    const pageNum = spreads.length * 2 + 1;
    spreads.push({
      id: `proof-spread-${i}`,
      type: 'PHOTOS',
      title: `Pages ${pageNum}–${pageNum + 1}`,
      pageLeftNum: pageNum,
      pageRightNum: pageNum + 1,
      leftPhoto: photos[i],
      rightPhoto: photos[i + 1] || undefined
    });
  }

  // Final Spread: Back Endpaper & Atelier Seal
  spreads.push({
    id: 'proof-endpaper',
    type: 'BACK_ENDPAPER',
    title: 'Back Endpaper',
    pageLeftNum: spreads.length * 2 + 1,
    pageRightNum: spreads.length * 2 + 2
  });

  const activeSpread = spreads[currentSpreadIndex] || spreads[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentSpreadIndex < spreads.length - 1) {
        setCurrentSpreadIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentSpreadIndex > 0) {
        setCurrentSpreadIndex((prev) => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpreadIndex, spreads.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-[#141210]/95 backdrop-blur-md flex flex-col justify-between overflow-hidden text-[#FAF8F5]">
      {/* Top Bar: Proofing Metadata & Actions */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-black/40">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                Official Pre-Order Press Proof
              </span>
              <span className="px-2 py-0.2 bg-white/10 text-white/90 text-[10px] font-mono">
                {currentSize.name}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-medium text-white truncate max-w-sm sm:max-w-md">
              {config.title || 'UNTITLED PHOTOBOOK'}
            </h2>
          </div>
        </div>

        {/* Center: View Mode Switcher (All Book in One vs Each Page) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center bg-white/10 p-1 rounded-sm border border-white/15">
            <button
              type="button"
              onClick={() => setViewMode('EACH_PAGE')}
              className={`px-3 py-1 text-xs font-mono transition-all flex items-center gap-1.5 rounded-xs ${
                viewMode === 'EACH_PAGE'
                  ? 'bg-white text-[#1C1917] font-semibold shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Each Page</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ALL_IN_ONE')}
              className={`px-3 py-1 text-xs font-mono transition-all flex items-center gap-1.5 rounded-xs ${
                viewMode === 'ALL_IN_ONE'
                  ? 'bg-[#D4AF37] text-[#1C1917] font-bold shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Book in One</span>
            </button>
          </div>

          {viewMode === 'EACH_PAGE' && (
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-white/60 pl-2 border-l border-white/15">
              <span>Spread {currentSpreadIndex + 1} of {spreads.length}</span>
              <span>· {currentFont.name}</span>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-white/70 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white transition-colors"
            title="Close Proof"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Stage: Physical Book Simulation (Each Page) or Panoramic Grid (All in One) */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 overflow-y-auto relative">
        {viewMode === 'ALL_IN_ONE' ? (
          /* ALL BOOK IN ONE: Panoramic Multi-Spread Grid */
          <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
            {/* Overview Header Info */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
                    Complete Book Panoramic Proof
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-mono rounded-xs">
                    All In One View
                  </span>
                </div>
                <h3 className="text-lg text-white font-medium mt-1">
                  All {spreads.length} Spreads · {config.pageCount} Pages Total
                </h3>
                <p className="text-xs text-white/60 font-mono mt-0.5">
                  Click any spread or page card to inspect up close in high resolution.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 bg-black/40 border border-white/15 text-white/90">
                  {currentSize.name}
                </span>
                <span className="px-3 py-1.5 bg-black/40 border border-white/15 text-white/90">
                  {currentPaper.name}
                </span>
                <span className="px-3 py-1.5 bg-black/40 border border-white/15 text-[#D4AF37]">
                  {currentFont.name} Typography
                </span>
              </div>
            </div>

            {/* Grid of all spreads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {spreads.map((sp, idx) => (
                <div
                  key={sp.id}
                  onClick={() => {
                    setCurrentSpreadIndex(idx);
                    setViewMode('EACH_PAGE');
                  }}
                  className={`group bg-[#1A1816] border transition-all duration-200 p-5 rounded-xs shadow-2xl flex flex-col justify-between cursor-pointer hover:border-[#D4AF37] ${
                    idx === currentSpreadIndex
                      ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 text-xs font-mono">
                    <span className="text-[#D4AF37] font-semibold">
                      Spread {idx + 1} of {spreads.length}: {sp.title}
                    </span>
                    <span className="text-white/60 group-hover:text-white flex items-center gap-1.5 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Spread</span>
                    </span>
                  </div>

                  {/* Spread Miniature Preview */}
                  {sp.type === 'COVER_WRAP' && (
                    <div
                      className="w-full aspect-[16/10] border shadow-md flex p-3 relative overflow-hidden"
                      style={{ backgroundColor: currentColor.hex, borderColor: 'rgba(0,0,0,0.3)' }}
                    >
                      <div className="flex-1 p-2 flex flex-col justify-between border-r border-black/15 text-[8px] font-mono text-black/60">
                        <span>Back Cover</span>
                        <span className="text-center">YOKI EDITIONS</span>
                        <span>{currentSize.dimensions}</span>
                      </div>
                      <div className="w-4 bg-black/15 flex items-center justify-center">
                        <span className={`text-[6px] tracking-widest uppercase rotate-90 whitespace-nowrap ${currentFont.cssClass}`} style={{ color: currentFoil.previewColor }}>
                          {config.title || 'YOKI'}
                        </span>
                      </div>
                      {coverStyle === 'FULL_WRAP' && coverPhoto ? (
                        <div className="flex-1 relative overflow-hidden flex flex-col justify-between p-2 text-center">
                          <img
                            src={coverPhoto.url}
                            alt="Cover Wrap"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60" />
                          <div className="relative z-10 flex flex-col justify-between h-full">
                            <span className="text-[6px] font-mono uppercase text-white/70">Full Wrap</span>
                            <h4 className={`text-xs font-medium tracking-wide uppercase text-white truncate ${currentFont.cssClass}`}>
                              {config.title || 'YOUR PHOTOBOOK'}
                            </h4>
                            <span className="text-[6px] font-mono text-white/70">Cover Wrap</span>
                          </div>
                        </div>
                      ) : coverStyle === 'CAMEO_INSET' && coverPhoto ? (
                        <div className="flex-1 p-2 flex flex-col justify-between text-center relative">
                          <span className="text-[6px] font-mono uppercase text-black/50">Cameo Inset</span>
                          <div className="w-12 h-9 mx-auto overflow-hidden shadow-sm border border-black/30 relative bg-black/10 rounded-2xs">
                            <img src={coverPhoto.url} alt="Cameo" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <h4 className={`text-[11px] font-medium tracking-wide uppercase truncate ${currentFont.cssClass}`} style={{ color: currentFoil.previewColor }}>
                            {config.title || 'YOUR PHOTOBOOK'}
                          </h4>
                        </div>
                      ) : (
                        <div className="flex-1 p-3 flex flex-col justify-between text-center">
                          <span className="text-[7px] font-mono uppercase text-black/40">Front Cover</span>
                          <h4 className={`text-sm font-medium tracking-wide uppercase ${currentFont.cssClass}`} style={{ color: currentFoil.previewColor }}>
                            {config.title || 'YOUR PHOTOBOOK'}
                          </h4>
                          <span className="text-[7px] font-mono" style={{ color: currentFoil.previewColor }}>
                            {currentFoil.name} Foil
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {sp.type === 'DEDICATION' && (
                    <div className="w-full aspect-[16/10] bg-[#FAF8F5] text-[#1C1917] p-4 border border-white/20 shadow-md grid grid-cols-2">
                      <div className="p-2 border-r border-[#1C1917]/10 flex flex-col justify-between text-center">
                        <span className="text-[8px] font-mono text-[#78716C]">p. 01 · Colophon</span>
                        <div>
                          <p className={`text-xs font-medium text-[#1C1917] ${currentFont.cssClass}`}>{config.title || 'Our Chronicle'}</p>
                          <span className="text-[8px] font-mono text-[#A87B4F]">Yoki Gifts Series</span>
                        </div>
                        <span className="text-[8px] font-mono text-[#A8A29E]">100% Acid-Free</span>
                      </div>
                      <div className="p-2 flex flex-col justify-between">
                        <span className="text-[8px] font-mono text-[#A87B4F] uppercase tracking-wider">Dedication Plate</span>
                        <div className="my-auto">
                          <h5 className={`text-xs font-semibold text-[#1C1917] ${currentFont.cssClass}`}>
                            {config.message?.title || 'Dedication'}
                          </h5>
                          <p className={`text-[10px] text-[#57534E] line-clamp-3 mt-1 ${currentFont.cssClass}`}>
                            "{config.message?.bodyText || 'Preserving our moments in tangible archival paper...'}"
                          </p>
                        </div>
                        <span className="text-[8px] font-mono text-[#A8A29E] text-right">p. 02</span>
                      </div>
                    </div>
                  )}

                  {sp.type === 'PHOTOS' && (
                    <div className="w-full aspect-[16/10] bg-[#FAF8F5] text-[#1C1917] p-3 border border-white/20 shadow-md grid grid-cols-2 gap-2">
                      <div className="p-1 flex flex-col justify-between border-r border-[#1C1917]/10 pr-2">
                        {sp.leftPhoto ? (
                          <div className="h-full flex flex-col justify-between">
                            <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] shadow-xs">
                              {renderTransformedImage(sp.leftPhoto)}
                            </div>
                            <div className="flex justify-between items-center text-[9px] pt-1 border-t border-[#1C1917]/10 mt-1">
                              <span className={`truncate max-w-[100px] text-[#1C1917] ${currentFont.cssClass}`}>{sp.leftPhoto.name}</span>
                              <span className="font-mono text-[#78716C]">p. {sp.pageLeftNum}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px] font-mono text-[#A8A29E]">Endpaper</div>
                        )}
                      </div>
                      <div className="p-1 flex flex-col justify-between pl-1">
                        {sp.rightPhoto ? (
                          <div className="h-full flex flex-col justify-between">
                            <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] shadow-xs">
                              {renderTransformedImage(sp.rightPhoto)}
                            </div>
                            <div className="flex justify-between items-center text-[9px] pt-1 border-t border-[#1C1917]/10 mt-1">
                              <span className={`truncate max-w-[100px] text-[#1C1917] ${currentFont.cssClass}`}>{sp.rightPhoto.name}</span>
                              <span className="font-mono text-[#78716C]">p. {sp.pageRightNum}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px] font-mono text-[#A8A29E]">Endpaper</div>
                        )}
                      </div>
                    </div>
                  )}

                  {sp.type === 'BACK_ENDPAPER' && (
                    <div className="w-full aspect-[16/10] bg-[#FAF8F5] text-[#1C1917] p-4 border border-white/20 shadow-md grid grid-cols-2">
                      <div className="p-2 border-r border-[#1C1917]/10 flex flex-col justify-between text-center">
                        <span className="text-[8px] font-mono text-[#78716C]">Closing Plate</span>
                        <div className="my-auto space-y-1">
                          <ShieldCheck className="w-4 h-4 text-[#A87B4F] mx-auto" />
                          <h6 className={`text-xs font-medium text-[#1C1917] ${currentFont.cssClass}`}>Atelier Hallmark</h6>
                          <p className="text-[8px] font-mono text-[#78716C]">Smyth-sewn layflat binding</p>
                        </div>
                        <span className="text-[8px] font-mono text-[#A8A29E]">Addis Ababa Press</span>
                      </div>
                      <div className="p-2 flex flex-col justify-between text-center">
                        <span className="text-[8px] font-mono text-[#78716C]">Endpaper</span>
                        <div className="my-auto">
                          <span className="text-[9px] font-mono text-[#A87B4F] uppercase tracking-wider">Yoki Gifts</span>
                          <p className="text-[8px] font-mono text-[#78716C]">Archival Keepsake</p>
                        </div>
                        <span className="text-[8px] font-mono text-[#A8A29E] text-right">Back Plate</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
                    <span>{sp.type === 'COVER_WRAP' ? 'Hardcover Cloth & Deboss' : sp.type === 'DEDICATION' ? 'Dedication Plate & Colophon' : sp.type === 'BACK_ENDPAPER' ? 'Atelier Seal & Endpaper' : `Facing Pages ${sp.pageLeftNum} & ${sp.pageRightNum}`}</span>
                    <span className="text-[#D4AF37] group-hover:underline">Click to Inspect Spread →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* EACH PAGE: Physical Spread Simulation */
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center my-auto">
            {/* SPREAD TYPE 1: COVER WRAP */}
            {activeSpread.type === 'COVER_WRAP' && (
              <div className="w-full max-w-3xl aspect-[16/10] bg-[#EFECE6] p-4 sm:p-8 shadow-2xl relative border border-white/10">
                <div
                  className="w-full h-full shadow-2xl border flex relative overflow-hidden"
                  style={{
                    backgroundColor: currentColor.hex,
                    borderColor: 'rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Back Cover (Left Half) */}
                  <div className="flex-1 p-6 flex flex-col justify-between border-r border-black/15">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-black/40">
                      Back Cover
                    </span>
                    <div className="text-center">
                      <span
                        className="text-[10px] font-mono tracking-widest uppercase block"
                        style={{ color: currentFoil.previewColor }}
                      >
                        YOKI EDITIONS · ADDIS ABABA
                      </span>
                      <span className="text-[8px] font-mono text-black/50 block mt-1">
                        Hand-bound Smyth Sewn Layflat
                      </span>
                    </div>
                    <div className="text-right text-[8px] font-mono text-black/40">
                      {currentSize.dimensions}
                    </div>
                  </div>

                  {/* Spine Center Fold */}
                  <div className="w-6 sm:w-8 bg-black/15 flex items-center justify-center relative">
                    <span
                      className={`text-[9px] tracking-widest uppercase rotate-90 whitespace-nowrap ${currentFont.cssClass}`}
                      style={{ color: currentFoil.previewColor }}
                    >
                      {config.title || 'YOKI'}
                    </span>
                  </div>

                  {/* Front Cover (Right Half): Supports Cameo Inset vs Full Wrap */}
                  {coverStyle === 'FULL_WRAP' && coverPhoto ? (
                    <div className="flex-1 relative overflow-hidden flex flex-col justify-between">
                      <img
                        src={coverPhoto.url}
                        alt="Front Cover Wrap"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
                      <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full text-center">
                        <div className="pt-2">
                          <span className="text-[9px] font-mono tracking-widest uppercase text-white/70 block">
                            FULL-BLEED PHOTO WRAP
                          </span>
                          <h1
                            className={`text-xl sm:text-2xl mt-4 tracking-wide leading-snug px-2 font-medium text-white ${currentFont.cssClass}`}
                            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}
                          >
                            {config.title || 'YOUR BOOK TITLE'}
                          </h1>
                          {config.subtitle && (
                            <p className={`text-xs mt-2 text-white/90 font-light ${currentFont.cssClass}`}>
                              {config.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="text-center text-[9px] font-mono tracking-widest uppercase text-white/80">
                          {currentPaper.name} · {config.pageCount} Pages
                        </div>
                      </div>
                    </div>
                  ) : coverStyle === 'CAMEO_INSET' && coverPhoto ? (
                    <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between text-center relative">
                      <div>
                        <span
                          className="text-[9px] font-mono tracking-widest uppercase block font-semibold"
                          style={{ color: currentFoil.previewColor }}
                        >
                          ARCHIVAL EDITION · CAMEO INSET
                        </span>

                        {/* Cameo Inset Photo Aperture */}
                        <div className="w-32 h-24 sm:w-40 sm:h-28 mx-auto my-3 overflow-hidden shadow-2xl border-2 border-black/30 relative ring-1 ring-white/20 bg-black/10 rounded-xs">
                          <img
                            src={coverPhoto.url}
                            alt="Cameo Cover"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/40 pointer-events-none" />
                        </div>

                        <h1
                          className={`text-lg sm:text-xl tracking-wide leading-snug font-medium uppercase ${currentFont.cssClass}`}
                          style={{
                            color: currentFoil.previewColor,
                            textShadow:
                              config.foilType === 'BLIND_EMBOSS'
                                ? '1px 1px 1px rgba(0,0,0,0.4), -1px -1px 1px rgba(255,255,255,0.2)'
                                : '0 0 2px rgba(255,255,255,0.3)'
                          }}
                        >
                          {config.title || 'YOUR BOOK TITLE'}
                        </h1>
                        {config.subtitle && (
                          <p
                            className={`text-xs mt-1 tracking-wide font-light ${currentFont.cssClass}`}
                            style={{ color: currentFoil.previewColor }}
                          >
                            {config.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="text-center text-[9px] font-mono tracking-widest uppercase" style={{ color: currentFoil.previewColor }}>
                        {currentPaper.name} · {config.pageCount} Pages
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                      <div className="text-center pt-4">
                        <span
                          className="text-[9px] font-mono tracking-widest uppercase block"
                          style={{ color: currentFoil.previewColor }}
                        >
                          ARCHIVAL EDITION
                        </span>
                        <h1
                          className={`text-xl sm:text-2xl mt-4 tracking-wide leading-snug px-2 font-medium ${currentFont.cssClass}`}
                          style={{
                            color: currentFoil.previewColor,
                            textShadow:
                              config.foilType === 'BLIND_EMBOSS'
                                ? '1px 1px 1px rgba(0,0,0,0.4), -1px -1px 1px rgba(255,255,255,0.2)'
                                : '0 0 2px rgba(255,255,255,0.3)'
                          }}
                        >
                          {config.title || 'YOUR BOOK TITLE'}
                        </h1>
                        {config.subtitle && (
                          <p
                            className={`text-xs mt-2 tracking-wide font-light ${currentFont.cssClass}`}
                            style={{ color: currentFoil.previewColor }}
                          >
                            {config.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="text-center text-[9px] font-mono tracking-widest" style={{ color: currentFoil.previewColor }}>
                        {currentPaper.name} · {config.pageCount} Pages
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#FAF8F5]/70">
                  <span>Hardcover Flax Linen: {currentColor.name}</span>
                  <span className="text-[#D4AF37]">Debossing: {currentFoil.name} Foil</span>
                </div>
              </div>
            )}

            {/* SPREAD TYPE 2: DEDICATION & MEMOIR SPREAD */}
            {activeSpread.type === 'DEDICATION' && (
              <div className="w-full max-w-4xl aspect-[16/10] bg-[#FAF8F5] text-[#1C1917] p-6 sm:p-10 shadow-2xl relative grid grid-cols-2 border border-white/20">
                {/* Spine shadow guide */}
                <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

                {/* Left Page (Half title / atelier colophon) */}
                <div className="p-4 sm:p-8 flex flex-col justify-between border-r border-[#1C1917]/10">
                  <span className="text-[9px] font-mono text-[#78716C] uppercase tracking-widest">
                    p. 01 · Colophon
                  </span>
                  <div className="space-y-2 text-center my-auto">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#A87B4F] block">
                      Yoki Gifts Monograph Series
                    </span>
                    <h3 className={`text-lg font-medium text-[#1C1917] ${currentFont.cssClass}`}>
                      {config.title || 'Our Chronicle'}
                    </h3>
                    <p className="text-xs text-[#78716C] font-mono">
                      Printed on {currentPaper.weight} {currentPaper.name}
                    </p>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-[#A8A29E]">
                    <span>Addis Ababa Atelier</span>
                    <span>100% Acid-Free</span>
                  </div>
                </div>

                {/* Right Page (Dedication note & QR badge) */}
                <div className="p-4 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-4 my-auto">
                    {config.message?.artMotif && config.message.artMotif !== 'NONE' && (
                      <ArtMotifGraphic motif={config.message.artMotif} className="w-8 h-8 text-[#A87B4F]" />
                    )}
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A87B4F] block">
                      Dedication & Inscription
                    </span>
                    <h4 className={`text-xl font-medium text-[#1C1917] ${currentFont.cssClass}`}>
                      {config.message?.title || 'Dedication'}
                    </h4>
                    <p className={`text-xs sm:text-sm text-[#57534E] leading-relaxed ${currentFont.cssClass}`}>
                      "{config.message?.bodyText || 'Preserving our moments in tangible archival paper...'}"
                    </p>
                    {config.message?.authorSignature && (
                      <p className={`text-xs text-[#1C1917] font-medium ${currentFont.cssClass}`}>
                        — {config.message.authorSignature}
                      </p>
                    )}

                    {config.qrMedia?.enabled && (
                      <div className="pt-3 border-t border-[#1C1917]/10 flex items-center justify-between">
                        <PrintableQRBadge
                          qrMedia={config.qrMedia}
                          onPreviewMedia={() => onPreviewQR && onPreviewQR(config.qrMedia)}
                          size="sm"
                        />
                        <span className="text-[10px] font-mono text-[#78716C]">
                          {config.qrMedia.mediaType === 'VIDEO' ? 'Scan for Video' : 'Scan for Audio'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-[9px] font-mono text-[#A8A29E] pt-2 border-t border-[#1C1917]/10">
                    <span>Inscription Plate</span>
                    <span>p. 02</span>
                  </div>
                </div>
              </div>
            )}

            {/* SPREAD TYPE 3: PHOTO PAGES */}
            {activeSpread.type === 'PHOTOS' && (
              <div className="w-full max-w-4xl aspect-[16/10] bg-[#FAF8F5] text-[#1C1917] p-6 sm:p-10 shadow-2xl relative grid grid-cols-2 border border-white/20">
                {/* Spine shadow guide */}
                <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

                {/* Left Page */}
                <div className="p-3 sm:p-6 flex flex-col justify-between border-r border-[#1C1917]/10">
                  {activeSpread.leftPhoto ? (
                    <div className="h-full flex flex-col justify-between">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] shadow-sm">
                        {renderTransformedImage(activeSpread.leftPhoto)}
                      </div>
                      <div className="pt-3 flex items-end justify-between text-xs border-t border-[#1C1917]/10 mt-2">
                        <span className={`text-[#1C1917] truncate max-w-[200px] ${currentFont.cssClass}`}>
                          {activeSpread.leftPhoto.name}
                        </span>
                        <span className="text-[#78716C] font-mono text-[10px]">
                          p. {activeSpread.pageLeftNum}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs font-mono text-[#A8A29E]">
                      Endpaper
                    </div>
                  )}
                </div>

                {/* Right Page */}
                <div className="p-3 sm:p-6 flex flex-col justify-between">
                  {activeSpread.rightPhoto ? (
                    <div className="h-full flex flex-col justify-between">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] shadow-sm">
                        {renderTransformedImage(activeSpread.rightPhoto)}
                      </div>
                      <div className="pt-3 flex items-end justify-between text-xs border-t border-[#1C1917]/10 mt-2">
                        <span className={`text-[#1C1917] truncate max-w-[200px] ${currentFont.cssClass}`}>
                          {activeSpread.rightPhoto.name}
                        </span>
                        <span className="text-[#78716C] font-mono text-[10px]">
                          p. {activeSpread.pageRightNum}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs font-mono text-[#A8A29E]">
                      Endpaper
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SPREAD TYPE 4: BACK ENDPAPER */}
            {activeSpread.type === 'BACK_ENDPAPER' && (
              <div className="w-full max-w-4xl aspect-[16/10] bg-[#FAF8F5] text-[#1C1917] p-8 sm:p-12 shadow-2xl relative grid grid-cols-2 border border-white/20">
                <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

                <div className="p-6 flex flex-col justify-between border-r border-[#1C1917]/10">
                  <span className="text-[9px] font-mono text-[#78716C] uppercase tracking-widest">
                    Closing Spread
                  </span>
                  <div className="text-center my-auto space-y-2">
                    <div className="w-10 h-10 border border-[#1C1917]/20 mx-auto flex items-center justify-center rounded-full text-[#1C1917]">
                      <ShieldCheck className="w-5 h-5 text-[#A87B4F]" />
                    </div>
                    <h4 className={`text-base font-medium text-[#1C1917] ${currentFont.cssClass}`}>
                      Atelier Quality Hallmark
                    </h4>
                    <p className="text-xs text-[#78716C] font-mono leading-relaxed max-w-xs mx-auto">
                      Hand-inspected in Addis Ababa. Bound with archival adhesives and Smyth-sewn linen thread.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-[#A8A29E]">Final Plate</span>
                </div>

                <div className="p-6 flex flex-col justify-between bg-[#FAF8F5]">
                  <span className="text-[9px] font-mono text-[#78716C] uppercase tracking-widest">
                    Endpaper
                  </span>
                  <div className="text-center my-auto space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#A87B4F]">
                      Yoki Gifts Edition
                    </span>
                    <p className="text-xs font-mono text-[#78716C]">
                      All rights reserved · {new Date().getFullYear()}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-[#A8A29E] text-right">Back Endpaper</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Control Bar & Interactive Spread Filmstrip */}
      <footer className="border-t border-white/10 bg-black/60 px-6 py-4 shrink-0 space-y-3">
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {viewMode === 'ALL_IN_ONE' ? (
            <div className="flex items-center gap-2 text-xs font-mono text-white/70">
              <span className="text-[#D4AF37] font-semibold">Panoramic Overview</span>
              <span>· {spreads.length} Spreads Total · All Pages Displayed</span>
            </div>
          ) : (
            <button
              type="button"
              disabled={currentSpreadIndex === 0}
              onClick={() => setCurrentSpreadIndex((prev) => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-mono uppercase transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous Spread</span>
            </button>
          )}

          {viewMode === 'EACH_PAGE' && (
            <div className="text-xs font-mono text-center">
              <span className="text-white font-semibold">
                Spread {currentSpreadIndex + 1}
              </span>
              <span className="text-white/50"> of {spreads.length}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {viewMode === 'ALL_IN_ONE' ? (
              <button
                type="button"
                onClick={() => setViewMode('EACH_PAGE')}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono uppercase transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Switch to Spread View</span>
              </button>
            ) : currentSpreadIndex < spreads.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSpreadIndex((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono uppercase transition-colors"
              >
                <span className="hidden sm:inline">Next Spread</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}

            {/* Approve Proof & Order Button */}
            <button
              type="button"
              onClick={onApproveProof}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1C1917] font-bold text-xs font-mono uppercase tracking-wider transition-colors shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-[#1C1917]" />
              <span>Verify & Proceed to Order</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Filmstrip (All Pages in One Click) */}
        <div className="max-w-7xl mx-auto overflow-x-auto flex items-center gap-2 py-1 no-scrollbar">
          {spreads.map((sp, idx) => {
            const isCurrent = idx === currentSpreadIndex;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => {
                  setCurrentSpreadIndex(idx);
                  setViewMode('EACH_PAGE');
                }}
                className={`shrink-0 px-2.5 py-1 text-[10px] font-mono border transition-all rounded-xs flex items-center gap-1.5 ${
                  isCurrent && viewMode === 'EACH_PAGE'
                    ? 'bg-[#D4AF37] text-[#1C1917] border-[#D4AF37] font-bold shadow-sm'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>#{idx + 1}</span>
                <span className="truncate max-w-[90px]">{sp.title}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
