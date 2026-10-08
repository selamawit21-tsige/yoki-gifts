import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  LayoutTemplate,
  Layers,
  Columns,
  FileText,
  Check,
  Eye,
  Move
} from 'lucide-react';
import { BookConfiguration, PhotoItem, SpreadTemplateType } from '../types';
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

interface FullBookProofModalProps {
  config: BookConfiguration;
  photos: PhotoItem[];
  onApproveProof: () => void;
  onClose: () => void;
  onPreviewQR?: (qr: any) => void;
  onUpdateSpreadLayouts?: (layouts: Record<string, SpreadTemplateType>) => void;
}

export interface ProofSpreadItem {
  id: string;
  type: 'COVER_WRAP' | 'DEDICATION' | 'PHOTOS' | 'BACK_ENDPAPER';
  title: string;
  subtitle: string;
  pageLeftNum?: number;
  pageRightNum?: number;
  leftPhoto?: PhotoItem;
  rightPhoto?: PhotoItem;
  thirdPhoto?: PhotoItem;
  fourthPhoto?: PhotoItem;
  template: SpreadTemplateType;
}

export interface LayoutTemplateOption {
  id: SpreadTemplateType;
  name: string;
  tagline: string;
  photoCountLabel: string;
  description: string;
}

export const LAYOUT_TEMPLATE_OPTIONS: LayoutTemplateOption[] = [
  {
    id: 'MUSEUM_INSET',
    name: 'Museum Inset',
    tagline: 'Classic Fine Art Matting',
    photoCountLabel: '2 Photos',
    description: 'Generous archival borders and white negative space with plate labels beneath.'
  },
  {
    id: 'GRID_QUAD_2X2',
    name: '2×2 Quad Grid',
    tagline: 'Symmetrical 4-Photo Quad Layout',
    photoCountLabel: '4 Photos Grid',
    description: 'Archival quad grid arrangement presenting 4 photos with balanced gutters and plate markers.'
  },
  {
    id: 'FULL_BLEED',
    name: 'Full Bleed',
    tagline: 'Cinematic Edge-to-Edge',
    photoCountLabel: '2 Photos',
    description: 'Borderless high-contrast photos bleeding to the physical edge of both facing pages.'
  },
  {
    id: 'SPLIT_EDITORIAL',
    name: 'Split Editorial',
    tagline: 'Asymmetric Lead & Accent',
    photoCountLabel: '2 Photos',
    description: 'Primary hero focal photo on left facing an offset vertical framed accent on right.'
  },
  {
    id: 'COLLAGE_MULTI',
    name: '3-Photo Collage',
    tagline: 'Triptych Multi-Photo Spread',
    photoCountLabel: '3 Photos',
    description: 'Expansive hero on left with two vertically stacked candid shots on right.'
  },
  {
    id: 'TEXT_HEAVY',
    name: 'Text-Heavy Journal',
    tagline: 'Literary Narrative Plate',
    photoCountLabel: '1 Photo + Story',
    description: 'Literary memoir inscription page on left facing a framed solo hero photo on right.'
  }
];

