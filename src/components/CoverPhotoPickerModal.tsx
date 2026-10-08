import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Layers,
  Square,
  Maximize2
} from 'lucide-react';
import { BookConfiguration, PhotoItem, CoverStyle } from '../types';
import {
  COVER_COLOR_OPTIONS,
  FOIL_OPTIONS,
  BOOK_FONT_OPTIONS,
  BOOK_SIZE_OPTIONS,
  getPhotoFilterCss
} from '../data/products';

interface CoverPhotoPickerModalProps {
  config: BookConfiguration;
  photos: PhotoItem[];
  onSave: (updatedConfig: Partial<BookConfiguration>, updatedPhotos: PhotoItem[]) => void;
  onClose: () => void;
}

export const CoverPhotoPickerModal: React.FC<CoverPhotoPickerModalProps> = ({
  config,
  photos,
  onSave,
  onClose
}) => {
  // Current or default cover photo ID
  const initialCoverPhotoId =
    config.coverPhotoId ||
    photos.find((p) => p.isCover)?.id ||
    (photos.length > 0 ? photos[0].id : undefined);

  const [selectedPhotoId, setSelectedPhotoId] = useState<string | undefined>(initialCoverPhotoId);
  const [selectedStyle, setSelectedStyle] = useState<CoverStyle>(config.coverStyle || 'CAMEO_INSET');

  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);

  const currentColor = COVER_COLOR_OPTIONS.find((c) => c.id === config.coverColor) || COVER_COLOR_OPTIONS[0];
  const currentFoil = FOIL_OPTIONS.find((f) => f.id === config.foilType) || FOIL_OPTIONS[0];
  const currentFontStyle = config.fontStyle || 'MODERN';
  const currentFont = BOOK_FONT_OPTIONS[currentFontStyle];
  const currentSize = BOOK_SIZE_OPTIONS[config.size];

  const handleApply = () => {
    // Update photos isCover flag
    const updatedPhotos = photos.map((p) => ({
      ...p,
      isCover: p.id === selectedPhotoId
    }));

    onSave(
      {
        coverPhotoId: selectedPhotoId,
        coverStyle: selectedStyle
      },
      updatedPhotos
    );
    onClose();
  };

  const handleClearCoverPhoto = () => {
    setSelectedPhotoId(undefined);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF8F5] text-[#1C1917] max-w-4xl w-full rounded-xs shadow-2xl border border-[#1C1917]/15 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1C1917]/10 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Front Cover Architecture</span>
              </span>
              <span className="px-2 py-0.5 bg-[#1C1917]/5 text-[#1C1917] text-[10px] font-mono rounded-xs">
                {currentSize.name}
              </span>
            </div>
            <h2 className="text-lg font-medium text-[#1C1917] mt-0.5">
              Customize Cover Photo & Presentation Style
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#1C1917]/5 rounded-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Preview Area (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="text-xs font-mono font-semibold uppercase text-[#78716C] tracking-wider">
              Live Front Cover Simulation
            </span>

            {/* Book Front Cover Preview Card */}
            <div
              className="relative aspect-[3/4] w-full rounded-xs shadow-xl border border-black/15 overflow-hidden flex flex-col justify-between p-6 transition-all"
              style={{
                backgroundColor: currentColor.hex
              }}
            >
              {/* Spine edge indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

              {/* Top Cover Foil / Category */}
              <div className="relative z-10 text-center">
                <span
                  className="text-[9px] font-mono uppercase tracking-widest block font-medium"
                  style={{ color: selectedStyle === 'FULL_WRAP' && selectedPhoto ? '#FFFFFFE6' : currentFoil.previewColor }}
                >
                  {selectedStyle === 'CAMEO_INSET' ? 'Atelier Cameo Inset' : selectedPhoto ? 'Full-Bleed Photo Wrap' : 'Archival Cloth Monograph'}
                </span>
              </div>

              {/* Center Presentation: Cameo Inset vs Full Bleed vs Cloth */}
              {selectedStyle === 'FULL_WRAP' && selectedPhoto ? (
                <>
                  <img
                    src={selectedPhoto.url}
                    alt="Cover wrap"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    style={{ filter: getPhotoFilterCss(selectedPhoto.transform?.filter, selectedPhoto.transform?.filterIntensity) }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />
                </>
              ) : selectedStyle === 'CAMEO_INSET' && selectedPhoto ? (
                <div className="relative z-10 my-auto flex flex-col items-center">
                  <div className="w-44 h-32 relative rounded-xs shadow-2xl border-2 border-black/25 ring-2 ring-white/20 overflow-hidden bg-black/10">
                    <img
                      src={selectedPhoto.url}
                      alt="Cameo Inset"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      style={{ filter: getPhotoFilterCss(selectedPhoto.transform?.filter, selectedPhoto.transform?.filterIntensity) }}
                    />
                    <div className="absolute inset-0 shadow-inner pointer-events-none" />
                  </div>
                  <span className="text-[9px] font-mono text-black/50 mt-1 uppercase tracking-wider">
                    Beveled Aperture Window
                  </span>
                </div>
              ) : (
                <div className="relative z-10 my-auto text-center p-4 border border-dashed border-black/15 rounded-xs bg-black/5">
                  <BookOpen className="w-8 h-8 mx-auto text-black/30 mb-2" />
                  <span className="text-xs font-mono text-black/60 block">
                    No photo assigned to cover
                  </span>
                  <span className="text-[10px] font-mono text-black/40 block mt-1">
                    Select a photo from the gallery below
                  </span>
                </div>
              )}

              {/* Bottom Cover Title & Subtitle */}
              <div className="relative z-10 text-center pb-2">
                <h3
                  className={`text-xl font-bold leading-tight ${currentFont.cssClass}`}
                  style={{
                    color: selectedStyle === 'FULL_WRAP' && selectedPhoto ? '#FFFFFF' : currentFoil.previewColor,
                    textShadow: selectedStyle === 'FULL_WRAP' && selectedPhoto ? '0 2px 8px rgba(0,0,0,0.85)' : 'none'
                  }}
                >
                  {config.title || 'OUR MEMORY CHRONICLE'}
                </h3>
                {config.subtitle && (
                  <p
                    className={`text-xs mt-1 font-light ${currentFont.cssClass}`}
                    style={{
                      color: selectedStyle === 'FULL_WRAP' && selectedPhoto ? '#FFFFFFCC' : currentFoil.previewColor
                    }}
                  >
                    {config.subtitle}
                  </p>
                )}
                <div
                  className="mt-2 text-[9px] font-mono uppercase tracking-widest"
                  style={{
                    color: selectedStyle === 'FULL_WRAP' && selectedPhoto ? '#FFFFFF99' : `${currentFoil.previewColor}99`
                  }}
                >
                  Yoki Gifts · {config.pageCount} Pages
                </div>
              </div>
            </div>
          </div>

          {/* Right Area: Style Select & Photo Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* 1. Cover Style Selector */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold uppercase text-[#1C1917] tracking-wider block">
                Cover Photo Display Style
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Cameo Inset Option */}
                <button
                  type="button"
                  onClick={() => setSelectedStyle('CAMEO_INSET')}
                  className={`p-3.5 border rounded-xs text-left transition-all flex flex-col gap-1.5 ${
                    selectedStyle === 'CAMEO_INSET'
                      ? 'border-[#1C1917] bg-white ring-1 ring-[#1C1917] shadow-xs'
                      : 'border-[#1C1917]/15 bg-white/60 hover:bg-white hover:border-[#1C1917]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#1C1917]">
                      Cameo Inset Window
                    </span>
                    {selectedStyle === 'CAMEO_INSET' && (
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-[#78716C] leading-snug">
                    Debossed aperture window framed in archival cloth with hot-foil stamped typography.
                  </p>
                </button>

                {/* Full Bleed Option */}
                <button
                  type="button"
                  onClick={() => setSelectedStyle('FULL_WRAP')}
                  className={`p-3.5 border rounded-xs text-left transition-all flex flex-col gap-1.5 ${
                    selectedStyle === 'FULL_WRAP'
                      ? 'border-[#1C1917] bg-white ring-1 ring-[#1C1917] shadow-xs'
                      : 'border-[#1C1917]/15 bg-white/60 hover:bg-white hover:border-[#1C1917]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#1C1917]">
                      Full-Bleed Photo Wrap
                    </span>
                    {selectedStyle === 'FULL_WRAP' && (
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-[#78716C] leading-snug">
                    Edge-to-edge wraparound print for maximum cinematic visual punch.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Photo Selection Grid */}
            <div className="space-y-2 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase text-[#1C1917] tracking-wider block">
                  Select Front Cover Photo ({photos.length} uploaded)
                </span>
                {selectedPhotoId && (
                  <button
                    type="button"
                    onClick={handleClearCoverPhoto}
                    className="text-[11px] font-mono text-[#78716C] hover:text-[#1C1917] underline"
                  >
                    Clear Photo (Pure Cloth Cover)
                  </button>
                )}
              </div>

              {photos.length === 0 ? (
                <div className="p-8 border border-dashed border-[#1C1917]/20 rounded-xs text-center font-mono text-xs text-[#78716C]">
                  No photos uploaded yet. Upload photos first in the Book Studio to set a cover photo.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[280px] overflow-y-auto p-1 border border-[#1C1917]/10 rounded-xs bg-white/50">
                  {photos.map((p, idx) => {
                    const isSelected = p.id === selectedPhotoId;

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPhotoId(p.id)}
                        className={`group relative aspect-square rounded-xs overflow-hidden cursor-pointer border-2 transition-all ${
                          isSelected
                            ? 'border-[#1C1917] ring-2 ring-[#D4AF37] shadow-md scale-98'
                            : 'border-transparent hover:border-[#1C1917]/40 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          style={{ filter: getPhotoFilterCss(p.transform?.filter, p.transform?.filterIntensity) }}
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#1C1917] text-[#D4AF37] p-1 rounded-xs shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 truncate">
                          #{idx + 1} {p.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Note on Craftsmanship */}
            <div className="p-3 bg-white border border-[#1C1917]/10 rounded-xs flex items-center gap-3 text-xs font-mono text-[#78716C]">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                Both Cameo and Full-Bleed styles use archival non-fading pigments and heavy-duty Dutch binder's board.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-[#1C1917]/10 flex items-center justify-between bg-white shrink-0">
          <div className="text-xs font-mono text-[#78716C]">
            {selectedPhoto ? (
              <span>
                Cover: <strong>{selectedPhoto.name}</strong> ({selectedStyle === 'CAMEO_INSET' ? 'Cameo' : 'Full Wrap'})
              </span>
            ) : (
              <span>Pure Cloth Debossed (No Photo)</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-[#78716C] hover:text-[#1C1917]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#2C2825] transition-colors shadow-sm font-semibold rounded-xs"
            >
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>Apply Cover Style</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
