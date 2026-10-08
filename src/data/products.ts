import { BookSize, PaperFinish, CoverColor, FoilType, DeliveryMethod, PaymentMethod, BookFontStyle, PhotoFilterType } from '../types';

export interface BookOptionInfo {
  id: BookSize;
  name: string;
  tagline: string;
  dimensions: string;
  binding: string;
  basePrice: number; // in ETB
  basePages: number;
  description: string;
  idealFor: string;
}

export const BOOK_SIZE_OPTIONS: Record<BookSize, BookOptionInfo> = {
  A4_HARDCOVER: {
    id: 'A4_HARDCOVER',
    name: 'A4 Heirloom Hardcover',
    tagline: 'Substantial, case-bound archival monograph',
    dimensions: '210 × 297 mm (Vertical Monograph)',
    binding: 'Smyth-sewn layflat binding with hard cloth cover',
    basePrice: 3450,
    basePages: 24,
    description: 'Our flagship case-bound volume. Hand-wrapped in European natural bookbinding cloth with blind or metallic debossing. Crafted to stay completely flat when open for seamless panoramic photo spreads.',
    idealFor: 'Wedding albums, family chronicles, architectural portfolios, and milestone celebrations.'
  },
  A5_MAGAZINE: {
    id: 'A5_MAGAZINE',
    name: 'A5 Editorial Softcover Magazine',
    tagline: 'Lightweight, contemporary editorial periodical',
    dimensions: '148 × 210 mm (Compact Digest)',
    binding: 'Flexible softcover with pur-glued spine and matte scuff-free finish',
    basePrice: 2200,
    basePages: 24,
    description: 'An understated, high-fashion journal inspired by independent art periodicals. Features tactile 300gsm textured cover wraps and featherweight page turning for an intimate reading experience.',
    idealFor: 'Travel journeys, weekend getaways, seasonal coffee table anthologies, and birthday gifts.'
  }
};

export interface PaperFinishInfo {
  id: PaperFinish;
  name: string;
  weight: string;
  priceAddon: number; // in ETB
  texture: string;
  description: string;
  bestUse: string;
  macroImage: string;
  macroAlt: string;
  fiberDetails: {
    gsm: number;
    composition: string;
    finishType: string;
    sheenRating: string;
    glareIndex: string;
    archivalRating: string;
  };
}

export const PAPER_FINISH_OPTIONS: Record<PaperFinish, PaperFinishInfo> = {
  ARCHIVAL_MATTE: {
    id: 'ARCHIVAL_MATTE',
    name: 'Archival Matte Cotton',
    weight: '200 gsm acid-free paper',
    priceAddon: 0,
    texture: 'Smooth, natural non-reflective eggshell',
    description: '100% acid-free cellulose with an ultra-smooth velvety finish. Absorbs light without any glare, creating deep charcoal tones and soft, timeless skin warmth.',
    bestUse: 'Documentary, black & white, and natural light moments',
    macroImage: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    macroAlt: 'Close-up macro of smooth archival matte cotton paper fibers',
    fiberDetails: {
      gsm: 200,
      composition: '100% Alpha-Cellulose with natural cotton binders',
      finishType: 'Calendered eggshell non-reflective velvet',
      sheenRating: '0% Specular Sheen (Full Glare-Free)',
      glareIndex: 'Zero reflectance under direct tungsten & sunlight',
      archivalRating: 'ISO 9706 Certified (100+ years acid-free pH 7.8)'
    }
  },
  PEARL_LUSTER: {
    id: 'PEARL_LUSTER',
    name: 'Fine Pearl Lustre',
    weight: '240 gsm micro-ceramic coat',
    priceAddon: 350,
    texture: 'Subtle stippled crystal sheen',
    description: 'Combines the deep color gamut of traditional darkroom photographic paper with an understated crystalline luster that repels fingerprints.',
    bestUse: 'Sunset skies, wedding gowns, and vibrant golden hour travels',
    macroImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    macroAlt: 'Macro photograph of fine pearl luster crystalline paper sheen',
    fiberDetails: {
      gsm: 240,
      composition: 'Micro-porous ceramic coating over dense fiber core',
      finishType: 'Stippled crystalline luster with fingerprint resistance',
      sheenRating: '35% Micro-crystalline Sheen (Soft directional glow)',
      glareIndex: 'Suppressed diffused highlights without harsh mirror shine',
      archivalRating: 'Pigment-stabilized photographic archival grade'
    }
  },
  SILK_LINEN: {
    id: 'SILK_LINEN',
    name: 'Museum Cotton Rag & Silk',
    weight: '310 gsm textured mold-made weave',
    priceAddon: 550,
    texture: 'Tactile organic cotton tooth and silk weave',
    description: 'Heavyweight mold-made 100% cotton rag with a luxurious cross-hatched tactile tooth. Every page feels substantial in hand, delivering unmatched museum-grade presence.',
    bestUse: 'Heirloom family tributes, art monographs, and luxury keepsake gifts',
    macroImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
    macroAlt: 'Close-up macro texture of heavy cotton rag and artisanal woven fibers',
    fiberDetails: {
      gsm: 310,
      composition: '100% Long-staple cotton rag linters',
      finishType: 'Mold-made felt texture with artisanal deckle tooth',
      sheenRating: '5% Organic Tactile Tooth (Sensory fabric hand-feel)',
      glareIndex: 'Naturally absorbs ambient light with rich dimensional shadows',
      archivalRating: 'Museum Fine Art Grade (Permanent archival durability)'
    }
  }
};

