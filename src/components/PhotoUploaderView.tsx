import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Grid,
  Sparkles,
  Check,
  Star,
  Plus,
  Info,
  FileText,
  QrCode,
  Edit3,
  Layers,
  Ruler,
  Maximize2,
  Sliders,
  Scissors,
  Crop,
  Search,
  Tag,
  Tags,
  Eye,
  Type,
  Palette,
  X
} from 'lucide-react';
import { PhotoItem, BookConfiguration, BookMessage, BookQRMedia, PhotoTransform } from '../types';
import { getInitialSamplePhotos } from '../data/curatedPhotos';
import { BOOK_FONT_OPTIONS, getPhotoFilterCss } from '../data/products';
import { PrintableQRBadge } from './PrintableQRBadge';
import { ArtMotifGraphic } from './ArtMotifGraphic';
import { BatchTagModal } from './BatchTagModal';
import { AutoLayoutModal } from './AutoLayoutModal';
import { FullBookProofModal } from './FullBookProofModal';
import { PagePhotoTextEditorModal } from './PagePhotoTextEditorModal';

export type PrintLayoutTemplate = 'MUSEUM_INSET' | 'FULL_BLEED' | 'EDITORIAL_SPLIT';

interface PhotoUploaderViewProps {
  photos: PhotoItem[];
  config: BookConfiguration;
  onUpdatePhotos: (photos: PhotoItem[]) => void;
  onUpdateConfig: (updatedConfig: BookConfiguration) => void;
  onProceedToCheckout: () => void;
  onBackToConfig: () => void;
  onOpenMessageAndQREditor: () => void;
  onPreviewQR: (qrMedia: BookQRMedia) => void;
  onOpenCanvasEditor: (photo: PhotoItem) => void;
}

