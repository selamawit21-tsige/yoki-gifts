import React, { useState } from 'react';
import {
  X,
  Search,
  Package,
  CheckCircle,
  Clock,
  Printer,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  Phone,
  QrCode,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PlacedOrder, PrintProvider, OrderStatus, BookQRMedia } from '../types';

interface TrackOrderModalProps {
  orders: PlacedOrder[];
  printers: PrintProvider[];
  onClose: () => void;
  onPreviewQR: (qrMedia: BookQRMedia) => void;
  initialOrderId?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  orders,
  printers,
  onClose,
  onPreviewQR,
  initialOrderId
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(() => {
    if (initialOrderId) {
      return orders.find(o => o.orderId.toLowerCase() === initialOrderId.toLowerCase()) || orders[0] || null;
    }
    return orders[0] || null;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      o =>
        o.orderId.toLowerCase() === query ||
        o.orderId.toLowerCase().includes(query) ||
        o.shipping.phoneNumber.includes(query) ||
        o.shipping.fullName.toLowerCase().includes(query)
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      alert(`No order found matching "${searchQuery}". Please check your Order ID or phone number.`);
    }
  };

  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'NEW_ORDER':
        return 1;
      case 'PRE_PRESS':
        return 2;
      case 'PRINTING':
        return 3;
      case 'BOUND':
        return 4;
      case 'DISPATCHED':
      case 'DELIVERED':
        return 5;
      default:
        return 1;
    }
  };

  const currentStep = selectedOrder ? getStepProgress(selectedOrder.status) : 1;
  const assignedPrinter = selectedOrder ? printers.find(p => p.id === selectedOrder.assignedPrinterId) : null;

  const steps = [
    { num: 1, title: 'Order Paid', desc: 'Received at atelier' },
    { num: 2, title: 'Pre-Press', desc: 'File & bleed audit' },
    { num: 3, title: 'Giclée Print', desc: 'Pigmented cotton inks' },
    { num: 4, title: 'Hand Binding', desc: 'Smyth-sewn & deboss' },
    { num: 5, title: 'Dispatched', desc: 'Dedicated courier handover' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#78716C] hover:text-[#1C1917] transition-colors"
          title="Close tracking"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pb-6 border-b border-[#1C1917]/10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A87B4F]">
            <Truck className="w-4 h-4" />
            <span>Customer Live Order Tracking</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans text-[#1C1917] font-normal">
            Track Production & Delivery
          </h2>
          <p className="text-xs text-[#78716C] font-mono">
            Check real-time production status, printer pre-press notes, and courier dispatch across Addis Ababa.
          </p>
        </div>

        {/* Search Bar & Quick Select Chips */}
        <div className="py-6 border-b border-[#1C1917]/10 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g., YG-2026-7841) or phone (+251 9...)"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#1C1917]/20 text-xs font-mono focus:outline-none focus:border-[#1C1917]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1C1917] hover:bg-[#2C2825] text-white text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick Select Recent Orders */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#78716C]">
            <span>Recent Orders:</span>
            {orders.slice(0, 4).map((o) => (
              <button
                key={o.orderId}
                type="button"
                onClick={() => {
                  setSelectedOrder(o);
                  setSearchQuery(o.orderId);
                }}
                className={`px-2 py-0.5 border transition-colors ${
                  selectedOrder?.orderId === o.orderId
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white text-[#57534E] border-[#1C1917]/10 hover:border-[#1C1917]/30'
                }`}
              >
                {o.orderId} ({o.shipping.fullName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Order Details Body */}
        {selectedOrder ? (
          <div className="py-6 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-[#1C1917]/10">
              <div>
                <span className="text-xs uppercase font-mono text-[#A87B4F]">Order Reference</span>
                <h3 className="font-sans text-xl text-[#1C1917] font-medium">
                  {selectedOrder.config.title}
                </h3>
                <span className="text-xs font-mono text-[#78716C]">
                  {selectedOrder.orderId} · Placed {selectedOrder.createdAt}
                </span>
              </div>

              <div className="sm:text-right font-mono">
                <span className="text-xs uppercase text-[#78716C] block">Total Amount</span>
                <strong className="text-lg text-[#1C1917] tabular-nums font-sans">
                  {selectedOrder.pricing.total.toLocaleString()} ETB
                </strong>
                <span className="text-[10px] text-emerald-700 block">
                  {selectedOrder.paymentMethod.replace('_', ' ')} · {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>

            {/* 5-Stage Visual Progress Stepper */}
            <div className="space-y-4">
              <span className="text-xs uppercase font-mono tracking-wider text-[#78716C] block">
                Atelier Production Timeline
              </span>

              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {steps.map((st) => {
                  const isDone = st.num < currentStep;
                  const isCurrent = st.num === currentStep;

                  return (
                    <div
                      key={st.num}
                      className={`p-2.5 sm:p-3 border text-center transition-all ${
                        isCurrent
                          ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                          : 'bg-white text-[#A8A29E] border-[#1C1917]/10 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : isCurrent ? (
                          <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
                        ) : (
                          <span className="text-xs font-mono">{st.num}</span>
                        )}
                      </div>
                      <div className="text-[11px] sm:text-xs font-mono font-semibold truncate">
                        {st.title}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono block opacity-80 mt-0.5 truncate">
                        {isCurrent ? 'Active Stage' : isDone ? 'Completed' : st.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Printer Notes & Atelier Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Assigned Print Partner */}
              <div className="bg-white p-4 border border-[#1C1917]/10 space-y-2">
                <span className="text-[10px] uppercase text-[#78716C] block font-semibold">
                  Certified Print Atelier
                </span>
                <div className="font-sans text-base text-[#1C1917]">
                  {assignedPrinter?.name || 'Bole Fine Art Press & Atelier'}
                </div>
                <div className="text-[#57534E] text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A87B4F]" />
                  <span>{assignedPrinter?.location || 'Bole Atlas, Addis Ababa'}</span>
                </div>
                {selectedOrder.printerNotes && (
                  <div className="mt-2 pt-2 border-t border-[#1C1917]/10 text-[#A87B4F]">
                    <strong>Atelier Note:</strong> "{selectedOrder.printerNotes}"
                  </div>
                )}
              </div>

              {/* Delivery & Courier Information */}
              <div className="bg-white p-4 border border-[#1C1917]/10 space-y-2">
                <span className="text-[10px] uppercase text-[#78716C] block font-semibold">
                  Delivery Destination
                </span>
                <div className="text-[#1C1917] font-semibold">
                  {selectedOrder.shipping.fullName} ({selectedOrder.shipping.phoneNumber})
                </div>
                <div className="text-[#57534E] text-[11px]">
                  {selectedOrder.shipping.subCity}
                  <div className="text-[#78716C] truncate">{selectedOrder.shipping.specificAddress}</div>
                </div>

                <div className="mt-2 pt-2 border-t border-[#1C1917]/10 flex justify-between items-center text-[11px]">
                  <span className="text-[#78716C]">Courier Tracking Code:</span>
                  <strong className="text-[#1C1917]">{selectedOrder.trackingCode || 'ASSIGNING-RIDER'}</strong>
                </div>
              </div>
            </div>

            {/* In-Book Media Attached Preview Trigger */}
            {selectedOrder.config.qrMedia?.enabled && (
              <div className="p-4 bg-white border border-[#1C1917]/15 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm bg-[#FAF8F5] border border-[#1C1917]/10 flex items-center justify-center text-[#A87B4F]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-[#1C1917] block">In-Book Video/Audio QR Code Attached:</strong>
                    <span className="text-[#78716C]">{selectedOrder.config.qrMedia.title}</span>
                  </div>
                </div>

                <button
                  onClick={() => onPreviewQR(selectedOrder.config.qrMedia!)}
                  className="px-3 py-1.5 bg-[#1C1917] hover:bg-[#2C2825] text-white text-xs font-mono transition-colors"
                >
                  Test QR Playback
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-mono text-[#78716C]">
            No order selected. Search with your Order ID above.
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#1C1917]/10 flex justify-between items-center text-xs font-mono">
          <span className="text-[#78716C]">Need help? Call Bole Atelier at +251 91 144 8821</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1C1917] text-white hover:bg-[#2C2825]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