export interface PageCountOption {
  pages: number;
  priceAddon: number;
  recommendedPhotos: string;
}

export const PAGE_COUNT_OPTIONS: PageCountOption[] = [
  { pages: 24, priceAddon: 0, recommendedPhotos: '18 – 24 photos' },
  { pages: 32, priceAddon: 400, recommendedPhotos: '24 – 32 photos' },
  { pages: 48, priceAddon: 850, recommendedPhotos: '36 – 48 photos' },
  { pages: 64, priceAddon: 1300, recommendedPhotos: '48 – 64 photos' }
];

export interface CoverColorOption {
  id: CoverColor;
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
  description: string;
}

export const COVER_COLOR_OPTIONS: CoverColorOption[] = [
  {
    id: 'WARM_BONE',
    name: 'Warm Bone Linen',
    hex: '#ECE6DC',
    bgClass: 'bg-[#ECE6DC]',
    textClass: 'text-[#2C2825]',
    description: 'Raw unbleached linen with organic flax specks'
  },
  {
    id: 'OBSIDIAN',
    name: 'Obsidian Cloth',
    hex: '#252422',
    bgClass: 'bg-[#252422]',
    textClass: 'text-[#EFECE6]',
    description: 'Midnight graphite weave with deep tactile contrast'
  },
  {
    id: 'TERRACOTTA',
    name: 'Raw Terracotta',
    hex: '#965342',
    bgClass: 'bg-[#965342]',
    textClass: 'text-[#F9F6F0]',
    description: 'Sun-baked clay tone evoking East African landscapes'
  },
  {
    id: 'SAGE',
    name: 'Highland Sage',
    hex: '#515E50',
    bgClass: 'bg-[#515E50]',
    textClass: 'text-[#FAF8F5]',
    description: 'Subtle eucalyptus tone inspired by Entoto hills'
  }
];

export interface FoilOption {
  id: FoilType;
  name: string;
  previewColor: string;
  description: string;
}

export const FOIL_OPTIONS: FoilOption[] = [
  {
    id: 'GOLD',
    name: 'Warm Gold Foil',
    previewColor: '#C5A880',
    description: 'Metallic gilded foil with subtle champagne reflection'
  },
  {
    id: 'SILVER',
    name: 'Matte Silver Foil',
    previewColor: '#B0B5B3',
    description: 'Cool brushed platinum metallic foil'
  },
  {
    id: 'BLIND_EMBOSS',
    name: 'Blind Deboss',
    previewColor: '#6B655F',
    description: 'Deep mechanical pressure stamp without ink or foil'
  }
];

