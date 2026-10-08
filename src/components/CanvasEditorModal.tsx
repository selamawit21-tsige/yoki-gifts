import React, { useState } from 'react';
import {
  X,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Type,
  Sliders,
  Sparkles,
  Check,
  Undo2,
  Maximize2,
  Crop,
  Layers,
  Palette,
  SunMedium
} from 'lucide-react';
import { PhotoItem, PhotoTransform, PhotoFilterType } from '../types';
import { ATELIER_12_COLORS, PHOTO_FILTER_OPTIONS, getPhotoFilterCss } from '../data/products';

interface CanvasEditorModalProps {
  photo: PhotoItem;
  onSave: (updatedPhoto: PhotoItem) => void;
  onClose: () => void;
}

export const CanvasEditorModal: React.FC<CanvasEditorModalProps> = ({
  photo,
  onSave,
  onClose
}) => {
  const [zoom, setZoom] = useState<number>(photo.transform?.zoom ?? 1);
  const [rotation, setRotation] = useState<number>(photo.transform?.rotate ?? 0);
  const [filter, setFilter] = useState<PhotoFilterType>(
    photo.transform?.filter ?? 'NONE'
  );
  const [filterIntensity, setFilterIntensity] = useState<number>(
    photo.transform?.filterIntensity ?? 100
  );
  const [textOverlay, setTextOverlay] = useState<string>(photo.transform?.textOverlay ?? '');
  const [textColor, setTextColor] = useState<'WHITE' | 'DARK'>(photo.transform?.textColor ?? 'WHITE');
  const [textColorHex, setTextColorHex] = useState<string>(
    photo.transform?.textColorHex ?? (photo.transform?.textColor === 'DARK' ? '#1C1917' : '#FFFFFF')
  );
  const [textPosition, setTextPosition] = useState<'TOP' | 'CENTER' | 'BOTTOM'>(
    photo.transform?.textPosition ?? 'BOTTOM'
  );
  const [aspect, setAspect] = useState<'4/3' | '1/1' | '3/4' | '16/9'>('4/3');

  const getFilterStyle = () => {
    return getPhotoFilterCss(filter, filterIntensity);
  };

  const handleRotateCW = () => setRotation((prev) => (prev + 90) % 360);
  const handleRotateCCW = () => setRotation((prev) => (prev - 90 + 360) % 360);

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFilter('NONE');
    setFilterIntensity(100);
    setTextOverlay('');
    setTextColor('WHITE');
    setTextColorHex('#FFFFFF');
    setTextPosition('BOTTOM');
    setAspect('4/3');
  };

  const handleSave = () => {
    const updated: PhotoItem = {
      ...photo,
      transform: {
        ...(photo.transform || {}),
        zoom,
        rotate: rotation,
        filter,
        filterIntensity,
        textOverlay: textOverlay.trim() || undefined,
        textColor,
        textColorHex,
        textPosition
      }
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A87B4F] block">
              Interactive Canvas Studio
            </span>
            <h3 className="text-xl sm:text-2xl font-sans font-medium text-[#1C1917]">
              Photo Canvas Editor
            </h3>
            <span className="text-xs text-[#78716C] font-mono">{photo.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace: Left Canvas Preview, Right Tool Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 items-center">
          {/* Left: The Visual Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="bg-[#EFECE6] p-6 border border-[#1C1917]/15 shadow-inner w-full flex items-center justify-center relative min-h-[380px]">
              {/* Canvas viewport container with chosen aspect ratio */}
              <div
                className="relative overflow-hidden bg-black shadow-xl border border-black/20 flex items-center justify-center transition-all duration-300 w-full max-w-md"
                style={{
                  aspectRatio: aspect === '4/3' ? '4/3' : aspect === '1/1' ? '1/1' : aspect === '3/4' ? '3/4' : '16/9'
                }}
              >
                {/* Transformed Image Element */}
                <div
                  className="w-full h-full flex items-center justify-center transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    filter: getFilterStyle()
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
                {textOverlay && (
                  <div
                    className={`absolute inset-x-4 pointer-events-none z-20 text-center px-3 py-1.5 transition-all ${
                      textPosition === 'TOP'
                        ? 'top-4'
                        : textPosition === 'CENTER'
                        ? 'top-1/2 -translate-y-1/2'
                        : 'bottom-4'
                    }`}
                  >
                    <p
                      className={`font-sans tracking-wide text-xs sm:text-sm font-medium ${
                        textColor === 'WHITE'
                          ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                          : 'text-[#1C1917] drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]'
                      }`}
                    >
                      {textOverlay}
                    </p>
                  </div>
                )}

                {/* Canvas grid alignment guide hairline */}
                <div className="absolute inset-0 border border-white/10 pointer-events-none" />
              </div>
            </div>

            {/* Canvas specs under viewport */}
            <div className="flex items-center justify-between w-full text-[11px] font-mono text-[#78716C] pt-2 px-1">
              <span>
                Zoom: {zoom.toFixed(1)}x · Rot: {rotation}° · Filter:{' '}
                <strong className="text-[#1C1917]">
                  {PHOTO_FILTER_OPTIONS.find((f) => f.id === filter)?.name || 'Natural'}
                </strong>
                {filter !== 'NONE' && ` (${filterIntensity}%)`}
              </span>
              <span>Aspect: {aspect}</span>
            </div>
          </div>

          {/* Right: Interactive Canvas Tool Controls */}
          <div className="lg:col-span-5 space-y-6 max-h-[580px] overflow-y-auto pr-1">
            {/* 1. Zoom Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#1C1917] font-semibold flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#A87B4F]" />
                  <span>Scale & Zoom</span>
                </span>
                <span className="tabular-nums text-[#78716C]">{zoom.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#1C1917] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#A8A29E]">
                <span>0.8x Wide</span>
                <span>1.0x Normal</span>
                <span>2.5x Macro</span>
              </div>
            </div>

            {/* 2. Rotation & Orientation */}
            <div className="space-y-2 border-t border-[#1C1917]/10 pt-4">
              <span className="text-xs font-mono font-semibold text-[#1C1917] block">
                Orientation & Frame Rotation
              </span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={handleRotateCCW}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-[#1C1917]/15 hover:border-[#1C1917] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>-90°</span>
                </button>
                <button
                  type="button"
                  onClick={handleRotateCW}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-[#1C1917]/15 hover:border-[#1C1917] transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>+90°</span>
                </button>
              </div>
            </div>

            {/* 3. Archival Photo Filters (8 Styles + Live Thumbnails + Intensity Slider) */}
            <div className="space-y-3 border-t border-[#1C1917]/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[#1C1917] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#A87B4F]" />
                  <span>Archival Photo Filters</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1C1917]/5 text-[#A87B4F] rounded-xs font-semibold">
                  {PHOTO_FILTER_OPTIONS.find((f) => f.id === filter)?.name}
                  {filter !== 'NONE' && ` · ${filterIntensity}%`}
                </span>
              </div>

              {/* Filter Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PHOTO_FILTER_OPTIONS.map((opt) => {
                  const isSelected = filter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFilter(opt.id)}
                      className={`group relative p-1.5 text-left border rounded-xs transition-all flex flex-col gap-1.5 ${
                        isSelected
                          ? 'border-[#1C1917] bg-white ring-1 ring-[#D4AF37] shadow-xs'
                          : 'border-[#1C1917]/15 bg-white/70 hover:bg-white hover:border-[#1C1917]/40'
                      }`}
                    >
                      {/* Live Thumbnail Preview with CSS Filter Applied */}
                      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200 relative rounded-2xs border border-black/10">
                        <img
                          src={photo.url}
                          alt={opt.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-200 group-hover:scale-105"
                          style={{ filter: opt.previewCss }}
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#1C1917] text-[#D4AF37] p-0.5 rounded-2xs shadow-xs">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      {/* Filter Titles */}
                      <div className="leading-tight">
                        <span className="text-[11px] font-mono font-semibold text-[#1C1917] block truncate">
                          {opt.name}
                        </span>
                        <span className="text-[9px] font-mono text-[#78716C] block truncate">
                          {opt.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Filter Intensity Slider (visible when any stylized filter is active) */}
              {filter !== 'NONE' && (
                <div className="p-2.5 bg-white border border-[#1C1917]/15 rounded-xs space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#1C1917] flex items-center gap-1 font-medium">
                      <SunMedium className="w-3 h-3 text-[#A87B4F]" />
                      <span>Filter Strength:</span>
                    </span>
                    <span className="text-[#A87B4F] font-bold">{filterIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={filterIntensity}
                    onChange={(e) => setFilterIntensity(parseInt(e.target.value))}
                    className="w-full accent-[#1C1917] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#A8A29E] pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFilterIntensity(50)}
                      className="hover:text-[#1C1917] underline"
                    >
                      50% Subtle
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterIntensity(100)}
                      className="hover:text-[#1C1917] underline"
                    >
                      100% Full
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilter('NONE')}
                      className="hover:text-[#1C1917] underline text-red-700/80"
                    >
                      Remove Filter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. In-Image Text Overlay */}
            <div className="space-y-2 border-t border-[#1C1917]/10 pt-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#1C1917] font-semibold flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#A87B4F]" />
                  <span>Canvas Caption / Date Stamp</span>
                </span>
              </div>

              <input
                type="text"
                maxLength={45}
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                placeholder="e.g. Addis Ababa · November 2025"
                className="w-full px-3 py-2 bg-white border border-[#1C1917]/20 text-xs font-sans focus:outline-none focus:border-[#1C1917]"
              />

              {textOverlay && (
                <div className="space-y-2 pt-1 text-[11px] font-mono">
                  {/* Position */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#78716C]">Placement:</span>
                    <select
                      value={textPosition}
                      onChange={(e) => setTextPosition(e.target.value as any)}
                      className="p-1.5 bg-white border border-[#1C1917]/15 text-xs focus:outline-none flex-1"
                    >
                      <option value="CENTER">Middle of Photo (Center)</option>
                      <option value="BOTTOM">Bottom Caption</option>
                      <option value="TOP">Top Header</option>
                    </select>
                  </div>

                  {/* 12-Color Swatch Palette */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-[10px] text-[#78716C]">
                      <span>12-Color Swatches:</span>
                      <span className="text-[#A87B4F] font-semibold">{ATELIER_12_COLORS.find(c => c.hex.toLowerCase() === textColorHex.toLowerCase())?.name || textColorHex}</span>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {ATELIER_12_COLORS.map((c) => {
                        const isSelected = textColorHex.toLowerCase() === c.hex.toLowerCase();
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setTextColorHex(c.hex);
                              setTextColor(c.isLight ? 'WHITE' : 'DARK');
                            }}
                            className={`h-6 rounded-xs border transition-all flex items-center justify-center ${
                              isSelected ? 'border-[#1C1917] ring-1 ring-[#D4AF37] scale-105' : 'border-black/20'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          >
                            {isSelected && (
                              <Check className={`w-3 h-3 ${c.isLight ? 'text-black' : 'text-white'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Frame Aspect Crop Ratio */}
            <div className="space-y-2 border-t border-[#1C1917]/10 pt-4">
              <span className="text-xs font-mono font-semibold text-[#1C1917] block">
                Frame Geometry
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {[
                  { id: '4/3', label: '4:3' },
                  { id: '1/1', label: '1:1' },
                  { id: '3/4', label: '3:4' },
                  { id: '16/9', label: '16:9' }
                ].map((asp) => (
                  <button
                    key={asp.id}
                    type="button"
                    onClick={() => setAspect(asp.id as any)}
                    className={`py-1.5 text-center border transition-colors ${
                      aspect === asp.id
                        ? 'bg-[#1C1917] text-white font-semibold'
                        : 'bg-white text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]'
                    }`}
                  >
                    {asp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#1C1917]/10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-mono text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Reset Adjustments</span>
          </button>

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
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#2C2825] transition-colors shadow-sm font-medium"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to Book Canvas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