export const FullBookProofModal: React.FC<FullBookProofModalProps> = ({
  config,
  photos,
  onApproveProof,
  onClose,
  onPreviewQR,
  onUpdateSpreadLayouts
}) => {
  const [activeSpreadIndex, setActiveSpreadIndex] = useState(0);
  const [zoomedSpread, setZoomedSpread] = useState<ProofSpreadItem | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Per-spread layout template overrides
  const [spreadLayouts, setSpreadLayouts] = useState<Record<string, SpreadTemplateType>>(
    () => config.spreadLayouts || {}
  );
  const [activeGallerySpread, setActiveGallerySpread] = useState<ProofSpreadItem | null>(null);

  // Drag-to-scroll state
  const stripRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const spreadItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Resolved configuration details
  const currentSize = BOOK_SIZE_OPTIONS[config.size];
  const currentPaper = PAPER_FINISH_OPTIONS[config.paperFinish];
  const currentColor = COVER_COLOR_OPTIONS.find((c) => c.id === config.coverColor) || COVER_COLOR_OPTIONS[0];
  const currentFoil = FOIL_OPTIONS.find((f) => f.id === config.foilType) || FOIL_OPTIONS[0];
  const currentFontStyle = config.fontStyle || 'MODERN';
  const currentFont = BOOK_FONT_OPTIONS[currentFontStyle];

  // Resolved cover photo and presentation style
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
            className="w-full h-full object-cover select-none pointer-events-none"
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
                    ? 'text-base sm:text-lg font-semibold'
                    : transform.textFontSize === 'xl'
                    ? 'text-lg sm:text-xl font-bold'
                    : 'text-xs sm:text-sm'
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
    title: 'Cover Wrap Spread',
    subtitle: `${currentColor.name} Linen · ${currentFoil.name} Deboss`,
    template: 'MUSEUM_INSET'
  });

  // Spread 2: Introduction & Dedication (if configured)
  if (config.message?.enabled || config.qrMedia?.enabled) {
    spreads.push({
      id: 'proof-dedication',
      type: 'DEDICATION',
      title: 'Introduction & Dedication',
      subtitle: 'Colophon & Archival Inscription Plate',
      pageLeftNum: 1,
      pageRightNum: 2,
      template: 'MUSEUM_INSET'
    });
  }

  // Spreads 3..N: Facing Photo Pages
  const photoStart = config.message?.enabled || config.qrMedia?.enabled ? 1 : 0;
  for (let i = photoStart; i < photos.length; i += 2) {
    const pageNum = spreads.length * 2 + 1;
    const spreadId = `proof-spread-${i}`;
    const selectedTemplate = spreadLayouts[spreadId] || 'MUSEUM_INSET';

    // Candidates for 3rd and 4th photo in multi-photo grids without loss of photos
    const thirdPhotoCandidate =
      photos[i + 2] ||
      photos[(i + 3) % photos.length] ||
      photos[0];

    const fourthPhotoCandidate =
      photos[i + 3] ||
      photos[(i + 4) % photos.length] ||
      photos[1] ||
      photos[0];

    spreads.push({
      id: spreadId,
      type: 'PHOTOS',
      title: `Photo Spread (pp. ${String(pageNum).padStart(2, '0')}–${String(pageNum + 1).padStart(2, '0')})`,
      subtitle: `${photos[i]?.name || 'Photo'}${photos[i + 1] ? ` & ${photos[i + 1].name}` : ''}`,
      pageLeftNum: pageNum,
      pageRightNum: pageNum + 1,
      leftPhoto: photos[i],
      rightPhoto: photos[i + 1] || undefined,
      thirdPhoto: thirdPhotoCandidate,
      fourthPhoto: fourthPhotoCandidate,
      template: selectedTemplate
    });
  }

  // Final Spread: Back Endpaper & Atelier Hallmark
  spreads.push({
    id: 'proof-endpaper',
    type: 'BACK_ENDPAPER',
    title: 'Back Endpaper & Hallmark',
    subtitle: 'Smyth-Sewn Layflat Guarantee',
    pageLeftNum: spreads.length * 2 + 1,
    pageRightNum: spreads.length * 2 + 2,
    template: 'MUSEUM_INSET'
  });

  // Scroll to spread index smoothly
  const scrollToSpread = (index: number) => {
    if (index < 0 || index >= spreads.length) return;
    setActiveSpreadIndex(index);
    const targetEl = spreadItemRefs.current[index];
    if (targetEl && stripRef.current) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGallerySpread) {
        if (e.key === 'Escape') setActiveGallerySpread(null);
        return;
      }

      if (e.key === 'ArrowRight') {
        scrollToSpread(activeSpreadIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        scrollToSpread(activeSpreadIndex - 1);
      } else if (e.key === 'Escape') {
        if (zoomedSpread) {
          setZoomedSpread(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSpreadIndex, spreads.length, zoomedSpread, activeGallerySpread, onClose]);

  // Mouse wheel horizontal scroll handler
  const handleWheel = (e: React.WheelEvent) => {
    if (stripRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      stripRef.current.scrollLeft += e.deltaY;
    }
  };

  // Mouse drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!stripRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - stripRef.current.offsetLeft;
    scrollLeftRef.current = stripRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    stripRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Track active spread during scroll
  const handleScroll = () => {
    if (!stripRef.current) return;
    const container = stripRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    spreadItemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const elCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(containerCenter - elCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeSpreadIndex) {
      setActiveSpreadIndex(closestIdx);
    }
  };

  // Handle template selection
  const handleApplyTemplate = (spreadId: string, template: SpreadTemplateType) => {
    const updated = { ...spreadLayouts, [spreadId]: template };
    setSpreadLayouts(updated);
    if (onUpdateSpreadLayouts) {
      onUpdateSpreadLayouts(updated);
    }
    setActiveGallerySpread(null);
  };

  // Helper to render photo spread by template
  const renderPhotoSpreadContent = (spread: ProofSpreadItem, isZoom: boolean = false) => {
    const template = spread.template;

    // 0. GRID QUAD 2X2: Balanced Archival 4-Photo Layout
    if (template === 'GRID_QUAD_2X2') {
      const p1 = spread.leftPhoto;
      const p2 = spread.rightPhoto || p1;
      const p3 = spread.thirdPhoto || p1;
      const p4 = spread.fourthPhoto || p2 || p1;

      return (
        <div className="w-full h-full grid grid-cols-2 relative bg-[#FAF8F5]">
          <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

          {/* Left Page (2 Quadrant Photos) */}
          <div className="p-2.5 sm:p-4 flex flex-col justify-between border-r border-[#1C1917]/10">
            <div className="h-full flex flex-col justify-between gap-2">
              <div className="flex-1 overflow-hidden bg-[#ECE6DC] relative shadow-2xs border border-[#1C1917]/10 flex flex-col justify-between">
                <div className="h-[75%] overflow-hidden">
                  {p1 ? renderTransformedImage(p1) : null}
                </div>
                <div className="px-2 py-0.5 text-[9px] font-mono text-[#78716C] flex justify-between bg-white/75">
                  <span className={`truncate max-w-[120px] ${currentFont.cssClass}`}>{p1?.name || 'Quad A'}</span>
                  <span className="text-[#A87B4F]">#1</span>
                </div>
              </div>

              <div className="flex-1 overflow-hidden bg-[#ECE6DC] relative shadow-2xs border border-[#1C1917]/10 flex flex-col justify-between">
                <div className="h-[75%] overflow-hidden">
                  {p2 ? renderTransformedImage(p2) : null}
                </div>
                <div className="px-2 py-0.5 text-[9px] font-mono text-[#78716C] flex justify-between bg-white/75">
                  <span className={`truncate max-w-[120px] ${currentFont.cssClass}`}>{p2?.name || 'Quad B'}</span>
                  <span className="text-[#A87B4F]">#2</span>
                </div>
              </div>

              <div className="pt-1 flex items-end justify-between text-[10px] font-mono text-[#78716C] border-t border-[#1C1917]/10">
                <span>2×2 Quad Grid</span>
                <span>p. {spread.pageLeftNum}</span>
              </div>
            </div>
          </div>

          {/* Right Page (2 Quadrant Photos) */}
          <div className="p-2.5 sm:p-4 flex flex-col justify-between">
            <div className="h-full flex flex-col justify-between gap-2">
              <div className="flex-1 overflow-hidden bg-[#ECE6DC] relative shadow-2xs border border-[#1C1917]/10 flex flex-col justify-between">
                <div className="h-[75%] overflow-hidden">
                  {p3 ? renderTransformedImage(p3) : null}
                </div>
                <div className="px-2 py-0.5 text-[9px] font-mono text-[#78716C] flex justify-between bg-white/75">
                  <span className={`truncate max-w-[120px] ${currentFont.cssClass}`}>{p3?.name || 'Quad C'}</span>
                  <span className="text-[#A87B4F]">#3</span>
                </div>
              </div>

              <div className="flex-1 overflow-hidden bg-[#ECE6DC] relative shadow-2xs border border-[#1C1917]/10 flex flex-col justify-between">
                <div className="h-[75%] overflow-hidden">
                  {p4 ? renderTransformedImage(p4) : null}
                </div>
                <div className="px-2 py-0.5 text-[9px] font-mono text-[#78716C] flex justify-between bg-white/75">
                  <span className={`truncate max-w-[120px] ${currentFont.cssClass}`}>{p4?.name || 'Quad D'}</span>
                  <span className="text-[#A87B4F]">#4</span>
                </div>
              </div>

              <div className="pt-1 flex items-end justify-between text-[10px] font-mono text-[#78716C] border-t border-[#1C1917]/10">
                <span>2×2 Quad Grid</span>
                <span>p. {spread.pageRightNum}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 1. FULL BLEED: Borderless Edge-to-Edge
    if (template === 'FULL_BLEED') {
      return (
        <div className="w-full h-full grid grid-cols-2 relative bg-[#FAF8F5]">
          <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/15 pointer-events-none z-20" />

          {/* Left Page (Bleed) */}
          <div className="relative w-full h-full overflow-hidden border-r border-[#1C1917]/10 group">
            {spread.leftPhoto ? (
              <>
                {renderTransformedImage(spread.leftPhoto)}
                <div className="absolute bottom-3 left-3 z-20 bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[10px] font-mono text-white flex items-center justify-between gap-3">
                  <span className={`truncate max-w-[140px] ${currentFont.cssClass}`}>{spread.leftPhoto.name}</span>
                  <span className="text-[#D4AF37]">p. {spread.pageLeftNum}</span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#A8A29E]">Endpaper</div>
            )}
          </div>

          {/* Right Page (Bleed) */}
          <div className="relative w-full h-full overflow-hidden group">
            {spread.rightPhoto ? (
              <>
                {renderTransformedImage(spread.rightPhoto)}
                <div className="absolute bottom-3 right-3 z-20 bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[10px] font-mono text-white flex items-center justify-between gap-3">
                  <span className={`truncate max-w-[140px] ${currentFont.cssClass}`}>{spread.rightPhoto.name}</span>
                  <span className="text-[#D4AF37]">p. {spread.pageRightNum}</span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#A8A29E]">Endpaper</div>
            )}
          </div>
        </div>
      );
    }

    // 2. SPLIT EDITORIAL: Hero Lead with Asymmetrical Offset Accent
    if (template === 'SPLIT_EDITORIAL') {
      return (
        <div className="w-full h-full grid grid-cols-2 relative bg-[#FAF8F5]">
          <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

          {/* Left Page (Hero Lead) */}
          <div className="p-4 sm:p-6 flex flex-col justify-between border-r border-[#1C1917]/10">
            {spread.leftPhoto ? (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#A87B4F] block mb-1">
                    Editorial Lead
                  </span>
                  <h4 className={`text-sm font-semibold truncate ${currentFont.cssClass}`}>{spread.leftPhoto.name}</h4>
                </div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#ECE6DC] shadow-sm my-auto">
                  {renderTransformedImage(spread.leftPhoto)}
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-[#78716C] pt-2 border-t border-[#1C1917]/10">
                  <span>Plate Lead</span>
                  <span>p. {spread.pageLeftNum}</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#A8A29E]">Endpaper</div>
            )}
          </div>

          {/* Right Page (Asymmetric Framed Accent) */}
          <div className="p-5 sm:p-8 flex flex-col justify-between bg-[#FAF8F5]">
            {spread.rightPhoto ? (
              <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between text-[9px] font-mono text-[#A87B4F]">
                  <span>Atelier Accent</span>
                  <span className="uppercase">{currentPaper.name}</span>
                </div>
                <div className="aspect-square w-4/5 mx-auto overflow-hidden bg-[#ECE6DC] shadow-md border border-[#1C1917]/10">
                  {renderTransformedImage(spread.rightPhoto)}
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-[#78716C] pt-2 border-t border-[#1C1917]/10">
                  <span className={`truncate max-w-[130px] ${currentFont.cssClass}`}>{spread.rightPhoto.name}</span>
                  <span>p. {spread.pageRightNum}</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#A8A29E]">Endpaper</div>
            )}
          </div>
        </div>
      );
    }

    // 3. COLLAGE MULTI: Hero on Left, Two Stacked Photos on Right
    if (template === 'COLLAGE_MULTI') {
      return (
        <div className="w-full h-full grid grid-cols-2 relative bg-[#FAF8F5]">
          <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

          {/* Left Page (Hero Photo) */}
          <div className="p-3 sm:p-5 flex flex-col justify-between border-r border-[#1C1917]/10">
            {spread.leftPhoto ? (
              <div className="h-full flex flex-col justify-between">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] shadow-sm">
                  {renderTransformedImage(spread.leftPhoto)}
                </div>
                <div className="pt-2 flex items-end justify-between text-xs border-t border-[#1C1917]/10">
                  <span className={`text-[#1C1917] truncate max-w-[160px] ${currentFont.cssClass}`}>
                    {spread.leftPhoto.name}
                  </span>
                  <span className="text-[#78716C] font-mono text-[10px]">p. {spread.pageLeftNum}</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#A8A29E]">Endpaper</div>
            )}
          </div>

          {/* Right Page (Two Stacked Photos) */}
          <div className="p-3 sm:p-5 flex flex-col justify-between">
            <div className="h-full flex flex-col justify-between gap-2.5">
              {/* Stacked Photo Top */}
              {spread.rightPhoto ? (
                <div className="flex-1 overflow-hidden bg-[#ECE6DC] relative shadow-2xs border border-[#1C1917]/5 flex flex-col justify-between">
                  <div className="h-[75%] overflow-hidden">
                    {renderTransformedImage(spread.rightPhoto)}
                  </div>
                  <div className="px-2 py-0.5 text-[9px] font-mono text-[#78716C] flex justify-between bg-white/70">
                    <span className="truncate max-w-[120px]">{spread.rightPhoto.name}</span>
                    <span>Top</span>
                  </div>
                </div>
              ) : null}

              {/* Stacked Photo Bottom (Auto-pulled 3rd photo) */}
              {spread.thirdPhoto ? (
                <div className="flex-1 overflow-hidden bg-[#ECE6DC] relative shadow-2xs border border-[#1C1917]/5 flex flex-col justify-between">
                  <div className="h-[75%] overflow-hidden">
                    {renderTransformedImage(spread.thirdPhoto)}
                  </div>
                  <div className="px-2 py-0.5 text-[9px] font-mono text-[#78716C] flex justify-between bg-white/70">
                    <span className="truncate max-w-[120px]">{spread.thirdPhoto.name}</span>
                    <span>Bottom</span>
                  </div>
                </div>
              ) : null}

              <div className="pt-1 flex items-end justify-between text-[10px] font-mono text-[#78716C] border-t border-[#1C1917]/10">
                <span>Multi-Photo Triptych</span>
                <span>p. {spread.pageRightNum}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 4. TEXT HEAVY: Journal Memoir Plate on Left + Solo Photo on Right
    if (template === 'TEXT_HEAVY') {
      return (
        <div className="w-full h-full grid grid-cols-2 relative bg-[#FAF8F5]">
          <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

          {/* Left Page: Journal Memoir Story */}
          <div className="p-6 sm:p-8 flex flex-col justify-between border-r border-[#1C1917]/10">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#A87B4F] block mb-2">
                Monograph Journal Note
              </span>
              <h4 className={`text-lg sm:text-xl font-medium text-[#1C1917] ${currentFont.cssClass}`}>
                {spread.leftPhoto?.name || 'A Memory Preserved'}
              </h4>
            </div>

            <div className="my-auto space-y-2">
              <p className={`text-xs sm:text-sm text-[#57534E] leading-relaxed italic ${currentFont.cssClass}`}>
                "{spread.leftPhoto?.caption || 'A stillness captured in natural light, binding our footsteps and memories into permanent tangible cloth.'}"
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#A87B4F] uppercase tracking-wider">
                Yoki Gifts Editions · Addis Ababa
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-[#A8A29E] pt-2 border-t border-[#1C1917]/10">
              <span>Journal Plate</span>
              <span>p. {spread.pageLeftNum}</span>
            </div>
          </div>

          {/* Right Page: Solo Archival Photo */}
          <div className="p-4 sm:p-6 flex flex-col justify-between">
            {spread.rightPhoto || spread.leftPhoto ? (
              <div className="h-full flex flex-col justify-between">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] shadow-sm my-auto">
                  {renderTransformedImage(spread.rightPhoto || spread.leftPhoto!)}
                </div>
                <div className="pt-2 flex items-end justify-between text-xs border-t border-[#1C1917]/10">
                  <span className={`text-[#1C1917] truncate max-w-[180px] ${currentFont.cssClass}`}>
                    {(spread.rightPhoto || spread.leftPhoto)?.name}
                  </span>
                  <span className="text-[#78716C] font-mono text-[10px]">p. {spread.pageRightNum}</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#A8A29E]">Endpaper</div>
            )}
          </div>
        </div>
      );
    }

    // DEFAULT: MUSEUM INSET (Classic 2-Page Matting)
    return (
      <div className="w-full h-full grid grid-cols-2 relative bg-[#FAF8F5]">
        <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

        {/* Left Page */}
        <div className="p-4 sm:p-6 flex flex-col justify-between border-r border-[#1C1917]/10">
          {spread.leftPhoto ? (
            <div className="h-full flex flex-col justify-between">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] shadow-sm">
                {renderTransformedImage(spread.leftPhoto)}
              </div>
              <div className="pt-3 flex items-end justify-between text-xs border-t border-[#1C1917]/10 mt-2">
                <span className={`text-[#1C1917] truncate max-w-[180px] ${currentFont.cssClass}`}>
                  {spread.leftPhoto.name}
                </span>
                <span className="text-[#78716C] font-mono text-[11px]">
                  p. {spread.pageLeftNum}
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
        <div className="p-4 sm:p-6 flex flex-col justify-between">
          {spread.rightPhoto ? (
            <div className="h-full flex flex-col justify-between">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] shadow-sm">
                {renderTransformedImage(spread.rightPhoto)}
              </div>
              <div className="pt-3 flex items-end justify-between text-xs border-t border-[#1C1917]/10 mt-2">
                <span className={`text-[#1C1917] truncate max-w-[180px] ${currentFont.cssClass}`}>
                  {spread.rightPhoto.name}
                </span>
                <span className="text-[#78716C] font-mono text-[11px]">
                  p. {spread.pageRightNum}
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
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121110]/98 backdrop-blur-md flex flex-col justify-between overflow-hidden text-[#FAF8F5] select-none">
      {/* Top Bar: Official Proofing Header */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-black/40">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Full-Book Proofing Studio</span>
              </span>
              <span className="px-2 py-0.5 bg-white/10 text-white/90 text-[10px] font-mono rounded-xs">
                {currentSize.name}
              </span>
              <span className="px-2 py-0.5 bg-white/10 text-[#D4AF37] text-[10px] font-mono rounded-xs hidden sm:inline">
                {currentFont.name} Typography
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-medium text-white truncate max-w-sm sm:max-w-md mt-0.5">
              {config.title || 'UNTITLED PHOTOBOOK'}
            </h2>
          </div>
        </div>

        {/* Center: Strip Inspection Indicator */}
        <div className="hidden md:flex items-center gap-3 text-xs font-mono">
          <span className="text-white/50">Viewing Spread:</span>
          <span className="bg-[#D4AF37] text-[#1C1917] px-3 py-1 font-bold rounded-xs shadow-sm">
            #{activeSpreadIndex + 1} of {spreads.length}
          </span>
          <span className="text-white/60">· {spreads[activeSpreadIndex]?.title}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-white/50 mr-2">
            <Move className="w-3 h-3 text-[#D4AF37]" />
            <span>Drag or scroll strip</span>
          </div>

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

      {/* Main Center Stage: Horizontal Scrollable Spread Strip */}
      <main className="flex-1 flex flex-col justify-center relative overflow-hidden p-4 sm:p-6">
        {/* Floating Left Snap Arrow */}
        <button
          type="button"
          disabled={activeSpreadIndex === 0}
          onClick={() => scrollToSpread(activeSpreadIndex - 1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/70 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] rounded-full flex items-center justify-center transition-all disabled:opacity-20 disabled:pointer-events-none shadow-2xl backdrop-blur-sm"
          title="Previous Spread"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Floating Right Snap Arrow */}
        <button
          type="button"
          disabled={activeSpreadIndex === spreads.length - 1}
          onClick={() => scrollToSpread(activeSpreadIndex + 1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/70 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] rounded-full flex items-center justify-center transition-all disabled:opacity-20 disabled:pointer-events-none shadow-2xl backdrop-blur-sm"
          title="Next Spread"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* The Horizontal Reel Container */}
        <div
          ref={stripRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onScroll={handleScroll}
          className="w-full h-full flex items-center gap-8 sm:gap-12 overflow-x-auto px-[15vw] sm:px-[20vw] py-6 cursor-grab active:cursor-grabbing no-scrollbar scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {spreads.map((spread, idx) => {
            const isActive = idx === activeSpreadIndex;
            const currentTemplateMeta = LAYOUT_TEMPLATE_OPTIONS.find((t) => t.id === spread.template);

            return (
              <div
                key={spread.id}
                ref={(el) => {
                  spreadItemRefs.current[idx] = el;
                }}
                className={`shrink-0 flex flex-col items-center transition-all duration-300 relative ${
                  isActive ? 'scale-100 opacity-100 z-20' : 'scale-90 opacity-60 hover:opacity-85 z-10'
                }`}
                style={{
                  width: 'clamp(540px, 62vw, 840px)',
                  scrollSnapAlign: 'center'
                }}
              >
                {/* Spread Header Badge */}
                <div className="w-full flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-xs uppercase tracking-wider ${
                      isActive ? 'bg-[#D4AF37] text-[#1C1917]' : 'bg-white/10 text-white/70'
                    }`}>
                      Spread #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-white/80 font-medium truncate max-w-[180px]">
                      {spread.title}
                    </span>

                    {/* Template Chip for Photo Spreads */}
                    {spread.type === 'PHOTOS' && currentTemplateMeta && (
                      <span className="px-2 py-0.5 bg-white/15 text-[#D4AF37] text-[10px] font-mono rounded-xs hidden sm:inline">
                        {currentTemplateMeta.name}
                      </span>
                    )}
                  </div>

                  {/* Actions: Zoom Loupe & Layout Gallery Swap */}
                  <div className="flex items-center gap-2">
                    {spread.type === 'PHOTOS' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGallerySpread(spread);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-[#D4AF37] hover:text-[#1C1917] text-white/90 text-[11px] font-mono rounded-xs transition-colors shadow-xs"
                        title="Swap layout template for this spread"
                      >
                        <LayoutTemplate className="w-3.5 h-3.5" />
                        <span>Swap Layout</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedSpread(spread);
                        setZoomScale(1);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-[11px] font-mono rounded-xs transition-colors"
                      title="Inspect spread in high resolution"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Zoom Loupe</span>
                    </button>
                  </div>
                </div>

                {/* SPREAD CARD CONTENT */}
                <div className="w-full aspect-[16/10] bg-[#FAF8F5] text-[#1C1917] shadow-2xl relative border border-white/20 overflow-hidden rounded-xs">
                  {/* SPREAD TYPE 1: COVER WRAP */}
                  {spread.type === 'COVER_WRAP' && (
                    <div
                      className="w-full h-full flex relative overflow-hidden"
                      style={{
                        backgroundColor: currentColor.hex,
                        borderColor: 'rgba(0,0,0,0.2)'
                      }}
                    >
                      {/* Back Cover (Left Half) */}
                      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between border-r border-black/15">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-black/40">
                          Back Cover
                        </span>
                        <div className="text-center">
                          <span
                            className="text-xs font-mono tracking-widest uppercase block font-semibold"
                            style={{ color: currentFoil.previewColor }}
                          >
                            YOKI EDITIONS · ADDIS ABABA
                          </span>
                          <span className="text-[10px] font-mono text-black/60 block mt-1">
                            Hand-bound Smyth Sewn Layflat Monograph
                          </span>
                        </div>
                        <div className="text-right text-[10px] font-mono text-black/40">
                          {currentSize.dimensions}
                        </div>
                      </div>

                      {/* Spine Center Fold */}
                      <div className="w-8 sm:w-10 bg-black/15 flex items-center justify-center relative shadow-inner">
                        <span
                          className={`text-[10px] tracking-widest uppercase rotate-90 whitespace-nowrap ${currentFont.cssClass}`}
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
                          <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between h-full text-center">
                            <div className="pt-2">
                              <span className="text-[9px] font-mono tracking-widest uppercase text-white/70 block">
                                FULL-BLEED PHOTO WRAP
                              </span>
                              <h1
                                className={`text-2xl sm:text-3xl mt-4 tracking-wide leading-snug font-medium uppercase text-white ${currentFont.cssClass}`}
                                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}
                              >
                                {config.title || 'YOUR BOOK TITLE'}
                              </h1>
                              {config.subtitle && (
                                <p
                                  className={`text-xs sm:text-sm mt-2 text-white/90 font-light ${currentFont.cssClass}`}
                                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                                >
                                  {config.subtitle}
                                </p>
                              )}
                            </div>
                            <div className="text-[10px] font-mono tracking-widest uppercase text-white/80">
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
                            <div className="w-32 h-24 sm:w-44 sm:h-32 mx-auto my-3 overflow-hidden shadow-2xl border-2 border-black/30 relative ring-1 ring-white/20 bg-black/10 rounded-xs">
                              <img
                                src={coverPhoto.url}
                                alt="Cameo Cover"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 ring-1 ring-inset ring-black/40 pointer-events-none" />
                            </div>

                            <h1
                              className={`text-xl sm:text-2xl tracking-wide leading-snug font-medium uppercase ${currentFont.cssClass}`}
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
                                className={`text-xs mt-1.5 tracking-wide font-light ${currentFont.cssClass}`}
                                style={{ color: currentFoil.previewColor }}
                              >
                                {config.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: currentFoil.previewColor }}>
                            {currentPaper.name} · {config.pageCount} Pages
                          </div>
                        </div>
                      ) : (
                        /* Pure Debossed Cloth Front Cover */
                        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between text-center">
                          <div className="pt-4">
                            <span
                              className="text-[10px] font-mono tracking-widest uppercase block"
                              style={{ color: currentFoil.previewColor }}
                            >
                              ARCHIVAL EDITION
                            </span>
                            <h1
                              className={`text-2xl sm:text-3xl mt-4 tracking-wide leading-snug font-medium uppercase ${currentFont.cssClass}`}
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
                                className={`text-xs sm:text-sm mt-2 tracking-wide font-light ${currentFont.cssClass}`}
                                style={{ color: currentFoil.previewColor }}
                              >
                                {config.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: currentFoil.previewColor }}>
                            {currentPaper.name} · {config.pageCount} Pages
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SPREAD TYPE 2: INTRODUCTION & DEDICATION */}
                  {spread.type === 'DEDICATION' && (
                    <div className="w-full h-full grid grid-cols-2 relative bg-[#FAF8F5]">
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

                      {/* Left Page (Colophon) */}
                      <div className="p-6 sm:p-8 flex flex-col justify-between border-r border-[#1C1917]/10">
                        <span className="text-[10px] font-mono text-[#78716C] uppercase tracking-widest">
                          p. 01 · Colophon
                        </span>
                        <div className="space-y-3 text-center my-auto">
                          <span className="text-[11px] font-mono tracking-widest uppercase text-[#A87B4F] block font-semibold">
                            Yoki Gifts Monograph Series
                          </span>
                          <h3 className={`text-xl font-medium text-[#1C1917] ${currentFont.cssClass}`}>
                            {config.title || 'Our Chronicle'}
                          </h3>
                          <p className="text-xs text-[#78716C] font-mono">
                            Printed on {currentPaper.weight} {currentPaper.name}
                          </p>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-[#A8A29E]">
                          <span>Addis Ababa Atelier</span>
                          <span>100% Acid-Free</span>
                        </div>
                      </div>

                      {/* Right Page (Dedication & Inscription) */}
                      <div className="p-6 sm:p-8 flex flex-col justify-between">
                        <div className="space-y-4 my-auto">
                          {config.message?.artMotif && config.message.artMotif !== 'NONE' && (
                            <ArtMotifGraphic motif={config.message.artMotif} className="w-8 h-8 text-[#A87B4F]" />
                          )}
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A87B4F] block font-semibold">
                            Dedication Plate
                          </span>
                          <h4 className={`text-xl sm:text-2xl font-medium text-[#1C1917] ${currentFont.cssClass}`}>
                            {config.message?.title || 'Dedication'}
                          </h4>
                          <p className={`text-xs sm:text-sm text-[#57534E] leading-relaxed ${currentFont.cssClass}`}>
                            "{config.message?.bodyText || 'Preserving our moments in tangible archival paper...'}"
                          </p>
                          {config.message?.authorSignature && (
                            <p className={`text-xs sm:text-sm text-[#1C1917] font-medium ${currentFont.cssClass}`}>
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

                        <div className="flex justify-between text-[10px] font-mono text-[#A8A29E] pt-2 border-t border-[#1C1917]/10">
                          <span>Inscription Plate</span>
                          <span>p. 02</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SPREAD TYPE 3: DYNAMIC PHOTO SPREAD WITH SWAPPED TEMPLATE */}
                  {spread.type === 'PHOTOS' && renderPhotoSpreadContent(spread)}

                  {/* SPREAD TYPE 4: BACK ENDPAPER & HALLMARK */}
                  {spread.type === 'BACK_ENDPAPER' && (
                    <div className="w-full h-full grid grid-cols-2 relative bg-[#FAF8F5]">
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-black/10 pointer-events-none z-20" />

                      <div className="p-6 sm:p-8 flex flex-col justify-between border-r border-[#1C1917]/10 text-center">
                        <span className="text-[10px] font-mono text-[#78716C] uppercase tracking-widest">
                          Closing Spread
                        </span>
                        <div className="my-auto space-y-2">
                          <div className="w-12 h-12 border border-[#1C1917]/20 mx-auto flex items-center justify-center rounded-full text-[#1C1917]">
                            <ShieldCheck className="w-6 h-6 text-[#A87B4F]" />
                          </div>
                          <h4 className={`text-lg font-medium text-[#1C1917] ${currentFont.cssClass}`}>
                            Atelier Quality Hallmark
                          </h4>
                          <p className="text-xs text-[#78716C] font-mono leading-relaxed max-w-xs mx-auto">
                            Hand-inspected in Addis Ababa. Bound with archival adhesives and Smyth-sewn linen thread.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-[#A8A29E]">Final Plate</span>
                      </div>

                      <div className="p-6 sm:p-8 flex flex-col justify-between text-center bg-[#FAF8F5]">
                        <span className="text-[10px] font-mono text-[#78716C] uppercase tracking-widest">
                          Endpaper
                        </span>
                        <div className="my-auto space-y-1">
                          <span className="text-xs font-mono uppercase tracking-widest text-[#A87B4F] font-bold">
                            Yoki Gifts Edition
                          </span>
                          <p className="text-xs font-mono text-[#78716C]">
                            All rights reserved · {new Date().getFullYear()}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-[#A8A29E] text-right">Back Endpaper</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Spread Subtitle & Details */}
                <div className="mt-2.5 text-center text-xs font-mono text-white/60 flex items-center gap-2">
                  <span>{spread.subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Control Bar & Interactive Thumbnail Filmstrip */}
      <footer className="border-t border-white/10 bg-black/60 px-6 py-4 shrink-0 space-y-3">
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Previous Spread Button */}
          <button
            type="button"
            disabled={activeSpreadIndex === 0}
            onClick={() => scrollToSpread(activeSpreadIndex - 1)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-mono uppercase transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Spread</span>
          </button>

          {/* Spread Indicator Badge */}
          <div className="text-xs font-mono text-center">
            <span className="text-white font-semibold">
              Spread {activeSpreadIndex + 1}
            </span>
            <span className="text-white/50"> of {spreads.length}</span>
            <span className="text-[#D4AF37] ml-2 hidden sm:inline">
              · {spreads[activeSpreadIndex]?.title}
            </span>
          </div>

          {/* Next Spread or Approve Button */}
          <div className="flex items-center gap-2">
            {activeSpreadIndex < spreads.length - 1 ? (
              <button
                type="button"
                onClick={() => scrollToSpread(activeSpreadIndex + 1)}
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

        {/* Thumbnail Filmstrip (All Spreads Synchronized) */}
        <div className="max-w-7xl mx-auto overflow-x-auto flex items-center gap-2 py-1 no-scrollbar">
          {spreads.map((sp, idx) => {
            const isCurrent = idx === activeSpreadIndex;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => scrollToSpread(idx)}
                className={`shrink-0 px-3 py-1.5 text-[10px] font-mono border transition-all rounded-xs flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[#D4AF37] text-[#1C1917] border-[#D4AF37] font-bold shadow-md scale-105'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>#{idx + 1}</span>
                <span className="truncate max-w-[100px]">{sp.title}</span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* ================================================================ */}
      {/* LAYOUT GALLERY DRAWER (Slide-over Template Customizer) */}
      {/* ================================================================ */}
      {activeGallerySpread && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xl bg-[#1C1917] text-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-white/15 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                    Layout Gallery
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-mono rounded-xs">
                    Spread #{spreads.findIndex((s) => s.id === activeGallerySpread.id) + 1}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-white mt-1">
                  Swap Template for {activeGallerySpread.title}
                </h3>
                <p className="text-xs text-white/60 font-mono mt-0.5">
                  Select a tailored composition. Your photos are dynamically adapted with zero data loss.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveGallerySpread(null)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content: 5 Template Options */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Photo Preservation Banner */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-xs flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-white/80">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Assigned Photos: {activeGallerySpread.leftPhoto?.name || 'Photo 1'} · {activeGallerySpread.rightPhoto?.name || 'Photo 2'}</span>
                </div>
                <span className="text-[#D4AF37] text-[10px] uppercase font-semibold">Protected</span>
              </div>

              {LAYOUT_TEMPLATE_OPTIONS.map((tmpl) => {
                const isCurrent = activeGallerySpread.template === tmpl.id;

                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleApplyTemplate(activeGallerySpread.id, tmpl.id)}
                    className={`group p-4 border rounded-xs transition-all cursor-pointer flex flex-col gap-3 ${
                      isCurrent
                        ? 'bg-[#292522] border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-md'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                          {tmpl.name}
                        </span>
                        <span className="px-2 py-0.5 bg-white/10 text-white/70 text-[10px] font-mono rounded-xs">
                          {tmpl.photoCountLabel}
                        </span>
                      </div>

                      {isCurrent ? (
                        <span className="px-2.5 py-0.5 bg-[#D4AF37] text-[#1C1917] text-[10px] font-mono font-bold rounded-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Active Layout</span>
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to Apply →
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-white/70 font-mono leading-relaxed">
                      {tmpl.description}
                    </p>

                    {/* Miniature Layout Diagram Preview */}
                    <div className="aspect-[16/7] w-full bg-[#FAF8F5] text-[#1C1917] border border-white/20 rounded-xs overflow-hidden relative shadow-inner p-2 pointer-events-none">
                      {tmpl.id === 'FULL_BLEED' && (
                        <div className="w-full h-full grid grid-cols-2 gap-0.5 bg-neutral-300">
                          <div className="bg-[#D4AF37]/30 flex items-center justify-center text-[9px] font-mono font-semibold">
                            Full Bleed L
                          </div>
                          <div className="bg-[#D4AF37]/40 flex items-center justify-center text-[9px] font-mono font-semibold">
                            Full Bleed R
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'GRID_QUAD_2X2' && (
                        <div className="w-full h-full grid grid-cols-2 gap-2 p-1">
                          <div className="grid grid-rows-2 gap-1">
                            <div className="bg-[#ECE6DC] border border-[#1C1917]/20 flex items-center justify-center text-[7px] font-mono">
                              Quad 1
                            </div>
                            <div className="bg-[#ECE6DC] border border-[#1C1917]/20 flex items-center justify-center text-[7px] font-mono">
                              Quad 2
                            </div>
                          </div>
                          <div className="grid grid-rows-2 gap-1">
                            <div className="bg-[#ECE6DC] border border-[#1C1917]/20 flex items-center justify-center text-[7px] font-mono">
                              Quad 3
                            </div>
                            <div className="bg-[#ECE6DC] border border-[#1C1917]/20 flex items-center justify-center text-[7px] font-mono">
                              Quad 4
                            </div>
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'MUSEUM_INSET' && (
                        <div className="w-full h-full grid grid-cols-2 gap-3 p-1">
                          <div className="border border-[#1C1917]/20 bg-[#ECE6DC] flex flex-col justify-between p-1">
                            <div className="w-full h-4/5 bg-black/10" />
                            <span className="text-[7px] font-mono text-center">Inset L</span>
                          </div>
                          <div className="border border-[#1C1917]/20 bg-[#ECE6DC] flex flex-col justify-between p-1">
                            <div className="w-full h-4/5 bg-black/10" />
                            <span className="text-[7px] font-mono text-center">Inset R</span>
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'SPLIT_EDITORIAL' && (
                        <div className="w-full h-full grid grid-cols-2 gap-2 p-1">
                          <div className="border border-[#1C1917]/20 bg-[#ECE6DC] p-1 flex flex-col justify-between">
                            <span className="text-[7px] font-mono text-[#A87B4F]">Hero Lead</span>
                            <div className="w-full h-3/5 bg-black/15" />
                            <span className="text-[7px] font-mono">Title Bar</span>
                          </div>
                          <div className="p-1 flex items-center justify-center">
                            <div className="w-3/4 h-3/4 bg-[#ECE6DC] border border-[#1C1917]/20 flex items-center justify-center text-[7px] font-mono">
                              Accent Frame
                            </div>
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'COLLAGE_MULTI' && (
                        <div className="w-full h-full grid grid-cols-2 gap-2 p-1">
                          <div className="bg-[#ECE6DC] border border-[#1C1917]/20 flex items-center justify-center text-[8px] font-mono">
                            Hero Left
                          </div>
                          <div className="grid grid-rows-2 gap-1">
                            <div className="bg-[#ECE6DC] border border-[#1C1917]/20 flex items-center justify-center text-[7px] font-mono">
                              Top Stack
                            </div>
                            <div className="bg-[#ECE6DC] border border-[#1C1917]/20 flex items-center justify-center text-[7px] font-mono">
                              Bottom Stack
                            </div>
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'TEXT_HEAVY' && (
                        <div className="w-full h-full grid grid-cols-2 gap-2 p-1">
                          <div className="p-1 border border-[#1C1917]/20 flex flex-col justify-between">
                            <span className="text-[7px] font-mono text-[#A87B4F]">Journal Note</span>
                            <div className="space-y-0.5">
                              <div className="h-1 bg-black/20 w-4/5" />
                              <div className="h-1 bg-black/15 w-full" />
                              <div className="h-1 bg-black/15 w-2/3" />
                            </div>
                            <span className="text-[6px] font-mono">Inscription</span>
                          </div>
                          <div className="bg-[#ECE6DC] border border-[#1C1917]/20 flex items-center justify-center text-[8px] font-mono">
                            Solo Photo
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-white/60">
                5 curated atelier templates available
              </span>
              <button
                type="button"
                onClick={() => setActiveGallerySpread(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xs transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* SPREAD ZOOM LOUPE MODAL */}
      {/* ================================================================ */}
      {zoomedSpread && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-lg flex flex-col justify-between p-6 overflow-hidden">
          {/* Zoom Modal Header */}
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-[#D4AF37] font-bold uppercase tracking-wider">
                High-Resolution Loupe Inspection
              </span>
              <span className="text-white/60">· {zoomedSpread.title}</span>
              {zoomedSpread.type === 'PHOTOS' && (
                <span className="px-2 py-0.5 bg-white/10 text-[#D4AF37] rounded-xs">
                  {LAYOUT_TEMPLATE_OPTIONS.find((t) => t.id === zoomedSpread.template)?.name || 'Custom'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom In / Out Controls */}
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.max(0.8, prev - 0.2))}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xs"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white font-mono">{Math.round(zoomScale * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.min(2.5, prev + 0.2))}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xs"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomedSpread(null)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xs ml-4"
                title="Close Loupe"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Zoom Modal Center */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            <div
              className="max-w-5xl w-full aspect-[16/10] bg-[#FAF8F5] text-[#1C1917] shadow-2xl border border-white/30 overflow-hidden transition-transform duration-200"
              style={{ transform: `scale(${zoomScale})` }}
            >
              {zoomedSpread.type === 'COVER_WRAP' && (
                <div
                  className="w-full h-full flex"
                  style={{ backgroundColor: currentColor.hex }}
                >
                  <div className="flex-1 p-8 flex flex-col justify-between border-r border-black/15">
                    <span className="text-xs font-mono uppercase text-black/40">Back Cover</span>
                    <div className="text-center font-mono">
                      <span className="text-sm font-semibold block" style={{ color: currentFoil.previewColor }}>
                        YOKI EDITIONS
                      </span>
                      <span className="text-xs text-black/60 block mt-1">Smyth-sewn layflat binding</span>
                    </div>
                    <span className="text-right text-xs font-mono text-black/40">{currentSize.dimensions}</span>
                  </div>
                  <div className="w-10 bg-black/15 flex items-center justify-center">
                    <span className={`text-xs uppercase rotate-90 ${currentFont.cssClass}`} style={{ color: currentFoil.previewColor }}>
                      {config.title || 'YOKI'}
                    </span>
                  </div>
                  {/* Front Cover in Loupe */}
                  {coverStyle === 'FULL_WRAP' && coverPhoto ? (
                    <div className="flex-1 relative overflow-hidden flex flex-col justify-between">
                      <img
                        src={coverPhoto.url}
                        alt="Front Cover Wrap"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
                      <div className="relative z-10 p-10 flex flex-col justify-between h-full text-center">
                        <div>
                          <span className="text-xs font-mono uppercase text-white/70">FULL-BLEED PHOTO WRAP</span>
                          <h2 className={`text-4xl mt-4 font-bold text-white ${currentFont.cssClass}`} style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
                            {config.title || 'UNTITLED PHOTOBOOK'}
                          </h2>
                          {config.subtitle && (
                            <p className={`text-sm mt-2 text-white/90 ${currentFont.cssClass}`}>
                              {config.subtitle}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-mono text-white/80">
                          {currentPaper.name} · {config.pageCount} Pages
                        </span>
                      </div>
                    </div>
                  ) : coverStyle === 'CAMEO_INSET' && coverPhoto ? (
                    <div className="flex-1 p-8 flex flex-col justify-between text-center relative">
                      <div>
                        <span className="text-xs font-mono uppercase" style={{ color: currentFoil.previewColor }}>
                          ARCHIVAL EDITION · CAMEO INSET
                        </span>
                        <div className="w-52 h-36 mx-auto my-3 overflow-hidden shadow-2xl border-2 border-black/30 relative ring-1 ring-white/20 bg-black/10 rounded-xs">
                          <img
                            src={coverPhoto.url}
                            alt="Cameo Cover"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h2 className={`text-3xl mt-2 font-bold ${currentFont.cssClass}`} style={{ color: currentFoil.previewColor }}>
                          {config.title || 'UNTITLED PHOTOBOOK'}
                        </h2>
                        {config.subtitle && (
                          <p className={`text-sm mt-1 text-[#57534E] ${currentFont.cssClass}`} style={{ color: currentFoil.previewColor }}>
                            {config.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-mono" style={{ color: currentFoil.previewColor }}>
                        {currentPaper.name} · {config.pageCount} Pages
                      </span>
                    </div>
                  ) : (
                    <div className="flex-1 p-10 flex flex-col justify-between text-center">
                      <div>
                        <span className="text-xs font-mono uppercase" style={{ color: currentFoil.previewColor }}>ARCHIVAL EDITION</span>
                        <h2 className={`text-3xl mt-4 font-bold ${currentFont.cssClass}`} style={{ color: currentFoil.previewColor }}>
                          {config.title || 'UNTITLED PHOTOBOOK'}
                        </h2>
                        {config.subtitle && (
                          <p className={`text-sm mt-2 font-light ${currentFont.cssClass}`} style={{ color: currentFoil.previewColor }}>
                            {config.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-mono" style={{ color: currentFoil.previewColor }}>
                        {currentPaper.name} · {config.pageCount} Pages
                      </span>
                    </div>
                  )}
                </div>
              )}

              {zoomedSpread.type === 'PHOTOS' && renderPhotoSpreadContent(zoomedSpread, true)}

              {zoomedSpread.type === 'DEDICATION' && (
                <div className="w-full h-full grid grid-cols-2 p-8">
                  <div className="p-6 border-r border-[#1C1917]/10 flex flex-col justify-between text-center">
                    <span className="text-xs font-mono text-[#78716C]">p. 01 · Colophon</span>
                    <h3 className={`text-2xl font-medium ${currentFont.cssClass}`}>{config.title || 'Our Chronicle'}</h3>
                    <span className="text-xs font-mono text-[#A8A29E]">100% Acid-Free Paper</span>
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <span className="text-xs font-mono uppercase text-[#A87B4F]">Dedication Plate</span>
                    <div className="my-auto space-y-2">
                      <h4 className={`text-2xl font-medium ${currentFont.cssClass}`}>{config.message?.title}</h4>
                      <p className={`text-sm text-[#57534E] leading-relaxed ${currentFont.cssClass}`}>"{config.message?.bodyText}"</p>
                      {config.message?.authorSignature && <p className={`text-sm font-medium ${currentFont.cssClass}`}>— {config.message.authorSignature}</p>}
                    </div>
                    <span className="text-xs font-mono text-[#A8A29E] text-right">p. 02</span>
                  </div>
                </div>
              )}

              {zoomedSpread.type === 'BACK_ENDPAPER' && (
                <div className="w-full h-full grid grid-cols-2 p-8">
                  <div className="p-6 border-r border-[#1C1917]/10 flex flex-col justify-between text-center">
                    <span className="text-xs font-mono text-[#78716C]">Closing Spread</span>
                    <div className="my-auto space-y-2">
                      <ShieldCheck className="w-8 h-8 text-[#A87B4F] mx-auto" />
                      <h4 className={`text-xl font-medium ${currentFont.cssClass}`}>Atelier Quality Hallmark</h4>
                      <p className="text-xs font-mono text-[#78716C]">Smyth-sewn layflat binding</p>
                    </div>
                    <span className="text-xs font-mono text-[#A8A29E]">Addis Ababa Press</span>
                  </div>
                  <div className="p-6 flex flex-col justify-between text-center">
                    <span className="text-xs font-mono text-[#78716C]">Endpaper</span>
                    <div className="my-auto">
                      <span className="text-sm font-mono text-[#A87B4F] uppercase tracking-wider font-bold">Yoki Gifts</span>
                      <p className="text-xs font-mono text-[#78716C]">Archival Keepsake Edition</p>
                    </div>
                    <span className="text-xs font-mono text-[#A8A29E] text-right">Back Plate</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Zoom Modal Footer */}
          <div className="text-center text-xs font-mono text-white/50 pt-3 border-t border-white/10">
            Click Close or press Esc to return to horizontal scroll strip
          </div>
        </div>
      )}
    </div>
  );
};
