import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  Smartphone,
  Truck,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  Sparkles,
  Info,
  FileText,
  BookOpen
} from 'lucide-react';
import { FullBookProofModal } from './FullBookProofModal';
import {
  BookConfiguration,
  PhotoItem,
  ShippingDetails,
  DeliveryMethod,
  PaymentMethod,
  PlacedOrder,
  PriceBreakdown
} from '../types';
import {
  BOOK_SIZE_OPTIONS,
  PAPER_FINISH_OPTIONS,
  PAGE_COUNT_OPTIONS,
  COVER_COLOR_OPTIONS,
  FOIL_OPTIONS,
  DELIVERY_OPTIONS,
  PAYMENT_METHODS,
  ADDIS_SUB_CITIES,
  REGIONAL_CITIES
} from '../data/products';

interface CheckoutViewProps {
  config: BookConfiguration;
  photos: PhotoItem[];
  onBackToUpload: () => void;
  onOrderPlaced: (order: PlacedOrder) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  config,
  photos,
  onBackToUpload,
  onOrderPlaced
}) => {
  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    phoneNumber: '+251 9',
    email: '',
    region: 'ADDIS_ABABA',
    subCity: ADDIS_SUB_CITIES[0],
    specificAddress: '',
    deliveryMethod: 'STANDARD',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TELEBIRR');
  const [telebirrPhone, setTelebirrPhone] = useState('09');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isProofApproved, setIsProofApproved] = useState(false);

  const sizeInfo = BOOK_SIZE_OPTIONS[config.size];
  const paperInfo = PAPER_FINISH_OPTIONS[config.paperFinish];
  const pageOption = PAGE_COUNT_OPTIONS.find(p => p.pages === config.pageCount) || PAGE_COUNT_OPTIONS[0];
  const colorInfo = COVER_COLOR_OPTIONS.find(c => c.id === config.coverColor) || COVER_COLOR_OPTIONS[0];
  const foilInfo = FOIL_OPTIONS.find(f => f.id === config.foilType) || FOIL_OPTIONS[0];
  const deliveryInfo = DELIVERY_OPTIONS[shipping.deliveryMethod];

  // Pricing calculation in ETB
  const basePrice = sizeInfo.basePrice;
  const paperAddon = paperInfo.priceAddon;
  const pagesAddon = pageOption.priceAddon;
  const giftBoxAddon = config.includeGiftBox ? 300 : 0;
  const subtotal = basePrice + paperAddon + pagesAddon + giftBoxAddon;
  const shippingFee = deliveryInfo.price;
  const total = subtotal + shippingFee;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!shipping.fullName.trim()) {
      errors.fullName = 'Please enter recipient full name';
    }
    if (!shipping.phoneNumber || shipping.phoneNumber.length < 9) {
      errors.phoneNumber = 'Please enter a valid Ethiopian mobile phone (+251 9...)';
    }
    if (shipping.deliveryMethod !== 'STUDIO_PICKUP' && !shipping.specificAddress.trim()) {
      errors.specificAddress = 'Please specify street, building, or landmark in Addis';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Must inspect complete book proof before finalizing order
    if (!isProofApproved) {
      setIsProofModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const pricing: PriceBreakdown = {
        basePrice,
        paperAddon,
        pagesAddon,
        giftBoxAddon,
        subtotal,
        shippingFee,
        total
      };

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const placedOrder: PlacedOrder = {
        orderId: `YG-2026-${randomSuffix}`,
        createdAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        config,
        photos,
        shipping,
        pricing,
        paymentMethod,
        paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING_VERIFICATION' : 'PAID',
        status: 'NEW_ORDER',
        assignedPrinterId: 'printer-bole',
        trackingCode: `ETH-${randomSuffix}`
      };

      setIsSubmitting(false);
      onOrderPlaced(placedOrder);
    }, 1200);
  };

  const coverPhoto = photos.find(p => p.isCover) || photos[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-xs text-[#78716C] mb-8 font-mono">
        <button
          onClick={onBackToUpload}
          className="hover:text-[#1C1917] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Photo & Media Studio</span>
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#1C1917] font-semibold">Ethiopian Birr (ETB) Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Ethiopian Shipping and Payment Gateway Selection */}
        <div className="lg:col-span-7 space-y-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716C] font-mono mb-2">
              <span>Step 3 of 3</span>
              <span aria-hidden="true">·</span>
              <span>Secure Local Checkout & Print Dispatch</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-sans font-light text-[#1C1917]">
              Delivery & Ethiopian Payment
            </h1>
            <p className="text-sm text-[#78716C] mt-1.5 font-light">
              Enter your Addis Ababa or regional delivery coordinates. Upon payment, your design files dispatch instantly to our partner print atelier.
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-10">
            {/* 1. Recipient Coordinates */}
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-wider font-mono text-[#1C1917] block font-semibold border-b border-[#1C1917]/10 pb-2">
                1. Recipient & Contact Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-[#78716C] block mb-1 font-mono">Full Name *</span>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    placeholder="e.g. Tsige Selamawit"
                    className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#1C1917]/20 text-[#1C1917] text-sm focus:outline-none focus:border-[#1C1917]"
                  />
                  {formErrors.fullName && (
                    <span className="text-[11px] text-red-600 font-mono mt-1 block">
                      {formErrors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs text-[#78716C] block mb-1 font-mono">Ethiopian Mobile (Phone) *</span>
                  <input
                    type="text"
                    required
                    value={shipping.phoneNumber}
                    onChange={(e) => setShipping({ ...shipping, phoneNumber: e.target.value })}
                    placeholder="+251 91 234 5678"
                    className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#1C1917]/20 text-[#1C1917] text-sm font-mono focus:outline-none focus:border-[#1C1917]"
                  />
                  {formErrors.phoneNumber && (
                    <span className="text-[11px] text-red-600 font-mono mt-1 block">
                      {formErrors.phoneNumber}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <span className="text-xs text-[#78716C] block mb-1 font-mono">Email Address (For Print Proof & Tracking Updates)</span>
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    placeholder="tsigeselamawit925@gmail.com"
                    className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#1C1917]/20 text-[#1C1917] text-sm focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Destination & Delivery Tier */}
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-wider font-mono text-[#1C1917] block font-semibold border-b border-[#1C1917]/10 pb-2">
                2. Ethiopian Delivery Destination & Speed
              </label>

              {/* Delivery Tier Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.values(DELIVERY_OPTIONS).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setShipping({ ...shipping, deliveryMethod: opt.id })}
                    className={`p-4 text-left border transition-all flex flex-col justify-between ${
                      shipping.deliveryMethod === opt.id
                        ? 'border-[#1C1917] bg-[#FFFFFF] shadow-sm'
                        : 'border-[#1C1917]/10 bg-[#FAF8F5] hover:border-[#1C1917]/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-sans font-medium text-[#1C1917]">
                          {opt.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#1C1917] block tabular-nums">
                        {opt.price === 0 ? 'Complimentary (0 ETB)' : `${opt.price} ETB`}
                      </span>
                      <p className="text-[11px] text-[#78716C] mt-2 font-mono">
                        {opt.duration}
                      </p>
                    </div>

                    {shipping.deliveryMethod === opt.id && (
                      <div className="mt-3 pt-2 border-t border-[#1C1917]/10 flex items-center gap-1 text-[10px] font-mono font-medium text-[#1C1917]">
                        <Check className="w-3 h-3" />
                        <span>Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {shipping.deliveryMethod !== 'STUDIO_PICKUP' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-xs text-[#78716C] block mb-1 font-mono">Region</span>
                    <select
                      value={shipping.region}
                      onChange={(e) => {
                        const reg = e.target.value as 'ADDIS_ABABA' | 'REGIONAL';
                        setShipping({
                          ...shipping,
                          region: reg,
                          subCity: reg === 'ADDIS_ABABA' ? ADDIS_SUB_CITIES[0] : REGIONAL_CITIES[0]
                        });
                      }}
                      className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#1C1917]/20 text-[#1C1917] text-sm focus:outline-none focus:border-[#1C1917]"
                    >
                      <option value="ADDIS_ABABA">Addis Ababa City</option>
                      <option value="REGIONAL">Regional Major Cities</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-xs text-[#78716C] block mb-1 font-mono">
                      {shipping.region === 'ADDIS_ABABA' ? 'Addis Sub-City / Neighborhood' : 'Regional City'}
                    </span>
                    <select
                      value={shipping.subCity}
                      onChange={(e) => setShipping({ ...shipping, subCity: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#1C1917]/20 text-[#1C1917] text-sm focus:outline-none focus:border-[#1C1917]"
                    >
                      {shipping.region === 'ADDIS_ABABA'
                        ? ADDIS_SUB_CITIES.map(sc => <option key={sc} value={sc}>{sc}</option>)
                        : REGIONAL_CITIES.map(rc => <option key={rc} value={rc}>{rc}</option>)
                      }
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-xs text-[#78716C] block mb-1 font-mono">
                      Delivery Address / House / Landmark Note *
                    </span>
                    <input
                      type="text"
                      required
                      value={shipping.specificAddress}
                      onChange={(e) => setShipping({ ...shipping, specificAddress: e.target.value })}
                      placeholder="e.g. Bole Atlas, behind Desalegn Hotel, Villa 402"
                      className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#1C1917]/20 text-[#1C1917] text-sm focus:outline-none focus:border-[#1C1917]"
                    />
                    {formErrors.specificAddress && (
                      <span className="text-[11px] text-red-600 font-mono mt-1 block">
                        {formErrors.specificAddress}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {shipping.deliveryMethod === 'STUDIO_PICKUP' && (
                <div className="p-4 bg-[#FAF8F5] border border-[#1C1917]/10 text-xs text-[#57534E] space-y-1 font-mono">
                  <div className="font-semibold text-[#1C1917]">Yoki Gifts Atelier Address:</div>
                  <div>Cameroon Street, next to Bole Atlas & Edna Mall, Bole, Addis Ababa</div>
                  <div className="text-[#A87B4F]">Pickup Hours: Monday – Saturday (9:00 AM – 6:30 PM)</div>
                </div>
              )}
            </div>

            {/* 3. Ethiopian Payment Method */}
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-wider font-mono text-[#1C1917] block font-semibold border-b border-[#1C1917]/10 pb-2">
                3. Ethiopian Birr (ETB) Payment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(PAYMENT_METHODS).map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 text-left border transition-all flex flex-col justify-between ${
                      paymentMethod === pm.id
                        ? 'border-[#1C1917] bg-[#FFFFFF] shadow-sm'
                        : 'border-[#1C1917]/10 bg-[#FAF8F5] hover:border-[#1C1917]/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-sans font-medium text-[#1C1917]">
                          {pm.name}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-[#78716C]">
                          {pm.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78716C] mt-1 font-mono leading-relaxed">
                        {pm.shortDesc}
                      </p>
                    </div>

                    {paymentMethod === pm.id && (
                      <div className="mt-3 pt-2 border-t border-[#1C1917]/10 flex items-center gap-1 text-[10px] font-mono font-medium text-[#1C1917]">
                        <Check className="w-3 h-3" />
                        <span>Selected Payment</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Details Panel */}
              <div className="bg-[#FAF8F5] border border-[#1C1917]/10 p-5 mt-3">
                {paymentMethod === 'TELEBIRR' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1C1917]">
                      <Smartphone className="w-4 h-4 text-[#A87B4F]" />
                      <span>Telebirr Instant Checkout</span>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      Enter your Telebirr registered phone number below. An instant payment request will be sent to your phone for <strong className="font-mono">{total.toLocaleString()} ETB</strong>.
                    </p>
                    <div className="max-w-xs">
                      <span className="text-[11px] text-[#78716C] font-mono block mb-1">Telebirr Mobile Number</span>
                      <input
                        type="text"
                        value={telebirrPhone}
                        onChange={(e) => setTelebirrPhone(e.target.value)}
                        placeholder="0911234567"
                        className="w-full px-3 py-2 bg-white border border-[#1C1917]/20 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'CBE_BIRR' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1C1917]">
                      <Building2 className="w-4 h-4 text-[#A87B4F]" />
                      <span>Commercial Bank of Ethiopia (CBE)</span>
                    </div>
                    <div className="p-3 bg-white border border-[#1C1917]/10 text-xs font-mono space-y-1">
                      <div><strong className="text-[#1C1917]">Account Name:</strong> Yoki Gifts Photobook Atelier</div>
                      <div><strong className="text-[#1C1917]">CBE Account Number:</strong> 1000348291048</div>
                      <div><strong className="text-[#1C1917]">Branch:</strong> Bole Medhanialem Branch</div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="font-semibold text-[#1C1917]">Bank Transfer Accounts:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-white border border-[#1C1917]/10">
                        <strong>Awash Bank:</strong> 01428391204400 (Yoki Gifts)
                      </div>
                      <div className="p-2.5 bg-white border border-[#1C1917]/10">
                        <strong>Dashen Bank:</strong> 7819024810011 (Yoki Gifts)
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'CASH_ON_DELIVERY' && (
                  <div className="space-y-1.5 text-xs text-[#57534E]">
                    <div className="font-mono font-semibold text-[#1C1917]">Cash on Handover in Addis Ababa:</div>
                    <p>
                      Inspect your physical book upon courier handover before cash payment of <strong className="font-mono text-[#1C1917]">{total.toLocaleString()} ETB</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Print Shop Dispatch Notice */}
            <div className="p-4 bg-white border border-[#1C1917]/15 flex items-start gap-3 text-xs font-mono">
              <Sparkles className="w-4 h-4 text-[#A87B4F] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1C1917] block">Commercial Print Partner Routing:</strong>
                <span className="text-[#57534E]">
                  This order will be automatically dispatched to <strong className="text-[#1C1917]">Bole Fine Art Press & Atelier</strong> for pre-press verification, 12-color archival giclée printing, and hand-binding.
                </span>
              </div>
            </div>

            {/* Pre-Order Complete Book Proof Inspection Banner */}
            <div className={`p-4 bg-white border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-all ${
              isProofApproved ? 'border-emerald-500/30 bg-emerald-50/20' : 'border-[#1C1917]/25 bg-amber-50/20'
            }`}>
              <div className="flex items-start gap-3">
                <BookOpen className={`w-5 h-5 shrink-0 mt-0.5 ${isProofApproved ? 'text-emerald-700' : 'text-[#A87B4F]'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-mono uppercase text-[#1C1917]">
                      Pre-Order Book Proof Inspection:
                    </strong>
                    {isProofApproved ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold rounded-xs">
                        ✓ Proof Inspected & Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-mono font-bold rounded-xs animate-pulse">
                        Required Before Order
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#78716C] font-mono mt-0.5">
                    {isProofApproved
                      ? 'You have approved all book pages, cover debossing, and dedication plate.'
                      : `You must inspect all ${config.pageCount} pages and cover debossing before placing your order.`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProofModalOpen(true)}
                className={`px-4 py-2 text-xs font-mono uppercase transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-xs ${
                  isProofApproved
                    ? 'bg-white border border-[#1C1917]/20 text-[#1C1917] hover:bg-[#FAF8F5]'
                    : 'bg-[#1C1917] text-white hover:bg-[#2C2825]'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isProofApproved ? 'text-[#A87B4F]' : 'text-[#D4AF37]'}`} />
                <span>{isProofApproved ? 'Re-inspect All Pages' : 'Inspect All Pages Now'}</span>
              </button>
            </div>

            {/* Submit Order Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 py-4 text-xs uppercase tracking-wider font-semibold transition-all shadow-md disabled:opacity-50 ${
                  isProofApproved
                    ? 'text-white bg-[#1C1917] hover:bg-[#2C2825]'
                    : 'text-[#1C1917] bg-[#D4AF37] hover:bg-[#E5C158]'
                }`}
              >
                {isSubmitting ? (
                  <span>Dispatching Order to Print Partner Atelier...</span>
                ) : isProofApproved ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize & Place Order · {total.toLocaleString()} ETB</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 text-[#1C1917]" />
                    <span>Review Complete Book Proof Before Order · {total.toLocaleString()} ETB</span>
                  </>
                )}
              </button>
              <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-[#78716C] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A87B4F]" />
                <span>100% Archival Craft Guarantee · Verified Addis Atelier</span>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Contiguous Purchase Summary Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="text-xs uppercase tracking-widest text-[#78716C] font-mono">
            Order Review (ETB)
          </div>

          <div className="bg-[#FFFFFF] border border-[#1C1917]/10 p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Book Preview Lockup */}
            <div className="flex gap-4 items-center border-b border-[#1C1917]/10 pb-6">
              <div
                className="w-16 h-20 shadow-md border border-black/15 flex flex-col justify-between p-1.5 flex-shrink-0"
                style={{ backgroundColor: colorInfo.hex }}
              >
                <span className="text-[6px] font-mono text-center block" style={{ color: foilInfo.previewColor }}>
                  YOKI
                </span>
                <span className="text-[7px] font-sans text-center uppercase tracking-tighter truncate block" style={{ color: foilInfo.previewColor }}>
                  {config.title || 'TITLE'}
                </span>
                <span className="text-[5px] font-mono text-center block" style={{ color: foilInfo.previewColor }}>
                  {config.size === 'A4_HARDCOVER' ? 'A4' : 'A5'}
                </span>
              </div>

              <div>
                <h3 className="font-sans text-base text-[#1C1917]">
                  {config.title || 'Custom Photobook'}
                </h3>
                <p className="text-xs text-[#78716C] font-mono mt-0.5">
                  {sizeInfo.name} · {config.pageCount} Pages
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#A8A29E] font-mono mt-1">
                  <span>{photos.length} photos</span>
                  <span aria-hidden="true">·</span>
                  <span>{colorInfo.name}</span>
                </div>
              </div>
            </div>

            {/* In-Book Media Customizations Badge */}
            {(config.message?.enabled || config.qrMedia?.enabled) && (
              <div className="bg-[#FAF8F5] p-3 border border-[#1C1917]/10 text-xs font-mono space-y-1">
                <span className="text-[10px] uppercase text-[#A87B4F] block font-semibold">
                  Custom Printable Elements:
                </span>
                {config.message?.enabled && (
                  <div className="flex items-center gap-1.5 text-[#1C1917]">
                    <FileText className="w-3 h-3" />
                    <span>In-Book Dedication: "{config.message.title}"</span>
                  </div>
                )}
                {config.qrMedia?.enabled && (
                  <div className="flex items-center gap-1.5 text-[#1C1917]">
                    <QrCode className="w-3 h-3 text-[#A87B4F]" />
                    <span>Scannable {config.qrMedia.mediaType === 'VIDEO' ? 'Video' : 'Voice'} QR Code</span>
                  </div>
                )}
              </div>
            )}

            {/* Itemized Price Breakdown */}
            <div className="space-y-3 text-xs font-mono text-[#57534E]">
              <div className="flex justify-between items-center">
                <span>Base Format ({sizeInfo.name})</span>
                <span className="tabular-nums text-[#1C1917]">{basePrice.toLocaleString()} ETB</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Archival Paper ({paperInfo.name})</span>
                <span className="tabular-nums text-[#1C1917]">
                  {paperAddon === 0 ? 'Included' : `+${paperAddon.toLocaleString()} ETB`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Page Capacity ({config.pageCount} Pages)</span>
                <span className="tabular-nums text-[#1C1917]">
                  {pagesAddon === 0 ? 'Included' : `+${pagesAddon.toLocaleString()} ETB`}
                </span>
              </div>

              {config.includeGiftBox && (
                <div className="flex justify-between items-center">
                  <span>Luxury Gift Box & Seal</span>
                  <span className="tabular-nums text-[#1C1917]">+{giftBoxAddon.toLocaleString()} ETB</span>
                </div>
              )}

              <div className="border-t border-[#1C1917]/10 pt-3 flex justify-between items-center font-medium">
                <span className="text-[#1C1917]">Subtotal</span>
                <span className="tabular-nums text-[#1C1917] text-sm">{subtotal.toLocaleString()} ETB</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Shipping ({deliveryInfo.name})</span>
                <span className="tabular-nums text-[#1C1917]">
                  {shippingFee === 0 ? 'Free' : `+${shippingFee.toLocaleString()} ETB`}
                </span>
              </div>

              <div className="border-t-2 border-[#1C1917] pt-4 flex justify-between items-baseline">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-mono block">
                    Total Due
                  </span>
                  <span className="text-[10px] text-[#A8A29E] font-mono">
                    All Ethiopian VAT & print fees included
                  </span>
                </div>
                <div className="text-2xl font-sans font-medium text-[#1C1917] font-mono tabular-nums">
                  {total.toLocaleString()} ETB
                </div>
              </div>
            </div>

            {/* Selected Cover Thumbnail */}
            {coverPhoto && (
              <div className="border-t border-[#1C1917]/10 pt-4 flex items-center gap-3">
                <img
                  src={coverPhoto.url}
                  alt="Cover selection"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-cover border border-[#1C1917]/10"
                />
                <div className="text-[11px] font-mono text-[#78716C]">
                  <strong className="text-[#1C1917] block">Cover Photo Assigned:</strong>
                  <span className="truncate block max-w-[200px]">{coverPhoto.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Full-Book Proofing Modal (Horizontal Scrollable Strip) */}
      {isProofModalOpen && (
        <FullBookProofModal
          config={config}
          photos={photos}
          onApproveProof={() => {
            setIsProofApproved(true);
            setIsProofModalOpen(false);
          }}
          onClose={() => setIsProofModalOpen(false)}
        />
      )}
    </div>
  );
};