export const ADDIS_SUB_CITIES = [
  'Bole (Atlas, Medhanialem, Rwanda, Wello Sefer)',
  'Kirkos (Kazanchis, Meskel Square, Mexico)',
  'Yeka (Megenagna, Signal, Kotebe)',
  'Arada (Piazza, 4 Kilo, Churchill Ave)',
  'Lideta (Balcha, Abinet, Mexico)',
  'Nifas Silk-Lafto (Jemo, Lebu, Gotera)',
  'Gullele (Shiro Meda, Entoto, Semien Mazegaja)',
  'Kolfe Keranio (Tor Hailoch, Ayer Tena)',
  'Akaky Kaliti (Kality, Gelan)',
  'Bole Bulbula & Sunshine'
];

export const REGIONAL_CITIES = [
  'Hawassa',
  'Bahir Dar',
  'Dire Dawa',
  'Adama (Nazret)',
  'Bishoftu (Debre Zeyit)',
  'Mekelle',
  'Jimma',
  'Gondar',
  'Arba Minch'
];

export interface DeliveryTierInfo {
  id: DeliveryMethod;
  name: string;
  duration: string;
  price: number; // in ETB
  description: string;
}

export const DELIVERY_OPTIONS: Record<DeliveryMethod, DeliveryTierInfo> = {
  STANDARD: {
    id: 'STANDARD',
    name: 'Standard Ethiopian Delivery',
    duration: '3 – 5 business days',
    price: 250,
    description: 'Doorstep courier across Addis Ababa or regional postal dispatch.'
  },
  EXPRESS_COURIER: {
    id: 'EXPRESS_COURIER',
    name: 'Express Dedicated Courier (Addis Ababa)',
    duration: 'Same-day / Next-day direct handover',
    price: 450,
    description: 'Dedicated studio rider with phone tracking directly to your location in Addis.'
  },
  STUDIO_PICKUP: {
    id: 'STUDIO_PICKUP',
    name: 'Atelier Studio Pickup (Bole)',
    duration: 'Ready in 48 hours',
    price: 0,
    description: 'Complimentary pickup at Yoki Gifts Atelier, Cameroon St. next to Bole Atlas.'
  }
};

export interface PaymentOptionInfo {
  id: PaymentMethod;
  name: string;
  shortDesc: string;
  badge: string;
  instructions: string;
}

export const PAYMENT_METHODS: Record<PaymentMethod, PaymentOptionInfo> = {
  TELEBIRR: {
    id: 'TELEBIRR',
    name: 'Telebirr',
    shortDesc: 'Instant payment via Ethio Telecom Telebirr SuperApp or USSD *127#',
    badge: 'Popular',
    instructions: 'You will receive an automated push prompt on your Telebirr registered phone or scan our verified atelier QR code.'
  },
  CBE_BIRR: {
    id: 'CBE_BIRR',
    name: 'CBE Birr / CBE Mobile Banking',
    shortDesc: 'Commercial Bank of Ethiopia direct payment or account transfer',
    badge: 'Direct',
    instructions: 'Transfer instantly to Commercial Bank of Ethiopia (CBE) Account 1000348291048 (Yoki Gifts Studio).'
  },
  BANK_TRANSFER: {
    id: 'BANK_TRANSFER',
    name: 'Bank Transfer (Awash, Dashen, Hibret)',
    shortDesc: 'Interbank mobile transfer or branch deposit',
    badge: 'Any Bank',
    instructions: 'Select Awash Bank (Acct: 01428391204) or Dashen Bank (Acct: 7819024810). Upload transfer reference slip.'
  },
  CASH_ON_DELIVERY: {
    id: 'CASH_ON_DELIVERY',
    name: 'Cash on Handover (Addis Ababa Only)',
    shortDesc: 'Pay rider upon personal book inspection and gift handover',
    badge: 'Local',
    instructions: 'Inspect your bound photobook upon courier arrival before cash payment.'
  }
};

