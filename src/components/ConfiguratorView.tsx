import React from 'react';
import { Check, ArrowRight, ArrowLeft, Sparkles, Book, Info, Gift, Layers, Ruler, Image as ImageIcon } from 'lucide-react';
import {
  BookConfiguration,
  BookSize,
  PaperFinish,
  CoverColor,
  FoilType,
  BookCategory,
  BookFontStyle,
  PhotoItem,
  CoverStyle
} from '../types';
import {
  BOOK_SIZE_OPTIONS,
  PAPER_FINISH_OPTIONS,
  PAGE_COUNT_OPTIONS,
  COVER_COLOR_OPTIONS,
  FOIL_OPTIONS,
  BOOK_FONT_OPTIONS,
  getPhotoFilterCss
} from '../data/products';
import { CATEGORIES_DATA } from '../data/categories';
import { PaperTexturePreview } from './PaperTexturePreview';

interface ConfiguratorViewProps {
  config: BookConfiguration;
  photos?: PhotoItem[];
  onChangeConfig: (newConfig: BookConfiguration) => void;
  onProceedToUpload: () => void;
  onBackToLanding: () => void;
}

export const ConfiguratorView: React.FC<ConfiguratorViewProps> = ({
  config,
  photos = [],
  onChangeConfig,
  onProceedToUpload,
  onBackToLanding
}) => {
  const currentSizeInfo = BOOK_SIZE_OPTIONS[config.size];
  const currentPaperInfo = PAPER_FINISH_OPTIONS[config.paperFinish];
  const currentPageOption = PAGE_COUNT_OPTIONS.find(p => p.pages === config.pageCount) || PAGE_COUNT_OPTIONS[0];
  const currentColor = COVER_COLOR_OPTIONS.find(c => c.id === config.coverColor) || COVER_COLOR_OPTIONS[0];
  const currentFoil = FOIL_OPTIONS.find(f => f.id === config.foilType) || FOIL_OPTIONS[0];
  const currentFontStyle = config.fontStyle || 'MODERN';
  const currentFontInfo = BOOK_FONT_OPTIONS[currentFontStyle];

  // Resolve active cover photo and style
  const coverPhoto = photos.find((p) => p.id === config.coverPhotoId) || photos.find((p) => p.isCover) || photos[0];
  const coverStyle = config.coverStyle || 'CAMEO_INSET';

  // Price calculations in ETB
  const basePrice = currentSizeInfo.basePrice;
  const paperAddon = currentPaperInfo.priceAddon;
  const pagesAddon = currentPageOption.priceAddon;
  const giftBoxAddon = config.includeGiftBox ? 300 : 0;
  const subtotalETB = basePrice + paperAddon + pagesAddon + giftBoxAddon;

  const updateConfig = (updates: Partial<BookConfiguration>) => {
    onChangeConfig({
      ...config,
      ...updates
    });
  };

  const handleApplyCategory = (catKey: BookCategory) => {
    const template = CATEGORIES_DATA[catKey];
    if (!template) return;

    onChangeConfig({
      ...config,
      category: catKey,
      title: template.defaultTitle,
      subtitle: template.defaultSubtitle,
      coverColor: template.defaultCoverColor,
      foilType: template.defaultFoilType,
      message: {
        enabled: true,
        type: catKey === 'WEDDING' ? 'VOWS' : catKey === 'TRAVEL' ? 'MEMOIR' : 'DEDICATION',
        title: template.defaultMessage.title,
        bodyText: template.defaultMessage.bodyText,
        authorSignature: template.defaultMessage.signature,
        artMotif: template.defaultArtMotif,
        pagePlacement: 'FRONT_DEDICATION'
      }
    });
  };

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
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-3 text-xs text-[#78716C] mb-6 font-mono">
        <button
          onClick={onBackToLanding}
          className="hover:text-[#1C1917] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#1C1917] font-semibold">Configurator</span>
        <span aria-hidden="true">/</span>
        <span className="text-[#A8A29E]">Photo Canvas Studio (Next)</span>
      </div>

      {/* Thematic Category Switcher Banner */}
      <div className="bg-white border border-[#1C1917]/10 p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-mono uppercase tracking-wider text-[#1C1917] font-semibold shrink-0">
          Book Theme Preset:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {categoryKeys.map((catKey) => {
            const cat = CATEGORIES_DATA[catKey];
            const isSelected = config.category === catKey;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleApplyCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-mono border transition-all ${
                  isSelected
                    ? 'bg-[#1C1917] text-white border-[#1C1917] font-semibold shadow-sm'
                    : 'bg-[#FAF8F5] text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: 3D Book Preview & Paper Texture Inspection */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="text-xs uppercase tracking-widest text-[#78716C] font-mono">
            Atelier Live Preview
          </div>

          {/* Book Canvas Simulation */}
          <div className="bg-[#EFECE6] p-6 sm:p-10 border border-[#1C1917]/10 flex flex-col items-center justify-center relative min-h-[440px]">
            {/* The Physical Book Canvas Simulation */}
            {coverStyle === 'FULL_WRAP' && coverPhoto ? (
              /* Full-Bleed Photo Wrap */
              <div
                className={`relative transition-all duration-500 shadow-2xl flex flex-col justify-between overflow-hidden border ${
                  config.size === 'A4_HARDCOVER'
                    ? 'w-64 sm:w-72 h-[390px] rounded-sm'
                    : 'w-56 sm:w-64 h-[330px] rounded-sm'
                }`}
                style={{ borderColor: 'rgba(0,0,0,0.3)' }}
              >
                <img
                  src={coverPhoto.url}
                  alt="Cover Full Bleed"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  style={{ filter: getPhotoFilterCss(coverPhoto.transform?.filter, coverPhoto.transform?.filterIntensity) }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 pointer-events-none" />

                {/* Cloth Spine simulation */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/40 border-r border-white/20 pointer-events-none z-10" />

                {/* Top Cover Header */}
                <div className="text-center pt-8 px-5 relative z-10">
                  <span className="text-[9px] tracking-widest uppercase font-mono text-white/70 block">
                    FULL-BLEED PHOTO WRAP
                  </span>

                  <h3
                    className={`text-lg sm:text-xl mt-4 tracking-wide leading-snug px-1 font-medium text-white ${currentFontInfo.cssClass}`}
                    style={{ textShadow: '0 2px 6px rgba(0,0,0,0.85)' }}
                  >
                    {config.title || 'YOUR BOOK TITLE'}
                  </h3>

                  {config.subtitle && (
                    <p
                      className={`text-xs mt-2 tracking-wide text-white/90 font-light ${currentFontInfo.cssClass}`}
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                    >
                      {config.subtitle}
                    </p>
                  )}
                </div>

                {/* Bottom Cover Specs */}
                <div className="p-4 relative z-10 flex justify-between items-center text-[9px] font-mono tracking-widest text-white/80 border-t border-white/15">
                  <span>{config.size === 'A4_HARDCOVER' ? 'A4 MONOGRAPH' : 'A5 MAGAZINE'}</span>
                  <span>{config.pageCount} PAGES</span>
                </div>
              </div>
            ) : coverStyle === 'CAMEO_INSET' && coverPhoto ? (
              /* Cameo Inset Window on Linen Cloth */
              <div
                className={`relative transition-all duration-500 shadow-2xl flex flex-col justify-between p-6 border ${
                  config.size === 'A4_HARDCOVER'
                    ? 'w-64 sm:w-72 h-[390px] rounded-sm'
                    : 'w-56 sm:w-64 h-[330px] rounded-sm'
                }`}
                style={{
                  backgroundColor: currentColor.hex,
                  borderColor: 'rgba(0,0,0,0.15)'
                }}
              >
                {/* Spine edge */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 border-r border-black/10 pointer-events-none" />

                {/* Top Header & Cameo Inset Window */}
                <div className="text-center pt-2">
                  <span
                    className="text-[9px] tracking-widest uppercase font-mono block"
                    style={{ color: currentFoil.previewColor }}
                  >
                    CAMEO INSET · {currentFoil.name} DEBOSS
                  </span>

                  {/* Debossed Cameo Frame */}
                  <div className="w-28 h-20 sm:w-34 sm:h-24 mx-auto my-3 overflow-hidden shadow-xl border-2 border-black/30 relative ring-1 ring-white/20 bg-black/10 rounded-xs">
                    <img
                      src={coverPhoto.url}
                      alt="Cameo Window"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      style={{ filter: getPhotoFilterCss(coverPhoto.transform?.filter, coverPhoto.transform?.filterIntensity) }}
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/40 pointer-events-none" />
                  </div>

                  {/* Debossed Title */}
                  <h3
                    className={`text-base sm:text-lg tracking-wide leading-snug px-2 font-medium ${currentFontInfo.cssClass}`}
                    style={{
                      color: currentFoil.previewColor,
                      textShadow:
                        config.foilType === 'BLIND_EMBOSS'
                          ? '1px 1px 1px rgba(0,0,0,0.4), -1px -1px 1px rgba(255,255,255,0.2)'
                          : '0 0 2px rgba(255,255,255,0.3)'
                    }}
                  >
                    {config.title || 'YOUR BOOK TITLE'}
                  </h3>

                  {config.subtitle && (
                    <p
                      className={`text-[11px] mt-1 tracking-wide font-light ${currentFontInfo.cssClass}`}
                      style={{ color: currentFoil.previewColor }}
                    >
                      {config.subtitle}
                    </p>
                  )}
                </div>

                {/* Bottom Cover Specs */}
                <div
                  className="pt-2 border-t flex justify-between items-center text-[9px] font-mono tracking-widest"
                  style={{
                    borderColor: 'rgba(0,0,0,0.1)',
                    color: currentFoil.previewColor
                  }}
                >
                  <span>{config.size === 'A4_HARDCOVER' ? 'A4 MONOGRAPH' : 'A5 MAGAZINE'}</span>
                  <span>{config.pageCount} PAGES</span>
                </div>
              </div>
            ) : (
              /* Pure Cloth Debossing */
              <div
                className={`relative transition-all duration-500 shadow-2xl flex flex-col justify-between p-7 border ${
                  config.size === 'A4_HARDCOVER'
                    ? 'w-64 sm:w-72 h-[390px] rounded-sm'
                    : 'w-56 sm:w-64 h-[330px] rounded-sm'
                }`}
                style={{
                  backgroundColor: currentColor.hex,
                  borderColor: 'rgba(0,0,0,0.15)'
                }}
              >
                {/* Spine edge */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 border-r border-black/10 pointer-events-none" />

                {/* Cover Top Header */}
                <div className="text-center pt-6">
                  <span
                    className="text-[10px] tracking-widest uppercase font-mono transition-colors block"
                    style={{ color: currentFoil.previewColor }}
                  >
                    YOKI EDITIONS
                  </span>

                  {/* Debossed Title */}
                  <h3
                    className={`text-lg sm:text-xl mt-4 tracking-wide leading-snug px-2 transition-all font-medium ${currentFontInfo.cssClass}`}
                    style={{
                      color: currentFoil.previewColor,
                      textShadow:
                        config.foilType === 'BLIND_EMBOSS'
                          ? '1px 1px 1px rgba(0,0,0,0.4), -1px -1px 1px rgba(255,255,255,0.2)'
                          : '0 0 2px rgba(255,255,255,0.3)'
                    }}
                  >
                    {config.title || 'YOUR BOOK TITLE'}
                  </h3>

                  {config.subtitle && (
                    <p
                      className={`text-xs mt-2 tracking-wide transition-colors font-light ${currentFontInfo.cssClass}`}
                      style={{ color: currentFoil.previewColor }}
                    >
                      {config.subtitle}
                    </p>
                  )}
                </div>

                {/* Cover Bottom Specs */}
                <div
                  className="pt-3 border-t flex justify-between items-center text-[9px] font-mono tracking-widest transition-colors"
                  style={{
                    borderColor: 'rgba(0,0,0,0.1)',
                    color: currentFoil.previewColor
                  }}
                >
                  <span>{config.size === 'A4_HARDCOVER' ? 'A4 MONOGRAPH' : 'A5 MAGAZINE'}</span>
                  <span>{config.pageCount} PAGES</span>
                </div>
              </div>
            )}

            <div className="mt-4 text-center text-xs text-[#78716C] font-mono">
              {coverStyle === 'FULL_WRAP' ? 'Full-Bleed Photo Wrap' : 'Cameo Inset Linen'} · {currentColor.name} · {currentFoil.name} Foil
            </div>
          </div>

          {/* Interactive Paper Finish Texture Component */}
          <PaperTexturePreview
            selectedPaper={config.paperFinish}
            onSelectPaper={(finish) => updateConfig({ paperFinish: finish })}
          />

          {/* Price Summary Sticky Card */}
          <div className="bg-[#FFFFFF] border border-[#1C1917]/10 p-5 space-y-3">
            <div className="flex justify-between items-baseline border-b border-[#1C1917]/10 pb-3">
              <span className="text-xs uppercase font-mono text-[#78716C]">Current Subtotal</span>
              <span className="text-xl font-mono font-semibold text-[#1C1917] tabular-nums">
                {subtotalETB.toLocaleString()} ETB
              </span>
            </div>

            <button
              onClick={onProceedToUpload}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-xs uppercase tracking-wider font-medium text-white bg-[#1C1917] hover:bg-[#2C2825] transition-all shadow-sm"
            >
              <span>Next: Upload Photos & Canvas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Customization Controls (Concise, Low Text) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#78716C] mb-1 font-mono">
              Step 1 of 3
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-light text-[#1C1917]">
              Book Specifications
            </h1>
          </div>

          {/* 1. Format & Size */}
          <div className="space-y-3">
            <label className="text-xs uppercase font-mono text-[#1C1917] block font-semibold">
              1. Book Format
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateConfig({ size: 'A4_HARDCOVER' })}
                className={`p-4 text-left border transition-all ${
                  config.size === 'A4_HARDCOVER'
                    ? 'border-[#1C1917] bg-[#FFFFFF] shadow-sm ring-1 ring-[#1C1917]'
                    : 'border-[#1C1917]/10 bg-[#FAF8F5] hover:border-[#1C1917]/30'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-medium text-[#1C1917]">A4 Hardcover</span>
                  <span className="text-xs font-mono font-semibold text-[#1C1917] tabular-nums">3,450 ETB</span>
                </div>
                <h4 className="font-sans font-medium text-base text-[#1C1917]">The Heirloom Monograph</h4>
                <p className="text-xs text-[#78716C] font-mono mt-0.5">210 × 297 mm · Smyth-Sewn Layflat</p>
              </button>

              <button
                type="button"
                onClick={() => updateConfig({ size: 'A5_MAGAZINE' })}
                className={`p-4 text-left border transition-all ${
                  config.size === 'A5_MAGAZINE'
                    ? 'border-[#1C1917] bg-[#FFFFFF] shadow-sm ring-1 ring-[#1C1917]'
                    : 'border-[#1C1917]/10 bg-[#FAF8F5] hover:border-[#1C1917]/30'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-medium text-[#1C1917]">A5 Magazine</span>
                  <span className="text-xs font-mono font-semibold text-[#1C1917] tabular-nums">2,200 ETB</span>
                </div>
                <h4 className="font-sans font-medium text-base text-[#1C1917]">The Editorial Magazine</h4>
                <p className="text-xs text-[#78716C] font-mono mt-0.5">148 × 210 mm · Flexible Softcover</p>
              </button>
            </div>
          </div>

          {/* 2. Debossed Title */}
          <div className="space-y-3 border-t border-[#1C1917]/10 pt-6">
            <label className="text-xs uppercase font-mono text-[#1C1917] block font-semibold">
              2. Cover Lettering & Foil
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-[#78716C] block mb-1 font-mono">Book Title</span>
                <input
                  type="text"
                  maxLength={36}
                  value={config.title}
                  onChange={(e) => updateConfig({ title: e.target.value.toUpperCase() })}
                  placeholder="OUR MEMORY CHRONICLE"
                  className="w-full px-3.5 py-2 bg-[#FFFFFF] border border-[#1C1917]/20 text-[#1C1917] text-xs font-sans tracking-wider uppercase focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div>
                <span className="text-xs text-[#78716C] block mb-1 font-mono">Subtitle / Year</span>
                <input
                  type="text"
                  maxLength={40}
                  value={config.subtitle}
                  onChange={(e) => updateConfig({ subtitle: e.target.value })}
                  placeholder="Addis Ababa · 2026"
                  className="w-full px-3.5 py-2 bg-[#FFFFFF] border border-[#1C1917]/20 text-[#1C1917] text-xs font-sans focus:outline-none focus:border-[#1C1917]"
                />
              </div>
            </div>

            {/* Foil Materials */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {FOIL_OPTIONS.map((foil) => (
                <button
                  key={foil.id}
                  type="button"
                  onClick={() => updateConfig({ foilType: foil.id })}
                  className={`p-2.5 text-left border transition-all text-xs font-mono ${
                    config.foilType === foil.id
                      ? 'border-[#1C1917] bg-[#FFFFFF] font-semibold'
                      : 'border-[#1C1917]/10 bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                      style={{ backgroundColor: foil.previewColor }}
                    />
                    <span>{foil.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Custom Book Typography (5 Curated Styles) */}
          <div className="space-y-3 border-t border-[#1C1917]/10 pt-6">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-mono text-[#1C1917] block font-semibold">
                3. Book Typography Style (5 Options)
              </label>
              <span className="text-[11px] font-mono text-[#A87B4F]">
                {currentFontInfo.tagline}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {Object.values(BOOK_FONT_OPTIONS).map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => updateConfig({ fontStyle: font.id })}
                  className={`p-3 text-left border transition-all flex flex-col justify-between ${
                    currentFontStyle === font.id
                      ? 'border-[#1C1917] bg-[#FFFFFF] ring-1 ring-[#1C1917] shadow-xs'
                      : 'border-[#1C1917]/15 bg-[#FAF8F5] hover:border-[#1C1917]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-semibold text-[#1C1917]">
                        {font.name}
                      </span>
                      {currentFontStyle === font.id && (
                        <Check className="w-3.5 h-3.5 text-[#1C1917]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#78716C] font-mono leading-tight mb-2">
                      {font.tagline}
                    </p>
                  </div>

                  {/* Typographic Preview Sample */}
                  <div className="pt-2 border-t border-[#1C1917]/10">
                    <span className={`text-xs text-[#1C1917] block truncate ${font.cssClass}`}>
                      {font.previewSample}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Cover Fabric Color */}
          <div className="space-y-3 border-t border-[#1C1917]/10 pt-6">
            <label className="text-xs uppercase font-mono text-[#1C1917] block font-semibold">
              4. Fabric Linen Color
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COVER_COLOR_OPTIONS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => updateConfig({ coverColor: color.id })}
                  className={`p-3 text-left border transition-all ${
                    config.coverColor === color.id
                      ? 'border-[#1C1917] bg-[#FFFFFF] ring-1 ring-[#1C1917]'
                      : 'border-[#1C1917]/10 bg-[#FAF8F5] hover:border-[#1C1917]/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-mono font-medium text-[#1C1917] truncate">
                      {color.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Front Cover Photo & Style Customization */}
          <div className="space-y-4 border-t border-[#1C1917]/10 pt-6">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-mono text-[#1C1917] block font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#A87B4F]" />
                <span>5. Front Cover Photo & Style</span>
              </label>
              <span className="text-[11px] font-mono text-[#A87B4F]">
                {coverStyle === 'FULL_WRAP' ? 'Full-Bleed Wrap' : 'Cameo Inset Window'}
              </span>
            </div>

            {/* Style Selector: Cameo Inset vs Full Bleed Wrap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateConfig({ coverStyle: 'CAMEO_INSET' })}
                className={`p-3.5 text-left border transition-all flex flex-col justify-between ${
                  coverStyle === 'CAMEO_INSET'
                    ? 'border-[#1C1917] bg-[#FFFFFF] ring-1 ring-[#1C1917] shadow-xs'
                    : 'border-[#1C1917]/15 bg-[#FAF8F5] hover:border-[#1C1917]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold text-[#1C1917]">
                      Cameo Inset Window
                    </span>
                    {coverStyle === 'CAMEO_INSET' && <Check className="w-3.5 h-3.5 text-[#1C1917]" />}
                  </div>
                  <p className="text-[11px] text-[#78716C] font-mono leading-tight">
                    European book cloth cover with a mechanical debossed photo window aperture and foil title.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#1C1917]/10 flex items-center gap-2">
                  <div className="w-6 h-4 bg-black/20 border border-black/30 rounded-2xs" />
                  <span className="text-[10px] font-mono text-[#A87B4F]">Archival Cloth Framing</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateConfig({ coverStyle: 'FULL_WRAP' })}
                className={`p-3.5 text-left border transition-all flex flex-col justify-between ${
                  coverStyle === 'FULL_WRAP'
                    ? 'border-[#1C1917] bg-[#FFFFFF] ring-1 ring-[#1C1917] shadow-xs'
                    : 'border-[#1C1917]/15 bg-[#FAF8F5] hover:border-[#1C1917]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold text-[#1C1917]">
                      Full-Bleed Photo Wrap
                    </span>
                    {coverStyle === 'FULL_WRAP' && <Check className="w-3.5 h-3.5 text-[#1C1917]" />}
                  </div>
                  <p className="text-[11px] text-[#78716C] font-mono leading-tight">
                    Borderless edge-to-edge photograph wrapping the entire front cover with high-contrast lettering.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#1C1917]/10 flex items-center gap-2">
                  <div className="w-6 h-4 bg-[#D4AF37]/50 rounded-2xs" />
                  <span className="text-[10px] font-mono text-[#A87B4F]">Cinematic Wrap</span>
                </div>
              </button>
            </div>

            {/* Select Which Photo Displays on the Cover */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono text-[#78716C]">
                <span>Choose Cover Photo:</span>
                {coverPhoto && (
                  <button
                    type="button"
                    onClick={() => updateConfig({ coverPhotoId: undefined })}
                    className="text-[11px] text-[#A87B4F] hover:underline"
                  >
                    Clear Photo (Pure Cloth)
                  </button>
                )}
              </div>

              {photos && photos.length > 0 ? (
                <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                  {photos.map((photo) => {
                    const isSelected = coverPhoto?.id === photo.id;
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => updateConfig({ coverPhotoId: photo.id })}
                        className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 border rounded-xs overflow-hidden transition-all group ${
                          isSelected
                            ? 'border-[#1C1917] ring-2 ring-[#D4AF37] scale-105 shadow-md'
                            : 'border-[#1C1917]/15 hover:border-[#1C1917]/40 opacity-80 hover:opacity-100'
                        }`}
                        title={`Select "${photo.name}" as cover photo`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-[#D4AF37] text-[#1C1917] px-1 py-0.5 text-[8px] font-mono font-bold uppercase rounded-2xs">
                              Cover
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-[#FAF8F5] border border-[#1C1917]/10 text-xs font-mono text-[#78716C]">
                  You can upload photos in Step 2, where you will also be able to pick any uploaded photo for your cover!
                </div>
              )}
            </div>
          </div>

          {/* 6. Paper Finish Selector */}
          <div className="space-y-3 border-t border-[#1C1917]/10 pt-6">
            <label className="text-xs uppercase font-mono text-[#1C1917] block font-semibold">
              6. Archival Paper Grade
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.values(PAPER_FINISH_OPTIONS).map((paper) => (
                <button
                  key={paper.id}
                  type="button"
                  onClick={() => updateConfig({ paperFinish: paper.id })}
                  className={`p-3.5 text-left border transition-all ${
                    config.paperFinish === paper.id
                      ? 'border-[#1C1917] bg-[#FFFFFF] ring-1 ring-[#1C1917]'
                      : 'border-[#1C1917]/10 bg-[#FAF8F5] hover:border-[#1C1917]/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono font-medium text-[#1C1917] truncate">
                      {paper.name}
                    </span>
                    <span className="text-xs font-mono text-[#78716C] tabular-nums">
                      {paper.priceAddon === 0 ? 'Base' : `+${paper.priceAddon}`}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#A87B4F] font-mono block">{paper.weight}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 7. Page Count */}
          <div className="space-y-3 border-t border-[#1C1917]/10 pt-6">
            <label className="text-xs uppercase font-mono text-[#1C1917] block font-semibold">
              7. Page Count
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PAGE_COUNT_OPTIONS.map((pageOpt) => (
                <button
                  key={pageOpt.pages}
                  type="button"
                  onClick={() => updateConfig({ pageCount: pageOpt.pages })}
                  className={`p-3 text-left border transition-all ${
                    config.pageCount === pageOpt.pages
                      ? 'border-[#1C1917] bg-[#FFFFFF] ring-1 ring-[#1C1917]'
                      : 'border-[#1C1917]/10 bg-[#FAF8F5] hover:border-[#1C1917]/30'
                  }`}
                >
                  <div className="text-base font-mono font-medium text-[#1C1917]">
                    {pageOpt.pages} Pages
                  </div>
                  <div className="text-xs font-mono text-[#78716C] tabular-nums">
                    {pageOpt.priceAddon === 0 ? 'Included' : `+${pageOpt.priceAddon} ETB`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 8. Gift Packaging */}
          <div className="border-t border-[#1C1917]/10 pt-6">
            <div
              onClick={() => updateConfig({ includeGiftBox: !config.includeGiftBox })}
              className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                config.includeGiftBox ? 'border-[#1C1917] bg-white' : 'border-[#1C1917]/10 bg-[#FAF8F5]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.includeGiftBox}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#1C1917]"
                />
                <span className="text-xs font-mono font-medium text-[#1C1917]">
                  Luxury Presentation Box with Wax-Sealed Card
                </span>
              </div>
              <span className="text-xs font-mono text-[#1C1917] tabular-nums font-semibold">
                +300 ETB
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-[#1C1917]/10 pt-6 flex items-center justify-between">
            <button
              onClick={onBackToLanding}
              className="text-xs uppercase font-mono text-[#78716C] hover:text-[#1C1917] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={onProceedToUpload}
              className="px-8 py-3 text-xs uppercase font-mono tracking-wider font-medium text-white bg-[#1C1917] hover:bg-[#2C2825] flex items-center gap-2"
            >
              <span>Continue to Photo Studio & Canvas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
