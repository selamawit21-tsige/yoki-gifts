import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Type,
  Grid,
  Check,
  Undo2,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  Palette,
  Maximize2
} from 'lucide-react';
import { PhotoItem, BookConfiguration, PhotoTransform, BookFontStyle } from '../types';
import { ATELIER_12_COLORS, BOOK_FONT_OPTIONS, AtelierColorSwatch, getPhotoFilterCss } from '../data/products';

interface PagePhotoTextEditorModalProps {
  photo: PhotoItem;
  config: BookConfiguration;
  onSave: (updatedPhoto: PhotoItem) => void;
  onClose: () => void;
}

export const PagePhotoTextEditorModal: React.FC<PagePhotoTextEditorModalProps> = ({
  photo,
  config,
  onSave,
  onClose
}) => {
  const currentFontStyle: BookFontStyle = config.fontStyle || 'MODERN';
  const currentFont = BOOK_FONT_OPTIONS[currentFontStyle];

  // Text content & styling state
  const initialTransform = photo.transform || {};
  const [text, setText] = useState<string>(initialTransform.textOverlay || '');
  
  // Position in percent (0 to 100)
  const [posX, setPosX] = useState<number>(() => {
    if (typeof initialTransform.textPositionX === 'number') return initialTransform.textPositionX;
    return 50; // Default center
  });

  const [posY, setPosY] = useState<number>(() => {
    if (typeof initialTransform.textPositionY === 'number') return initialTransform.textPositionY;
    if (initialTransform.textPosition === 'TOP') return 15;
    if (initialTransform.textPosition === 'BOTTOM') return 85;
    return 50; // Default center
  });

  // Selected 12-color hex for text
  const [textColorHex, setTextColorHex] = useState<string>(
    initialTransform.textColorHex || (initialTransform.textColor === 'DARK' ? '#1C1917' : '#FFFFFF')
  );

  // Background chip styling
  const [showBg, setShowBg] = useState<boolean>(initialTransform.showTextBg ?? false);
  const [textBgHex, setTextBgHex] = useState<string>(
    initialTransform.textBgColorHex || '#1C1917'
  );

  // Font size
  const [fontSize, setFontSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>(
    initialTransform.textFontSize || 'md'
  );

  // 3x3 alignment grid guidelines toggle
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Dragging interaction state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    setIsDragging(true);
    updatePositionFromPointer(e.clientX, e.clientY);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    updatePositionFromPointer(e.clientX, e.clientY);
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const updatePositionFromPointer = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPosX(Math.max(5, Math.min(95, Math.round(x))));
    setPosY(Math.max(5, Math.min(95, Math.round(y))));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Quick preset handlers
  const handlePreset = (type: 'CENTER' | 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT') => {
    switch (type) {
      case 'CENTER':
        setPosX(50);
        setPosY(50);
        break;
      case 'TOP':
        setPosX(50);
        setPosY(15);
        break;
      case 'BOTTOM':
        setPosX(50);
        setPosY(85);
        break;
      case 'LEFT':
        setPosX(25);
        setPosY(50);
        break;
      case 'RIGHT':
        setPosX(75);
        setPosY(50);
        break;
    }
  };

  const handleReset = () => {
    setText('');
    setPosX(50);
    setPosY(50);
    setTextColorHex('#FFFFFF');
    setShowBg(false);
    setTextBgHex('#1C1917');
    setFontSize('md');
    setShowGrid(true);
  };

  const handleSave = () => {
    const resolvedPosition: 'TOP' | 'CENTER' | 'BOTTOM' =
      posY < 35 ? 'TOP' : posY > 65 ? 'BOTTOM' : 'CENTER';

    const updatedTransform: PhotoTransform = {
      ...(photo.transform || {}),
      textOverlay: text.trim() || undefined,
      textPosition: resolvedPosition,
      textPositionX: posX,
      textPositionY: posY,
      textColorHex,
      textColor: textColorHex === '#FFFFFF' || textColorHex === '#F5EFEB' || textColorHex === '#C0C0C0' ? 'WHITE' : 'DARK',
      showTextBg: showBg,
      textBgColorHex: showBg ? textBgHex : undefined,
      textFontSize: fontSize
    };

    onSave({
      ...photo,
      transform: updatedTransform
    });
    onClose();
  };

  const fontSizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl font-semibold'
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 bg-[#121110]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-5xl w-full p-4 sm:p-7 shadow-2xl relative my-auto rounded-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1C1917] text-white flex items-center justify-center">
              <Type className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A87B4F] font-semibold">
                  Page Photo Text & Grid Studio
                </span>
                <span className="px-2 py-0.5 bg-[#1C1917]/5 text-[#1C1917] text-[10px] font-mono rounded-xs">
                  {currentFont.name} Typography
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-[#1C1917]">
                Add Text & Alignment Grid to Photo
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Workspace: Canvas Left + Control Sidebar Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 items-start">
          {/* LEFT: Interactive Photo Canvas with Drag & Grid Guidelines */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Viewport Top Bar */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-[#78716C] mb-2 px-1">
              <span className="truncate max-w-[200px]">{photo.name}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-mono transition-colors rounded-xs ${
                    showGrid
                      ? 'bg-[#1C1917] text-[#D4AF37] border-[#1C1917]'
                      : 'bg-white text-[#78716C] border-[#1C1917]/20 hover:text-[#1C1917]'
                  }`}
                  title="Toggle 3×3 Rule-of-Thirds Alignment Grid"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>{showGrid ? 'Grid: ON' : 'Grid: OFF'}</span>
                </button>
              </div>
            </div>

            {/* The Visual Photo Canvas Box */}
            <div
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="relative w-full aspect-[4/3] bg-black/90 overflow-hidden shadow-xl border border-black/20 select-none cursor-crosshair group rounded-xs"
            >
              {/* Photo Image Background */}
              <img
                src={photo.url}
                alt={photo.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover pointer-events-none"
                style={{ filter: getPhotoFilterCss(photo.transform?.filter, photo.transform?.filterIntensity) }}
              />

              {/* 3×3 Alignment Grid Guidelines */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  {/* Vertical rule lines */}
                  <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-white/35 shadow-[0_0_1px_rgba(0,0,0,0.8)]" />
                  <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-white/35 shadow-[0_0_1px_rgba(0,0,0,0.8)]" />
                  {/* Horizontal rule lines */}
                  <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-white/35 shadow-[0_0_1px_rgba(0,0,0,0.8)]" />
                  <div className="absolute left-0 right-0 top-2/3 h-[1px] bg-white/35 shadow-[0_0_1px_rgba(0,0,0,0.8)]" />
                  {/* Center Bullseye target */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-[#D4AF37] rounded-full pointer-events-none flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
                  </div>
                </div>
              )}

              {/* Interactive In-Photo Draggable Text */}
              {text.trim() ? (
                <div
                  className="absolute pointer-events-auto z-20 cursor-move transition-all duration-75 select-none"
                  style={{
                    left: `${posX}%`,
                    top: `${posY}%`,
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '85%'
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                >
                  <div
                    className={`px-3.5 py-1.5 transition-all text-center rounded-xs shadow-md border ${
                      showBg
                        ? 'border-white/20'
                        : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor: showBg ? `${textBgHex}CC` : 'transparent',
                      backdropFilter: showBg ? 'blur(4px)' : 'none'
                    }}
                  >
                    <p
                      className={`${currentFont.cssClass} ${fontSizeClass} tracking-wide font-medium leading-tight whitespace-normal break-words`}
                      style={{
                        color: textColorHex,
                        textShadow: showBg
                          ? 'none'
                          : textColorHex === '#FFFFFF'
                          ? '0 2px 4px rgba(0,0,0,0.85), 0 0 10px rgba(0,0,0,0.5)'
                          : '0 2px 4px rgba(255,255,255,0.85)'
                      }}
                    >
                      {text}
                    </p>
                  </div>
                </div>
              ) : (
                /* Empty state prompt on canvas */
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="bg-black/60 backdrop-blur-xs px-4 py-2 border border-white/20 text-white text-xs font-mono text-center max-w-xs rounded-xs">
                    Type text below or click anywhere to position
                  </div>
                </div>
              )}
            </div>

            {/* Position Coordinate Bar */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#78716C] mt-2 px-1">
              <span>Position: X={posX}%, Y={posY}%</span>
              <span className="text-[#A87B4F]">Drag on photo or use presets below</span>
            </div>

            {/* Quick Alignment Presets */}
            <div className="w-full mt-3 p-3 bg-white border border-[#1C1917]/10 flex flex-wrap items-center justify-between gap-2 rounded-xs">
              <span className="text-xs font-mono font-semibold text-[#1C1917]">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePreset('CENTER')}
                  className={`px-3 py-1 text-xs font-mono border rounded-xs transition-colors ${
                    posX === 50 && posY === 50
                      ? 'bg-[#1C1917] text-[#D4AF37] border-[#1C1917] font-bold'
                      : 'bg-[#FAF8F5] text-[#1C1917] border-[#1C1917]/20 hover:border-[#1C1917]'
                  }`}
                >
                  ★ In Middle of Photo
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('TOP')}
                  className={`px-2.5 py-1 text-xs font-mono border rounded-xs transition-colors ${
                    posY === 15 ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-[#FAF8F5] text-[#1C1917] border-[#1C1917]/20'
                  }`}
                >
                  Top Header
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('BOTTOM')}
                  className={`px-2.5 py-1 text-xs font-mono border rounded-xs transition-colors ${
                    posY === 85 ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-[#FAF8F5] text-[#1C1917] border-[#1C1917]/20'
                  }`}
                >
                  Bottom Caption
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('LEFT')}
                  className="px-2 py-1 text-xs font-mono border bg-[#FAF8F5] text-[#1C1917] border-[#1C1917]/20"
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('RIGHT')}
                  className="px-2 py-1 text-xs font-mono border bg-[#FAF8F5] text-[#1C1917] border-[#1C1917]/20"
                >
                  Right
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Tool Controls (Text Input, 12-Color Palette, Font Size, Background Pill) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Text Content Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold text-[#1C1917] flex items-center justify-between">
                <span>Text on Photo:</span>
                <span className="text-[10px] text-[#78716C] font-normal">{text.length}/60 chars</span>
              </label>
              <input
                type="text"
                maxLength={60}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Addis Ababa · Morning Sun"
                className="w-full px-3.5 py-2.5 bg-white border border-[#1C1917]/25 text-sm font-sans focus:outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] rounded-xs"
                autoFocus
              />
            </div>

            {/* 2. Curated 12-Color Swatch Palette for Text Color */}
            <div className="space-y-2 border-t border-[#1C1917]/10 pt-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#1C1917] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#A87B4F]" />
                  <span>Text Color (12 Swatches)</span>
                </span>
                <span className="text-[11px] text-[#A87B4F] font-semibold">
                  {ATELIER_12_COLORS.find(c => c.hex.toLowerCase() === textColorHex.toLowerCase())?.name || textColorHex}
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {ATELIER_12_COLORS.map((c) => {
                  const isSelected = textColorHex.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={`text-${c.id}`}
                      type="button"
                      onClick={() => setTextColorHex(c.hex)}
                      className={`h-8 rounded-xs border transition-all relative flex items-center justify-center ${
                        isSelected
                          ? 'border-[#1C1917] ring-2 ring-[#D4AF37] scale-105 shadow-md'
                          : 'border-black/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.hex}) · ${c.description}`}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            c.isLight ? 'text-black' : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Text Background Badge / Backdrop Chip */}
            <div className="space-y-2 border-t border-[#1C1917]/10 pt-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#1C1917]">Contrast Background Chip:</span>
                <button
                  type="button"
                  onClick={() => setShowBg(!showBg)}
                  className={`px-2.5 py-0.5 text-[11px] border rounded-xs transition-colors ${
                    showBg
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white text-[#78716C] border-[#1C1917]/20 hover:text-[#1C1917]'
                  }`}
                >
                  {showBg ? 'Enabled' : 'Transparent (None)'}
                </button>
              </div>

              {showBg && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-mono text-[#78716C]">
                    Chip Color: {ATELIER_12_COLORS.find(c => c.hex.toLowerCase() === textBgHex.toLowerCase())?.name}
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {ATELIER_12_COLORS.map((c) => {
                      const isSelected = textBgHex.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={`bg-${c.id}`}
                          type="button"
                          onClick={() => setTextBgHex(c.hex)}
                          className={`h-7 rounded-xs border transition-all relative flex items-center justify-center ${
                            isSelected
                              ? 'border-[#1C1917] ring-2 ring-[#1C1917] scale-105 shadow-sm'
                              : 'border-black/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {isSelected && (
                            <Check
                              className={`w-3 h-3 ${c.isLight ? 'text-black' : 'text-white'}`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Text Size & Scale */}
            <div className="space-y-2 border-t border-[#1C1917]/10 pt-4">
              <span className="text-xs font-mono font-semibold text-[#1C1917] block">
                Text Scale
              </span>
              <div className="grid grid-cols-5 gap-1.5 text-xs font-mono">
                {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    className={`py-1.5 text-center border uppercase rounded-xs transition-colors ${
                      fontSize === sz
                        ? 'bg-[#1C1917] text-white font-bold border-[#1C1917]'
                        : 'bg-white text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Precise Coordinate Sliders */}
            <div className="space-y-3 border-t border-[#1C1917]/10 pt-4">
              <span className="text-xs font-mono font-semibold text-[#1C1917] block">
                Precise Position Sliders
              </span>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-[#78716C]">
                  <span>Horizontal (X):</span>
                  <span>{posX}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={posX}
                  onChange={(e) => setPosX(parseInt(e.target.value))}
                  className="w-full accent-[#1C1917]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-[#78716C]">
                  <span>Vertical (Y):</span>
                  <span>{posY}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={posY}
                  onChange={(e) => setPosY(parseInt(e.target.value))}
                  className="w-full accent-[#1C1917]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-[#1C1917]/10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-mono text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Reset Text & Position</span>
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
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#2C2825] transition-colors shadow-sm font-semibold rounded-xs"
            >
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>Apply to Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