export interface BookFontOptionInfo {
  id: BookFontStyle;
  name: string;
  tagline: string;
  cssClass: string;
  previewSample: string;
  description: string;
}

export const BOOK_FONT_OPTIONS: Record<BookFontStyle, BookFontOptionInfo> = {
  MODERN: {
    id: 'MODERN',
    name: 'Modern Minimalist',
    tagline: 'Clarity & Clean Geometric',
    cssClass: 'book-font-modern',
    previewSample: 'MOMENTS BOUND IN LINEN',
    description: 'Clean geometric sans with airy tracking, inspired by contemporary art monographs.'
  },
  SERIF: {
    id: 'SERIF',
    name: 'Editorial Serif',
    tagline: 'Timeless Archival & Literary',
    cssClass: 'book-font-serif',
    previewSample: 'Moments Bound in Linen',
    description: 'Literary serif typography echoing classic cloth-bound monographs and poetry volumes.'
  },
  GROTESQUE: {
    id: 'GROTESQUE',
    name: 'Studio Grotesque',
    tagline: 'High-Fashion & Bold',
    cssClass: 'book-font-grotesque',
    previewSample: 'MOMENTS BOUND IN LINEN',
    description: 'Sculptural Scandinavian grotesque for design studios, architecture, and high fashion.'
  },
  SCRIPT: {
    id: 'SCRIPT',
    name: 'Poetic Script',
    tagline: 'Romantic & Delicate Cursive',
    cssClass: 'book-font-script',
    previewSample: 'Moments Bound in Linen',
    description: 'Delicate cursive calligraphic letterforms for weddings, vows, and romantic keepsakes.'
  },
  MONO: {
    id: 'MONO',
    name: 'Archival Monospace',
    tagline: 'Documentary & Typewriter',
    cssClass: 'book-font-mono',
    previewSample: 'MOMENTS_BOUND_IN_LINEN',
    description: 'Crisp typewriter monospace for expedition notes, field logs, and photo documentaries.'
  }
};

export interface AtelierColorSwatch {
  id: string;
  name: string;
  hex: string;
  category: 'monochrome' | 'metallic' | 'earth' | 'rich';
  description: string;
  isLight?: boolean;
}

export const ATELIER_12_COLORS: AtelierColorSwatch[] = [
  { id: 'carbon', name: 'Atelier Carbon', hex: '#1C1917', category: 'monochrome', description: 'Deep archival obsidian black' },
  { id: 'snow', name: 'Alabaster Snow', hex: '#FFFFFF', category: 'monochrome', description: 'Crisp opaque pure white', isLight: true },
  { id: 'bone', name: 'Warm Bone', hex: '#F5EFEB', category: 'earth', description: 'Natural unbleached cotton fiber', isLight: true },
  { id: 'gold', name: 'Imperial Gold', hex: '#D4AF37', category: 'metallic', description: 'Reflective warm gold foil tone' },
  { id: 'silver', name: 'Starlight Silver', hex: '#C0C0C0', category: 'metallic', description: 'Cool metallic starlight leaf', isLight: true },
  { id: 'coffee', name: 'Addis Coffee Roast', hex: '#5C3A21', category: 'earth', description: 'Rich highland coffee cherry wood' },
  { id: 'terracotta', name: 'Rift Terracotta', hex: '#B85437', category: 'earth', description: 'Sun-baked clay earth tone' },
  { id: 'ochre', name: 'Harvest Ochre', hex: '#D6882E', category: 'earth', description: 'Warm golden sunlight pigment' },
  { id: 'sage', name: 'Highland Sage', hex: '#486B52', category: 'rich', description: 'Eucalyptus leaf botanic tone' },
  { id: 'navy', name: 'Midnight Navy', hex: '#1C2E4A', category: 'rich', description: 'Deep ocean dusk pigment' },
  { id: 'blush', name: 'Poetic Blush', hex: '#B56576', category: 'rich', description: 'Gentle rose petal keepsake hue' },
  { id: 'sepia', name: 'Vintage Sepia', hex: '#7A5C43', category: 'earth', description: 'Archival monochrome sepia wash' }
];