export const PhotoUploaderView: React.FC<PhotoUploaderViewProps> = ({
  photos,
  config,
  onUpdatePhotos,
  onUpdateConfig,
  onProceedToCheckout,
  onBackToConfig,
  onOpenMessageAndQREditor,
  onPreviewQR,
  onOpenCanvasEditor
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'spreads' | 'printPreview'>('grid');
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2D Print Preview States
  const [layoutTemplate, setLayoutTemplate] = useState<PrintLayoutTemplate>('MUSEUM_INSET');
  const [showPrintGuides, setShowPrintGuides] = useState(true);

  // Search & Tag Filter States
  const PRESET_TAGS = ['Ceremony', 'Portraits', 'Candid', 'Landscape', 'Details'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [quickTagPhotoId, setQuickTagPhotoId] = useState<string | null>(null);
  const [isAutoLayoutModalOpen, setIsAutoLayoutModalOpen] = useState(false);
  const [autoLayoutNotice, setAutoLayoutNotice] = useState<string | null>(null);
  const [isFullBookProofOpen, setIsFullBookProofOpen] = useState(false);
  const [textEditorPhoto, setTextEditorPhoto] = useState<PhotoItem | null>(null);

  // Extract all existing unique tags from photos
  const allCustomTags = Array.from(
    new Set(
      photos
        .flatMap((p) => p.tags || [])
        .filter((t) => !PRESET_TAGS.includes(t))
    )
  );
  const allAvailableTags = [...PRESET_TAGS, ...allCustomTags];

  // Filtered photos based on search query and selected tag
  const filteredPhotos = photos.filter((photo) => {
    // Tag filter
    if (selectedTag) {
      if (selectedTag === 'COVER') {
        if (!photo.isCover) return false;
      } else {
        if (!photo.tags || !photo.tags.includes(selectedTag)) return false;
      }
    }
    // Search query filter (matches photo name, caption, or tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = photo.name.toLowerCase().includes(q);
      const captionMatch = photo.caption?.toLowerCase().includes(q) ?? false;
      const tagMatch = photo.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
      if (!nameMatch && !captionMatch && !tagMatch) return false;
    }
    return true;
  });

  const handleTogglePhotoTag = (photoId: string, tag: string) => {
    const updated = photos.map((p) => {
      if (p.id !== photoId) return p;
      const currentTags = p.tags || [];
      const has = currentTags.includes(tag);
      const nextTags = has
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      return { ...p, tags: nextTags };
    });
    onUpdatePhotos(updated);
  };

  const handleRemovePhotoTag = (photoId: string, tagToRemove: string) => {
    const updated = photos.map((p) => {
      if (p.id !== photoId) return p;
      const currentTags = p.tags || [];
      return { ...p, tags: currentTags.filter((t) => t !== tagToRemove) };
    });
    onUpdatePhotos(updated);
  };

  const handleAddCustomPhotoTag = (photoId: string, customTag: string) => {
    const trimmed = customTag.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const updated = photos.map((p) => {
      if (p.id !== photoId) return p;
      const currentTags = p.tags || [];
      if (currentTags.includes(formatted)) return p;
      return { ...p, tags: [...currentTags, formatted] };
    });
    onUpdatePhotos(updated);
  };

  const handleBatchApplyTags = (
    photoIds: string[],
    tagsToAdd: string[],
    tagsToRemove: string[]
  ) => {
    const targetSet = new Set(photoIds);
    const updated = photos.map((p) => {
      if (!targetSet.has(p.id)) return p;
      let nextTags = [...(p.tags || [])];
      tagsToAdd.forEach((t) => {
        if (!nextTags.includes(t)) nextTags.push(t);
      });
      if (tagsToRemove.length > 0) {
        nextTags = nextTags.filter((t) => !tagsToRemove.includes(t));
      }
      return { ...p, tags: nextTags };
    });
    onUpdatePhotos(updated);
  };

  const MAX_PHOTOS = 30;
  const remainingSlots = MAX_PHOTOS - photos.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(Array.from(e.target.files));
  };

  const processFiles = (newFiles: File[]) => {
    if (photos.length >= MAX_PHOTOS) {
      alert(`You have already reached the maximum limit of ${MAX_PHOTOS} photos.`);
      return;
    }

    const filesToProcess = newFiles.slice(0, remainingSlots);
    const newItems: PhotoItem[] = filesToProcess.map((file, i) => {
      const url = URL.createObjectURL(file);
      const isFirst = photos.length === 0 && i === 0;
      return {
        id: `upload-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        url,
        name: file.name.replace(/\.[^/.]+$/, ""),
        caption: 'Captured moment',
        isCover: isFirst,
        aspectRatio: 'landscape',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
    });

    onUpdatePhotos([...photos, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSetCover = (id: string) => {
    const updated = photos.map(p => ({
      ...p,
      isCover: p.id === id
    }));
    onUpdatePhotos(updated);
    onUpdateConfig({
      ...config,
      coverPhotoId: id
    });
  };

  const handleRemovePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    if (updated.length > 0 && !updated.some(p => p.isCover)) {
      updated[0].isCover = true;
    }
    onUpdatePhotos(updated);
  };

  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const copy = [...photos];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onUpdatePhotos(copy);
  };

  const handleLoadSampleSet = () => {
    const samplePhotos = getInitialSamplePhotos(18);
    onUpdatePhotos(samplePhotos);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all uploaded photos from this photobook?')) {
      onUpdatePhotos([]);
    }
  };

  const handleApplyAutoLayout = (reordered: PhotoItem[]) => {
    onUpdatePhotos(reordered);
    setActiveTab('spreads');
    setSpreadIndex(0);
    setAutoLayoutNotice('Intelligent Auto-Layout applied: Spreads balanced by aspect ratio & chapters.');
    setTimeout(() => {
      setAutoLayoutNotice(null);
    }, 4500);
  };

  const currentFontStyle = config.fontStyle || 'MODERN';
  const currentFont = BOOK_FONT_OPTIONS[currentFontStyle];

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
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text overlay on image if configured */}
        {transform?.textOverlay && (
          <div
            className="absolute pointer-events-none z-10 text-center px-1.5 py-0.5 select-none"
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
              className={`px-2 py-0.5 rounded-xs transition-all ${
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
                    ? 'text-[9px]'
                    : transform.textFontSize === 'sm'
                    ? 'text-[11px]'
                    : transform.textFontSize === 'lg'
                    ? 'text-sm sm:text-base font-semibold'
                    : transform.textFontSize === 'xl'
                    ? 'text-base sm:text-lg font-bold'
                    : 'text-[10px] sm:text-xs'
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

  // Build Spreads:
  interface SpreadItem {
    type: 'DEDICATION' | 'PHOTOS';
    left: any;
    right: any;
    pageLeftNum: number;
    pageRightNum: number;
  }

  const spreads: SpreadItem[] = [];

  if (config.message?.enabled || config.qrMedia?.enabled) {
    spreads.push({
      type: 'DEDICATION',
      left: {
        message: config.message,
        qrMedia: config.qrMedia
      },
      right: photos[0] || null,
      pageLeftNum: 1,
      pageRightNum: 2
    });
  }

  const photoStartIndex = (config.message?.enabled || config.qrMedia?.enabled) ? 1 : 0;
  for (let i = photoStartIndex; i < photos.length; i += 2) {
    const pageNumOffset = spreads.length * 2 + 1;
    spreads.push({
      type: 'PHOTOS',
      left: photos[i],
      right: photos[i + 1] || null,
      pageLeftNum: pageNumOffset,
      pageRightNum: pageNumOffset + 1
    });
  }

  const currentSpread = spreads[spreadIndex] || null;

  const isA4 = config.size === 'A4_HARDCOVER';
  const pageDimensions = isA4 ? '210 × 297 mm' : '148 × 210 mm';

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3 text-xs text-[#78716C] mb-6 font-mono">
        <button
          onClick={onBackToConfig}
          className="hover:text-[#1C1917] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Configurator</span>
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#1C1917] font-semibold">Photo Studio & Canvas</span>
        <span aria-hidden="true">/</span>
        <span className="text-[#A8A29E]">ETB Checkout (Next)</span>
      </div>

      {/* Header and Controls (Clean & Minimal) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-[#1C1917]/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-sans font-light text-[#1C1917]">
            Photo Gallery & Canvas
          </h1>
          <p className="text-xs text-[#78716C] font-mono mt-0.5">
            {photos.length} photos uploaded · Click any photo to zoom, rotate or filter on canvas
          </p>
        </div>

        {/* View Switcher & Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented View Switcher */}
          <div className="flex items-center bg-[#EFECE6] p-1 border border-[#1C1917]/10">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors ${
                activeTab === 'grid'
                  ? 'bg-white text-[#1C1917] shadow-sm font-semibold'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid ({photos.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('spreads')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors ${
                activeTab === 'spreads'
                  ? 'bg-white text-[#1C1917] shadow-sm font-semibold'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3D Spreads</span>
            </button>
            <button
              onClick={() => setActiveTab('printPreview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors ${
                activeTab === 'printPreview'
                  ? 'bg-[#1C1917] text-white shadow-sm font-semibold'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>2D Print Preview</span>
            </button>
          </div>

          {/* Cover Style Toggle */}
          <button
            type="button"
            onClick={() =>
              onUpdateConfig({
                ...config,
                coverStyle: config.coverStyle === 'FULL_WRAP' ? 'CAMEO_INSET' : 'FULL_WRAP'
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#1C1917] bg-white border border-[#1C1917]/15 hover:border-[#1C1917] transition-colors shadow-xs"
            title="Toggle Cover Style: Cameo Inset Window vs Full-Bleed Photo Wrap"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#A87B4F]" />
            <span>
              Cover: {config.coverStyle === 'FULL_WRAP' ? 'Full-Bleed Wrap' : 'Cameo Inset'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoLayoutModalOpen(true)}
            disabled={photos.length < 2}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#1C1917] bg-white border border-[#1C1917]/15 hover:border-[#1C1917] hover:bg-[#FAF8F5] transition-colors shadow-xs disabled:opacity-50"
            title="Auto-organize spreads by aspect ratio and category tags"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A87B4F]" />
            <span>Suggest Auto-Layout</span>
          </button>

          <button
            onClick={onOpenMessageAndQREditor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#1C1917] bg-white border border-[#1C1917]/15 hover:border-[#1C1917] transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#A87B4F]" />
            <span>Message & QR</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullBookProofOpen(true)}
            disabled={photos.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#1C1917] bg-[#D4AF37]/20 border border-[#D4AF37] hover:bg-[#D4AF37]/35 transition-colors shadow-xs font-medium disabled:opacity-50"
            title="Inspect every page spread in horizontal scrollable strip"
          >
            <Eye className="w-3.5 h-3.5 text-[#A87B4F]" />
            <span>Full-Book Proof</span>
          </button>

          <button
            onClick={onProceedToCheckout}
            disabled={photos.length === 0}
            className={`flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-wider font-mono font-medium text-white transition-all ${
              photos.length > 0
                ? 'bg-[#1C1917] hover:bg-[#2C2825]'
                : 'bg-[#A8A29E] cursor-not-allowed opacity-60'
            }`}
          >
            <span>Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Auto-Layout Applied Notification Banner */}
      {autoLayoutNotice && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{autoLayoutNotice}</span>
          </div>
          <button
            onClick={() => setAutoLayoutNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* TAB 1: GRID VIEW WITH CANVAS EDIT BUTTONS */}
      {activeTab === 'grid' && (
        <div className="space-y-6">
          {/* Multi-File Upload Drag & Drop Zone */}
          {photos.length < MAX_PHOTOS && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-[#1C1917] bg-[#EFECE6]'
                  : 'border-[#1C1917]/20 hover:border-[#1C1917]/40 bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <Upload className="w-6 h-6 text-[#78716C] mb-2" />
                <h3 className="font-sans font-medium text-base text-[#1C1917]">
                  Drop photos here or click to browse
                </h3>
                <span className="text-[11px] font-mono text-[#78716C] mt-0.5">
                  Up to 30 high-resolution photos · {remainingSlots} slots remaining
                </span>
              </div>
            </div>
          )}

          {/* Photos Grid & Filter Area */}
          {photos.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#1C1917]/10 p-8 space-y-3">
              <ImageIcon className="w-8 h-8 text-[#A8A29E] mx-auto stroke-1" />
              <h3 className="font-sans text-lg text-[#1C1917]">No photos uploaded yet</h3>
              <button
                onClick={handleLoadSampleSet}
                className="px-4 py-2 text-xs font-mono uppercase bg-[#1C1917] text-white hover:bg-[#2C2825]"
              >
                Load Sample Photos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search Bar & Horizontal Tag Filter Bar */}
              <div className="bg-white border border-[#1C1917]/10 p-4 space-y-3 shadow-xs">
                {/* Row 1: Search input + Results summary + Batch Tag button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search photos by file name, caption, or tag..."
                      className="w-full pl-9 pr-8 py-2 bg-[#FAF8F5] border border-[#1C1917]/15 text-xs font-mono placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Batch Tag Button & Results Count */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono">
                    <span className="text-[#78716C]">
                      Showing <strong className="text-[#1C1917]">{filteredPhotos.length}</strong> of {photos.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsBatchModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F5] border border-[#1C1917]/15 hover:border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors shadow-xs"
                    >
                      <Tags className="w-3.5 h-3.5 text-[#A87B4F]" />
                      <span>Batch Tag Photos</span>
                    </button>
                  </div>
                </div>

                {/* Row 2: Horizontal Tag Filter Pill Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar text-xs font-mono">
                  <span className="text-[10px] uppercase tracking-wider text-[#A87B4F] shrink-0 font-semibold mr-1">
                    Tags:
                  </span>

                  {/* All Photos pill */}
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1 border transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedTag === null
                        ? 'bg-[#1C1917] text-white border-[#1C1917] font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]'
                    }`}
                  >
                    <span>All</span>
                    <span className="text-[10px] opacity-75">({photos.length})</span>
                  </button>

                  {/* Cover / Favorites pill */}
                  <button
                    type="button"
                    onClick={() => setSelectedTag(selectedTag === 'COVER' ? null : 'COVER')}
                    className={`px-3 py-1 border transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedTag === 'COVER'
                        ? 'bg-[#1C1917] text-white border-[#1C1917] font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]'
                    }`}
                  >
                    <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                    <span>Cover</span>
                    <span className="text-[10px] opacity-75">
                      ({photos.filter((p) => p.isCover).length})
                    </span>
                  </button>

                  {/* Curated Presets + Custom Tags Pills */}
                  {allAvailableTags.map((tag) => {
                    const isSelected = selectedTag === tag;
                    const count = photos.filter((p) => p.tags?.includes(tag)).length;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(isSelected ? null : tag)}
                        className={`px-3 py-1 border transition-all shrink-0 flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#1C1917] text-white border-[#1C1917] font-semibold shadow-xs'
                            : 'bg-[#FAF8F5] text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]'
                        }`}
                      >
                        <span>{tag}</span>
                        <span className="text-[10px] opacity-75">({count})</span>
                      </button>
                    );
                  })}

                  {/* Clear all active filters button */}
                  {(selectedTag !== null || searchQuery.trim() !== '') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTag(null);
                        setSearchQuery('');
                      }}
                      className="px-2.5 py-1 text-rose-700 hover:text-rose-900 underline text-[11px] shrink-0 ml-auto"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {/* Empty filtered results state */}
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-12 bg-white border border-[#1C1917]/10 p-6 space-y-3">
                  <Tag className="w-8 h-8 text-[#A8A29E] mx-auto stroke-1" />
                  <h4 className="font-sans text-base text-[#1C1917]">
                    No photos found matching your filter
                  </h4>
                  <p className="text-xs text-[#78716C] font-mono">
                    {searchQuery && `Search: "${searchQuery}" `}
                    {selectedTag && `Tag: "${selectedTag}"`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTag(null);
                    }}
                    className="px-4 py-1.5 text-xs font-mono uppercase bg-[#1C1917] text-white hover:bg-[#2C2825]"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              ) : (
                /* Filtered Photos Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {filteredPhotos.map((photo) => {
                    const realIndex = photos.findIndex((p) => p.id === photo.id);

                    return (
                      <div
                        key={photo.id}
                        className={`bg-white border transition-all relative group flex flex-col justify-between ${
                          photo.isCover
                            ? 'border-[#1C1917] ring-2 ring-[#1C1917] shadow-md'
                            : 'border-[#1C1917]/10 hover:border-[#1C1917]/40 shadow-sm'
                        }`}
                      >
                        {/* Photo Display with Canvas Transformations */}
                        <div className="aspect-square bg-[#EFECE6] relative overflow-hidden">
                          {renderTransformedImage(photo)}

                          {photo.isCover && (
                            <div className="absolute top-2 left-2 bg-[#1C1917] text-white px-1.5 py-0.5 text-[9px] font-mono uppercase flex items-center gap-1 z-20">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>Cover</span>
                            </div>
                          )}

                          <div className="absolute top-2 right-2 bg-black/60 text-white px-1.5 py-0.5 text-[9px] font-mono tabular-nums backdrop-blur-sm z-20">
                            #{realIndex + 1}
                          </div>

                          {/* Quick Canvas Edit & Text Overlay Buttons */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-1.5 p-2 z-20">
                            <button
                              type="button"
                              onClick={() => setTextEditorPhoto(photo)}
                              className="px-2.5 py-1.5 bg-[#D4AF37] text-[#1C1917] hover:bg-[#E5C158] text-xs font-mono font-bold flex items-center gap-1 shadow-md"
                              title="Add Text in Middle & Alignment Grid"
                            >
                              <Type className="w-3.5 h-3.5 text-[#1C1917]" />
                              <span>Text & Grid</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onOpenCanvasEditor(photo)}
                              className="px-2.5 py-1.5 bg-white text-[#1C1917] hover:bg-[#FAF8F5] text-xs font-mono flex items-center gap-1 shadow-md"
                              title="Open Canvas Crop & Filter Editor"
                            >
                              <Crop className="w-3.5 h-3.5" />
                              <span>Crop</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(photo.id)}
                              className="p-1.5 bg-red-600 text-white hover:bg-red-700 text-xs shadow-md"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Caption & Tag Management Controls */}
                        <div className="p-2.5 border-t border-[#1C1917]/10 flex flex-col justify-between flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className="text-xs font-sans font-medium text-[#1C1917] truncate max-w-[120px]"
                              title={photo.name}
                            >
                              {photo.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setTextEditorPhoto(photo)}
                                className="text-[10px] font-mono text-[#D4AF37] font-semibold hover:underline flex items-center gap-0.5"
                                title="Add text in middle of photo"
                              >
                                <Type className="w-3 h-3" />
                                <span>Text</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenCanvasEditor(photo)}
                                className="text-[10px] font-mono text-[#78716C] hover:underline shrink-0"
                              >
                                Edit
                              </button>
                            </div>
                          </div>

                          {/* On-Card Tag Badges + Quick Tag Popover */}
                          <div className="flex flex-wrap items-center gap-1 my-1 min-h-[22px]">
                            {photo.tags &&
                              photo.tags.map((t) => (
                                <span
                                  key={t}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FAF8F5] border border-[#1C1917]/15 text-[9px] font-mono text-[#57534E] rounded-xs group/tag"
                                >
                                  <span>{t}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemovePhotoTag(photo.id, t);
                                    }}
                                    className="hover:text-red-600 transition-colors opacity-50 group-hover/tag:opacity-100"
                                    title={`Remove ${t}`}
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}

                            {/* Quick Add Tag Button & Dropdown */}
                            <div className="relative inline-block">
                              <button
                                type="button"
                                onClick={() =>
                                  setQuickTagPhotoId(
                                    quickTagPhotoId === photo.id ? null : photo.id
                                  )
                                }
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-dashed border-[#1C1917]/25 hover:border-[#1C1917] text-[9px] font-mono text-[#A87B4F] transition-colors rounded-xs"
                                title="Add Tag"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>Tag</span>
                              </button>

                              {/* Quick Tag Popover Dropdown */}
                              {quickTagPhotoId === photo.id && (
                                <div
                                  className="absolute left-0 bottom-full mb-1 z-30 bg-white border border-[#1C1917]/20 shadow-xl p-2 rounded-xs w-48 text-left space-y-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-1">
                                    <span className="text-[10px] font-mono font-semibold text-[#1C1917]">
                                      Assign Tag
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setQuickTagPhotoId(null)}
                                      className="text-[#78716C] hover:text-[#1C1917]"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>

                                  {/* Preset tags */}
                                  <div className="flex flex-wrap gap-1">
                                    {PRESET_TAGS.map((pt) => {
                                      const has = photo.tags?.includes(pt);
                                      return (
                                        <button
                                          key={pt}
                                          type="button"
                                          onClick={() => handleTogglePhotoTag(photo.id, pt)}
                                          className={`px-1.5 py-0.5 text-[9px] font-mono border transition-colors ${
                                            has
                                              ? 'bg-[#1C1917] text-white border-[#1C1917]'
                                              : 'bg-[#FAF8F5] text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]'
                                          }`}
                                        >
                                          {has ? '✓ ' : '+ '}
                                          {pt}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Custom tag input on enter */}
                                  <div className="pt-1 border-t border-[#1C1917]/10">
                                    <input
                                      type="text"
                                      placeholder="Type new tag & Enter..."
                                      maxLength={18}
                                      className="w-full px-1.5 py-1 text-[10px] font-mono bg-[#FAF8F5] border border-[#1C1917]/20 focus:outline-none focus:border-[#1C1917]"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          const val = (e.currentTarget.value || '').trim();
                                          if (val) {
                                            handleAddCustomPhotoTag(photo.id, val);
                                            e.currentTarget.value = '';
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Pagination & Ordering Controls */}
                          <div className="flex items-center justify-between border-t border-[#1C1917]/5 pt-2 text-[10px] font-mono text-[#78716C]">
                            <button
                              type="button"
                              disabled={realIndex === 0}
                              onClick={() => handleMovePhoto(realIndex, 'left')}
                              className="hover:text-[#1C1917] disabled:opacity-20"
                            >
                              &larr; Prev
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetCover(photo.id)}
                              className={`text-[9px] uppercase ${
                                photo.isCover
                                  ? 'text-[#A87B4F] font-bold'
                                  : 'hover:text-[#1C1917]'
                              }`}
                            >
                              {photo.isCover ? 'Cover' : 'Make Cover'}
                            </button>

                            <button
                              type="button"
                              disabled={realIndex === photos.length - 1}
                              onClick={() => handleMovePhoto(realIndex, 'right')}
                              className="hover:text-[#1C1917] disabled:opacity-20"
                            >
                              Next &rarr;
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 3D BOOK SPREADS WITH DIRECT CANVAS EDITING */}
      {activeTab === 'spreads' && (
        <div className="space-y-4">
          {spreads.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#1C1917]/10 p-8 space-y-3">
              <BookOpen className="w-8 h-8 text-[#A8A29E] mx-auto stroke-1" />
              <h3 className="font-sans text-lg text-[#1C1917]">No photos or messages to preview</h3>
              <button
                onClick={handleLoadSampleSet}
                className="px-4 py-2 text-xs font-mono uppercase bg-[#1C1917] text-white"
              >
                Load Sample Set
              </button>
            </div>
          ) : (
            <div>
              {/* Pagination Bar */}
              <div className="flex items-center justify-between bg-white border border-[#1C1917]/10 p-3 mb-3 text-xs font-mono">
                <span className="text-[#1C1917] font-semibold">
                  Spread {spreadIndex + 1} of {spreads.length} · Pages {currentSpread?.pageLeftNum} & {currentSpread?.pageRightNum}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={spreadIndex === 0}
                    onClick={() => setSpreadIndex(spreadIndex - 1)}
                    className="p-1 border border-[#1C1917]/15 hover:bg-[#FAF8F5] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 tabular-nums">{spreadIndex + 1} / {spreads.length}</span>
                  <button
                    disabled={spreadIndex === spreads.length - 1}
                    onClick={() => setSpreadIndex(spreadIndex + 1)}
                    className="p-1 border border-[#1C1917]/15 hover:bg-[#FAF8F5] disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* The Two-Page Open Book Presentation */}
              <div className="bg-[#EAE4D8] p-6 sm:p-10 border border-[#1C1917]/10 shadow-xl relative">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 bg-[#FAF8F5] shadow-lg border border-[#1C1917]/10 aspect-[16/10] relative">
                    {/* LEFT PAGE */}
                    <div className="relative p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#1C1917]/10 bg-[#FAF8F5]">
                      {currentSpread?.type === 'DEDICATION' ? (
                        <div className="h-full flex flex-col justify-between p-2">
                          <div className="space-y-3">
                            {currentSpread.left.message?.artMotif && currentSpread.left.message.artMotif !== 'NONE' && (
                              <ArtMotifGraphic motif={currentSpread.left.message.artMotif} className="w-7 h-7 text-[#A87B4F]" />
                            )}
                            <span className="text-[9px] font-mono uppercase tracking-widest text-[#A87B4F] block">
                              Inscription
                            </span>
                            <h3 className={`text-xl text-[#1C1917] font-medium leading-snug ${currentFont.cssClass}`}>
                              {currentSpread.left.message?.title || 'Dedication'}
                            </h3>
                            <p className={`text-xs sm:text-sm text-[#57534E] leading-relaxed ${currentFont.cssClass}`}>
                              "{currentSpread.left.message?.bodyText || 'Preserving the moments that bound our hearts together...'}"
                            </p>
                            {currentSpread.left.message?.authorSignature && (
                              <p className={`text-xs text-[#1C1917] font-medium ${currentFont.cssClass}`}>
                                — {currentSpread.left.message.authorSignature}
                              </p>
                            )}
                          </div>

                          {currentSpread.left.qrMedia?.enabled && (
                            <div className="pt-3 border-t border-[#1C1917]/10 flex items-center justify-between">
                              <PrintableQRBadge
                                qrMedia={currentSpread.left.qrMedia}
                                onPreviewMedia={() => onPreviewQR(currentSpread.left.qrMedia)}
                                size="sm"
                              />
                              <span className="text-[10px] font-mono text-[#78716C] text-right">Click QR to test</span>
                            </div>
                          )}

                          <div className="flex justify-between text-[10px] text-[#A8A29E] font-mono pt-2 border-t border-[#1C1917]/5">
                            <span>Dedication Page</span>
                            <span>p. {currentSpread.pageLeftNum}</span>
                          </div>
                        </div>
                      ) : currentSpread?.left ? (
                        <div className="h-full flex flex-col justify-between group">
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] border border-[#1C1917]/5">
                            {renderTransformedImage(currentSpread.left)}
                            <button
                              onClick={() => onOpenCanvasEditor(currentSpread.left)}
                              className="absolute top-2 right-2 px-2 py-1 bg-white/90 hover:bg-white text-[10px] font-mono text-[#1C1917] shadow-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            >
                              <Crop className="w-3 h-3" />
                              <span>Canvas Tool</span>
                            </button>
                          </div>
                          <div className="mt-3 flex items-end justify-between border-t border-[#1C1917]/10 pt-2 text-xs font-mono">
                            <span className="text-[#1C1917] truncate max-w-[200px]">{currentSpread.left.name}</span>
                            <span className="text-[#78716C]">p. {currentSpread.pageLeftNum}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-[#A8A29E] font-mono">
                          Endpaper
                        </div>
                      )}
                      <div className="hidden md:block absolute inset-y-0 right-0 w-8 pointer-events-none spine-shadow-right" />
                    </div>

                    {/* RIGHT PAGE */}
                    <div className="relative p-6 sm:p-8 flex flex-col justify-between bg-[#FAF8F5]">
                      {currentSpread?.right ? (
                        <div className="h-full flex flex-col justify-between group">
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] border border-[#1C1917]/5">
                            {renderTransformedImage(currentSpread.right)}
                            <button
                              onClick={() => onOpenCanvasEditor(currentSpread.right)}
                              className="absolute top-2 right-2 px-2 py-1 bg-white/90 hover:bg-white text-[10px] font-mono text-[#1C1917] shadow-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            >
                              <Crop className="w-3 h-3" />
                              <span>Canvas Tool</span>
                            </button>
                          </div>
                          <div className="mt-3 flex items-end justify-between border-t border-[#1C1917]/10 pt-2 text-xs font-mono">
                            <span className="text-[#1C1917] truncate max-w-[200px]">{currentSpread.right.name}</span>
                            <span className="text-[#78716C]">p. {currentSpread.pageRightNum}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-[#1C1917]/10 p-6 text-center text-xs font-mono text-[#78716C]">
                          Final Single Page
                        </div>
                      )}
                      <div className="hidden md:block absolute inset-y-0 left-0 w-8 pointer-events-none spine-shadow-left" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 2D PRINT PREVIEW WITH TECHNICAL MARGINS */}
      {activeTab === 'printPreview' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white border border-[#1C1917]/10 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#78716C]">Template:</span>
              <div className="flex items-center bg-[#FAF8F5] p-0.5 border border-[#1C1917]/10">
                <button
                  type="button"
                  onClick={() => setLayoutTemplate('MUSEUM_INSET')}
                  className={`px-2.5 py-1 ${layoutTemplate === 'MUSEUM_INSET' ? 'bg-[#1C1917] text-white font-semibold' : 'text-[#78716C]'}`}
                >
                  Museum Inset
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutTemplate('FULL_BLEED')}
                  className={`px-2.5 py-1 ${layoutTemplate === 'FULL_BLEED' ? 'bg-[#1C1917] text-white font-semibold' : 'text-[#78716C]'}`}
                >
                  Full Bleed
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutTemplate('EDITORIAL_SPLIT')}
                  className={`px-2.5 py-1 ${layoutTemplate === 'EDITORIAL_SPLIT' ? 'bg-[#1C1917] text-white font-semibold' : 'text-[#78716C]'}`}
                >
                  Editorial Split
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-[#1C1917]">
              <input
                type="checkbox"
                checked={showPrintGuides}
                onChange={(e) => setShowPrintGuides(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#1C1917]"
              />
              <span>Show Print Guides (Trim, 3mm Bleed, Safe Zone)</span>
            </label>

            <div className="flex items-center gap-1.5">
              <button
                disabled={spreadIndex === 0}
                onClick={() => setSpreadIndex(spreadIndex - 1)}
                className="p-1 border border-[#1C1917]/15 disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span>{spreadIndex + 1} / {spreads.length || 1}</span>
              <button
                disabled={spreadIndex === spreads.length - 1}
                onClick={() => setSpreadIndex(spreadIndex + 1)}
                className="p-1 border border-[#1C1917]/15 disabled:opacity-30"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2D Sheet Container */}
          <div className="bg-[#ECE7DE] p-6 sm:p-10 border border-[#1C1917]/10 flex flex-col items-center">
            <div
              className={`w-full max-w-5xl bg-white shadow-xl relative border ${
                showPrintGuides ? 'border-dashed border-red-400' : 'border-[#1C1917]/15'
              }`}
              style={{ aspectRatio: '1.414 / 1' }}
            >
              <div className="absolute inset-2 sm:inset-3 bg-[#FAF8F5] border border-[#1C1917]/25 grid grid-cols-2 overflow-hidden">
                {/* Center Spine Fold */}
                <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[1px] bg-black/20 z-20 pointer-events-none" />

                {/* Left Page 2D */}
                <div className="relative p-4 sm:p-6 flex flex-col justify-between h-full border-r border-[#1C1917]/10 group">
                  {showPrintGuides && (
                    <div className="absolute inset-3 border border-dashed border-blue-400/80 pointer-events-none z-10" />
                  )}

                  {currentSpread?.type === 'DEDICATION' ? (
                    <div className="h-full flex flex-col justify-between p-2 z-10">
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-[#A87B4F] uppercase">Dedication</span>
                        <h4 className="font-sans text-base text-[#1C1917] font-medium">{currentSpread.left.message?.title}</h4>
                        <p className="font-sans text-xs text-[#57534E]">"{currentSpread.left.message?.bodyText}"</p>
                      </div>
                      {currentSpread.left.qrMedia?.enabled && (
                        <PrintableQRBadge
                          qrMedia={currentSpread.left.qrMedia}
                          onPreviewMedia={() => onPreviewQR(currentSpread.left.qrMedia)}
                          size="sm"
                        />
                      )}
                      <span className="text-[9px] font-mono text-[#A8A29E]">p. {currentSpread.pageLeftNum}</span>
                    </div>
                  ) : currentSpread?.left ? (
                    <div className="h-full flex flex-col justify-between z-10">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC]">
                        {renderTransformedImage(currentSpread.left)}
                        <button
                          onClick={() => onOpenCanvasEditor(currentSpread.left)}
                          className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-white text-[9px] font-mono text-[#1C1917] opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                          Canvas
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-[#78716C] pt-2">p. {currentSpread.pageLeftNum}</span>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-[#A8A29E] font-mono">Endpaper</div>
                  )}
                </div>

                {/* Right Page 2D */}
                <div className="relative p-4 sm:p-6 flex flex-col justify-between h-full group">
                  {showPrintGuides && (
                    <div className="absolute inset-3 border border-dashed border-blue-400/80 pointer-events-none z-10" />
                  )}

                  {currentSpread?.right ? (
                    <div className="h-full flex flex-col justify-between z-10">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC]">
                        {renderTransformedImage(currentSpread.right)}
                        <button
                          onClick={() => onOpenCanvasEditor(currentSpread.right)}
                          className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-white text-[9px] font-mono text-[#1C1917] opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                          Canvas
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-[#78716C] pt-2">p. {currentSpread.pageRightNum}</span>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-[#A8A29E] font-mono">Single Page</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="border-t border-[#1C1917]/10 pt-6 mt-8 flex items-center justify-between">
        <button
          onClick={onBackToConfig}
          className="text-xs uppercase font-mono text-[#78716C] hover:text-[#1C1917] flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Configurator</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFullBookProofOpen(true)}
            disabled={photos.length === 0}
            className="px-5 py-3 text-xs uppercase font-mono tracking-wider font-medium text-[#1C1917] bg-white border border-[#1C1917]/20 hover:border-[#1C1917] hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Eye className="w-3.5 h-3.5 text-[#A87B4F]" />
            <span>Full-Book Proof</span>
          </button>

          <button
            onClick={onProceedToCheckout}
            disabled={photos.length === 0}
            className={`px-7 py-3 text-xs uppercase font-mono tracking-wider font-medium text-white transition-all ${
              photos.length > 0 ? 'bg-[#1C1917] hover:bg-[#2C2825]' : 'bg-[#A8A29E] cursor-not-allowed opacity-60'
            }`}
          >
            <span>Continue to Ethiopian Birr Checkout</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </button>
        </div>
      </div>

      {/* Batch Tag Manager Modal */}
      {isBatchModalOpen && (
        <BatchTagModal
          photos={photos}
          presetTags={PRESET_TAGS}
          allTags={allAvailableTags}
          onApplyTags={handleBatchApplyTags}
          onClose={() => setIsBatchModalOpen(false)}
        />
      )}

      {/* Auto-Layout Suggestion Engine Modal */}
      {isAutoLayoutModalOpen && (
        <AutoLayoutModal
          photos={photos}
          onApplyLayout={handleApplyAutoLayout}
          onClose={() => setIsAutoLayoutModalOpen(false)}
        />
      )}

      {/* Full-Book Proofing Modal (Horizontal Scrollable Strip) */}
      {isFullBookProofOpen && (
        <FullBookProofModal
          config={config}
          photos={photos}
          onApproveProof={() => {
            setIsFullBookProofOpen(false);
            onProceedToCheckout();
          }}
          onClose={() => setIsFullBookProofOpen(false)}
          onPreviewQR={onPreviewQR}
          onUpdateSpreadLayouts={(layouts) => onUpdateConfig({ ...config, spreadLayouts: layouts })}
        />
      )}
    </div>
  );
};
