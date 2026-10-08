export type BookSize = 'A4_HARDCOVER' | 'A5_MAGAZINE';

export type PaperFinish = 'ARCHIVAL_MATTE' | 'PEARL_LUSTER' | 'SILK_LINEN';

export type CoverColor = 'WARM_BONE' | 'OBSIDIAN' | 'TERRACOTTA' | 'SAGE';

export type FoilType = 'GOLD' | 'SILVER' | 'BLIND_EMBOSS';

export type ArtMotif = 'NONE' | 'BOTANICAL_SPRIG' | 'COFFEE_BRANCH' | 'HERITAGE_CREST';

export type BookCategory =
  | 'WEDDING'
  | 'FAMILY'
  | 'TRAVEL'
  | 'COUPLE'
  | 'BIRTHDAY'
  | 'FRIENDS'
  | 'TEAM';

export interface BookMessage {
  enabled: boolean;
  type: 'DEDICATION' | 'LETTER' | 'MEMOIR' | 'VOWS';
  title: string;
  bodyText: string;
  authorSignature: string;
  artMotif: ArtMotif;
  pagePlacement: 'FRONT_DEDICATION' | 'SPREAD_CENTER' | 'BACK_INSCRIPTION';
}

export interface BookQRMedia {
  enabled: boolean;
  mediaType: 'VIDEO' | 'AUDIO_VOICE';
  title: string;
  mediaUrl: string;
  captionText: string;
  audioDuration?: string;
}

export type BookFontStyle =
  | 'MODERN'
  | 'SERIF'
  | 'GROTESQUE'
  | 'SCRIPT'
  | 'MONO';

export type CoverStyle = 'CAMEO_INSET' | 'FULL_WRAP';

export type SpreadTemplateType =
  | 'MUSEUM_INSET'
  | 'FULL_BLEED'
  | 'SPLIT_EDITORIAL'
  | 'COLLAGE_MULTI'
  | 'TEXT_HEAVY'
  | 'GRID_QUAD_2X2';

export interface BookConfiguration {
  id: string;
  category?: BookCategory;
  size: BookSize;
  title: string;
  subtitle: string;
  coverColor: CoverColor;
  coverStyle?: CoverStyle;
  coverPhotoId?: string;
  foilType: FoilType;
  paperFinish: PaperFinish;
  pageCount: number; // 24, 32, 48, 64
  includeGiftBox: boolean;
  fontStyle?: BookFontStyle;
  message?: BookMessage;
  qrMedia?: BookQRMedia;
  spreadLayouts?: Record<string, SpreadTemplateType>;
}

export type PhotoFilterType =
  | 'NONE'
  | 'BW'
  | 'SEPIA'
  | 'WARM'
  | 'GOLDEN'
  | 'MATTE'
  | 'COOL'
  | 'VIVID';

export interface PhotoTransform {
  zoom?: number; // 0.8 to 2.5
  rotate?: number; // 0, 90, 180, 270
  filter?: PhotoFilterType;
  filterIntensity?: number; // 0 to 100
  textOverlay?: string;
  textColor?: 'WHITE' | 'DARK';
  textPosition?: 'TOP' | 'CENTER' | 'BOTTOM';
  textPositionX?: number; // 0 to 100%
  textPositionY?: number; // 0 to 100%
  textColorHex?: string; // hex from 12 swatches
  textBgColorHex?: string; // optional background chip
  textFontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTextBg?: boolean;
}

export interface PhotoItem {
  id: string;
  url: string;
  name: string;
  isCover?: boolean;
  caption?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  fileSize?: string;
  transform?: PhotoTransform;
  tags?: string[];
}

export type DeliveryMethod = 'STANDARD' | 'EXPRESS_COURIER' | 'STUDIO_PICKUP';

export type PaymentMethod = 'TELEBIRR' | 'CBE_BIRR' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';

export type OrderStatus =
  | 'NEW_ORDER'
  | 'PRE_PRESS'
  | 'PRINTING'
  | 'BOUND'
  | 'DISPATCHED'
  | 'DELIVERED';

export interface ShippingDetails {
  fullName: string;
  phoneNumber: string;
  email: string;
  region: 'ADDIS_ABABA' | 'REGIONAL';
  subCity: string;
  specificAddress: string;
  deliveryMethod: DeliveryMethod;
  notes?: string;
}

export interface PriceBreakdown {
  basePrice: number;
  paperAddon: number;
  pagesAddon: number;
  giftBoxAddon: number;
  subtotal: number;
  shippingFee: number;
  total: number;
}

export interface PrintProvider {
  id: string;
  name: string;
  location: string;
  contactPerson: string;
  phone: string;
  activeOrdersCount: number;
  completedOrdersCount: number;
  capacityPerDay: number;
  rating: number;
  specialty: string;
}

export interface PlacedOrder {
  orderId: string;
  createdAt: string;
  config: BookConfiguration;
  photos: PhotoItem[];
  shipping: ShippingDetails;
  pricing: PriceBreakdown;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'PENDING_VERIFICATION';
  status: OrderStatus;
  assignedPrinterId: string;
  printerNotes?: string;
  trackingCode?: string;
}

export type AppUserRole = 'customer' | 'printer' | 'admin';