export interface PhotoFilterOption {
  id: PhotoFilterType;
  name: string;
  subtitle: string;
  description: string;
  previewCss: string;
}

export const PHOTO_FILTER_OPTIONS: PhotoFilterOption[] = [
  {
    id: 'NONE',
    name: 'Natural',
    subtitle: 'Original Color',
    description: 'True camera exposure without digital tonal grading.',
    previewCss: 'none'
  },
  {
    id: 'BW',
    name: 'Monochrome',
    subtitle: 'Archival B&W',
    description: 'High-contrast silver-gelatin black & white with deep blacks.',
    previewCss: 'grayscale(100%) contrast(115%)'
  },
  {
    id: 'SEPIA',
    name: 'Sepia',
    subtitle: 'Antique Keepsake',
    description: 'Nostalgic 19th-century amber-brown warm emulsion wash.',
    previewCss: 'sepia(85%) contrast(105%) brightness(96%)'
  },
  {
    id: 'WARM',
    name: 'Warm Tone',
    subtitle: 'Sunlit Amber',
    description: 'Gentle golden radiance enhancing skin tones & memories.',
    previewCss: 'sepia(35%) saturate(135%) brightness(102%)'
  },
  {
    id: 'GOLDEN',
    name: 'Golden Hour',
    subtitle: 'Dusk Radiance',
    description: 'Rich late-afternoon dusk illumination with warm honey hues.',
    previewCss: 'sepia(30%) contrast(108%) saturate(125%)'
  },
  {
    id: 'MATTE',
    name: 'Muted Film',
    subtitle: 'Editorial Matte',
    description: 'Soft lifted shadows and gentle desaturation for art monographs.',
    previewCss: 'contrast(92%) brightness(104%) saturate(85%)'
  },
  {
    id: 'COOL',
    name: 'Cool Slate',
    subtitle: 'Nordic Calm',
    description: 'Subtle cyan-blue tones ideal for mountains, architecture & sky.',
    previewCss: 'saturate(92%) hue-rotate(180deg) contrast(105%)'
  },
  {
    id: 'VIVID',
    name: 'Vivid Rich',
    subtitle: 'Lush Pigment',
    description: 'Boosted color brilliance making textiles & celebrations pop.',
    previewCss: 'saturate(140%) contrast(115%)'
  }
];

export const getPhotoFilterCss = (filter?: PhotoFilterType, intensity: number = 100): string => {
  if (!filter || filter === 'NONE') return 'none';
  const factor = Math.max(0, Math.min(100, intensity)) / 100;

  switch (filter) {
    case 'BW':
      return `grayscale(${Math.round(100 * factor)}%) contrast(${Math.round(100 + 15 * factor)}%)`;
    case 'SEPIA':
      return `sepia(${Math.round(85 * factor)}%) contrast(${Math.round(100 + 5 * factor)}%) brightness(${Math.round(100 - 4 * factor)}%)`;
    case 'WARM':
      return `sepia(${Math.round(35 * factor)}%) saturate(${Math.round(100 + 35 * factor)}%) brightness(${Math.round(100 + 2 * factor)}%)`;
    case 'GOLDEN':
      return `sepia(${Math.round(30 * factor)}%) contrast(${Math.round(100 + 8 * factor)}%) saturate(${Math.round(100 + 25 * factor)}%)`;
    case 'MATTE':
      return `contrast(${Math.round(100 - 8 * factor)}%) brightness(${Math.round(100 + 4 * factor)}%) saturate(${Math.round(100 - 15 * factor)}%)`;
    case 'COOL':
      return `saturate(${Math.round(100 - 8 * factor)}%) hue-rotate(${Math.round(180 * factor)}deg) contrast(${Math.round(100 + 5 * factor)}%)`;
    case 'VIVID':
      return `saturate(${Math.round(100 + 40 * factor)}%) contrast(${Math.round(100 + 15 * factor)}%)`;
    default:
      return 'none';
  }
};
