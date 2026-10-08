import React, { useState } from 'react';
import {
  Printer,
  Package,
  Clock,
  CheckCircle,
  Truck,
  ExternalLink,
  Eye,
  FileText,
  QrCode,
  Download,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { PlacedOrder, PrintProvider, OrderStatus, BookQRMedia } from '../types';

interface PrinterDashboardProps {
  orders: PlacedOrder[];
  currentPrinter: PrintProvider;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string, tracking?: string) => void;
  onPreviewQR: (qrMedia: BookQRMedia) => void;
}

export const PrinterDashboard: React.FC<PrinterDashboardProps> = ({
  orders,
  currentPrinter,
  onUpdateOrderStatus,
  onPreviewQR
}) => {
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  // Filter orders assigned to this printer (or all if general)
  const printerOrders = orders.filter(o => !o.assignedPrinterId || o.assignedPrinterId === currentPrinter.id);

  const filteredOrders = printerOrders.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.config.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping.subCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'NEW_ORDER':
        return { label: 'New Order', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'PRE_PRESS':
        return { label: 'Pre-Press File Audit', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'PRINTING':
        return { label: 'Giclée Printing', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'BOUND':
        return { label: 'Hand Binding & Deboss', bg: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
      case 'DISPATCHED':
        return { label: 'Dispatched to Courier', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'DELIVERED':
        return { label: 'Delivered', bg: 'bg-stone-100 text-stone-900 border-stone-300' };
      default:
        return { label: status, bg: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  const calculateEarningsETB = () => {
    // 70% payout share to the printer partner
    return printerOrders
      .filter(o => o.paymentStatus === 'PAID')
      .reduce((acc, o) => acc + (o.pricing.subtotal * 0.7), 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Printer Portal Header */}
      <div className="bg-[#FAF8F5] border border-[#1C1917]/15 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A87B4F]">
            <Printer className="w-4 h-4" />
            <span>Commercial Print Partner Atelier</span>
          </div>
          <h1 className="text-3xl font-sans text-[#1C1917] font-normal">
            {currentPrinter.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#78716C] font-mono">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {currentPrinter.location}
            </span>
            <span aria-hidden="true">·</span>
            <span>Lead: {currentPrinter.contactPerson}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#1C1917] font-semibold">{currentPrinter.specialty}</span>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 border border-[#1C1917]/10">
          <div className="pr-4 border-r border-[#1C1917]/10">
            <span className="text-[10px] uppercase font-mono text-[#78716C] block">Active Jobs</span>
            <span className="text-xl font-sans text-[#1C1917] font-medium">
              {printerOrders.filter(o => o.status !== 'DELIVERED').length}
            </span>
          </div>

          <div className="pr-4 border-r border-[#1C1917]/10">
            <span className="text-[10px] uppercase font-mono text-[#78716C] block">Completed Runs</span>
            <span className="text-xl font-sans text-[#1C1917] font-medium">
              {currentPrinter.completedOrdersCount}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-[#78716C] block">Partner Payout (70%)</span>
            <span className="text-xl font-sans font-semibold text-[#1C1917] font-mono tabular-nums">
              {Math.round(calculateEarningsETB()).toLocaleString()} ETB
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-[#1C1917]/10">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer, title, or Addis sub-city..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#1C1917]/15 text-xs font-mono focus:outline-none focus:border-[#1C1917]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 border transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-[#FAF8F5] text-[#78716C] border-[#1C1917]/10 hover:text-[#1C1917]'
            }`}
          >
            All ({printerOrders.length})
          </button>
          <button
            onClick={() => setStatusFilter('NEW_ORDER')}
            className={`px-3 py-1.5 border transition-colors ${
              statusFilter === 'NEW_ORDER'
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-[#FAF8F5] text-[#78716C] border-[#1C1917]/10 hover:text-[#1C1917]'
            }`}
          >
            New ({printerOrders.filter(o => o.status === 'NEW_ORDER').length})
          </button>
          <button
            onClick={() => setStatusFilter('PRINTING')}
            className={`px-3 py-1.5 border transition-colors ${
              statusFilter === 'PRINTING'
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-[#FAF8F5] text-[#78716C] border-[#1C1917]/10 hover:text-[#1C1917]'
            }`}
          >
            Printing ({printerOrders.filter(o => o.status === 'PRINTING').length})
          </button>
          <button
            onClick={() => setStatusFilter('DISPATCHED')}
            className={`px-3 py-1.5 border transition-colors ${
              statusFilter === 'DISPATCHED'
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-[#FAF8F5] text-[#78716C] border-[#1C1917]/10 hover:text-[#1C1917]'
            }`}
          >
            Dispatched ({printerOrders.filter(o => o.status === 'DISPATCHED').length})
          </button>
        </div>
      </div>

      {/* Orders Grid / Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#1C1917]/10 p-8 space-y-3">
          <Package className="w-10 h-10 text-[#A8A29E] mx-auto stroke-1" />
          <h3 className="font-sans text-xl text-[#1C1917]">No print jobs found</h3>
          <p className="text-xs text-[#78716C] font-mono">
            New customer orders submitted via checkout will immediately appear in this queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const coverPhoto = order.photos.find(p => p.isCover) || order.photos[0];

            return (
              <div
                key={order.orderId}
                className="bg-white border border-[#1C1917]/15 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#1C1917]/10 pb-3 mb-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#1C1917] block">
                        {order.orderId}
                      </span>
                      <span className="text-[11px] text-[#78716C] font-mono">
                        {order.createdAt}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Book Spec Lockup */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-sans text-lg text-[#1C1917] leading-snug">
                        {order.config.title}
                      </h4>
                      <p className="text-xs text-[#78716C] font-mono mt-0.5">
                        {order.config.size === 'A4_HARDCOVER' ? 'A4 Hardcover Monograph' : 'A5 Softcover Magazine'} · {order.config.pageCount} Pages
                      </p>
                    </div>

                    {/* Visual specs tags */}
                    <div className="bg-[#FAF8F5] p-3 border border-[#1C1917]/10 text-xs font-mono space-y-1.5 text-[#57534E]">
                      <div className="flex justify-between">
                        <span>Paper:</span>
                        <strong className="text-[#1C1917]">{order.config.paperFinish.replace('_', ' ')}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Cover Linen:</span>
                        <strong className="text-[#1C1917]">{order.config.coverColor.replace('_', ' ')} ({order.config.foilType} Foil)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Photo Assets:</span>
                        <strong className="text-[#1C1917]">{order.photos.length} High-Res Files</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Custom Media:</span>
                        <strong className="text-[#A87B4F]">
                          {order.config.qrMedia?.enabled ? 'QR Media Attached' : 'Photos Only'}
                        </strong>
                      </div>
                    </div>

                    {/* Customer Destination */}
                    <div className="text-xs font-mono text-[#78716C] pt-1">
                      <div className="flex items-center gap-1.5 text-[#1C1917]">
                        <MapPin className="w-3.5 h-3.5 text-[#A87B4F]" />
                        <span className="font-semibold">{order.shipping.fullName}</span>
                      </div>
                      <div className="pl-5 text-[11px] text-[#78716C] truncate">
                        {order.shipping.subCity}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-5 mt-5 border-t border-[#1C1917]/10 flex items-center justify-between gap-2">
                  <div className="text-xs font-mono">
                    <span className="text-[10px] text-[#A8A29E] block">Payout</span>
                    <strong className="text-[#1C1917] tabular-nums font-semibold">
                      {Math.round(order.pricing.subtotal * 0.7).toLocaleString()} ETB
                    </strong>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1C1917] hover:bg-[#2C2825] text-white text-xs font-mono transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Job</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Order Job Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-start justify-between border-b border-[#1C1917]/10 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#A87B4F] uppercase">
                  <span>Print Job Inspector</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedOrder.orderId}</span>
                </div>
                <h2 className="text-2xl font-sans text-[#1C1917] mt-1 font-normal">
                  {selectedOrder.config.title}
                </h2>
                <p className="text-xs text-[#78716C] font-mono">
                  Submitted {selectedOrder.createdAt} · Payment: {selectedOrder.paymentMethod.replace('_', ' ')} ({selectedOrder.paymentStatus})
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-mono uppercase text-[#78716C] hover:text-[#1C1917]"
              >
                Close ✕
              </button>
            </div>

            {/* Detailed Print Specifications Sheet */}
            <div className="py-6 space-y-6 max-h-[65vh] overflow-y-auto pr-2">
              {/* 1. Technical Print Package */}
              <div className="bg-white p-5 border border-[#1C1917]/10 space-y-3">
                <span className="text-xs uppercase font-mono tracking-wider text-[#1C1917] block font-semibold">
                  1. Pre-Press & Atelier Production Specifications
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#78716C] block">Trim Dimensions:</span>
                    <strong className="text-[#1C1917]">
                      {selectedOrder.config.size === 'A4_HARDCOVER' ? '210 × 297 mm (A4)' : '148 × 210 mm (A5)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">Binding Method:</span>
                    <strong className="text-[#1C1917]">
                      {selectedOrder.config.size === 'A4_HARDCOVER' ? 'Smyth-sewn 180° Layflat' : 'Pur-glued Softcover'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">Interior Paper Sheet:</span>
                    <strong className="text-[#1C1917]">{selectedOrder.config.paperFinish.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">Total Spreads / Pages:</span>
                    <strong className="text-[#1C1917]">{selectedOrder.config.pageCount} Pages ({selectedOrder.photos.length} photos)</strong>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">Cloth Wrap Material:</span>
                    <strong className="text-[#1C1917]">{selectedOrder.config.coverColor.replace('_', ' ')} Linen</strong>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">Debossed Title Foil:</span>
                    <strong className="text-[#1C1917]">{selectedOrder.config.foilType} Foil Heat-Stamp</strong>
                  </div>
                </div>

                {selectedOrder.config.includeGiftBox && (
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#A87B4F]/30 text-xs font-mono text-[#A87B4F] flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>Pack in Luxury Rigid Box with Hand-Calligraphed Wax Seal Card</span>
                  </div>
                )}
              </div>

              {/* 2. Customer In-Book Customizations (Message & QR) */}
              {(selectedOrder.config.message?.enabled || selectedOrder.config.qrMedia?.enabled) && (
                <div className="bg-white p-5 border border-[#1C1917]/10 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#1C1917] block font-semibold">
                    2. In-Book Dedication & Scannable Media
                  </span>

                  {selectedOrder.config.message?.enabled && (
                    <div className="p-3 bg-[#FAF8F5] border border-[#1C1917]/10 space-y-1">
                      <div className="text-[10px] uppercase font-mono text-[#A87B4F]">Dedication Text on Page 1:</div>
                      <h4 className="font-sans text-sm text-[#1C1917] font-medium">"{selectedOrder.config.message.title}"</h4>
                      <p className="font-sans italic text-xs text-[#57534E]">"{selectedOrder.config.message.bodyText}"</p>
                      <p className="text-[11px] font-mono text-[#78716C]">— {selectedOrder.config.message.authorSignature}</p>
                    </div>
                  )}

                  {selectedOrder.config.qrMedia?.enabled && (
                    <div className="p-3 bg-[#FAF8F5] border border-[#1C1917]/10 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-mono text-[#A87B4F]">Scannable QR Media Attached:</div>
                        <div className="text-xs font-mono font-semibold text-[#1C1917]">
                          {selectedOrder.config.qrMedia.title} ({selectedOrder.config.qrMedia.mediaType})
                        </div>
                        <div className="text-[11px] font-mono text-[#78716C]">
                          URL: {selectedOrder.config.qrMedia.mediaUrl}
                        </div>
                      </div>

                      <button
                        onClick={() => onPreviewQR(selectedOrder.config.qrMedia!)}
                        className="px-3 py-1.5 bg-[#1C1917] text-white hover:bg-[#2C2825] text-xs font-mono whitespace-nowrap transition-colors"
                      >
                        Verify & Test QR
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. High-Resolution Photo Assets Review */}
              <div className="bg-white p-5 border border-[#1C1917]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#1C1917] block font-semibold">
                    3. High-Resolution Photo File Assets ({selectedOrder.photos.length} files)
                  </span>
                  <button
                    onClick={() => alert(`Simulated batch download of all ${selectedOrder.photos.length} print assets for ${selectedOrder.orderId} (ZIP 42MB)`)}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#1C1917] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Print ZIP</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {selectedOrder.photos.map((photo, i) => (
                    <div key={photo.id} className="aspect-square bg-[#EFECE6] border relative group overflow-hidden">
                      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1">
                        #{i + 1}
                      </div>
                      {photo.isCover && (
                        <div className="absolute bottom-1 left-1 right-1 bg-[#1C1917] text-white text-[8px] font-mono text-center">
                          COVER
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Customer Delivery Destination */}
              <div className="bg-white p-5 border border-[#1C1917]/10 space-y-2 text-xs font-mono">
                <span className="text-xs uppercase font-mono tracking-wider text-[#1C1917] block font-semibold">
                  4. Handover & Delivery Destination
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#57534E]">
                  <div>
                    <span className="text-[#78716C] block">Recipient:</span>
                    <strong className="text-[#1C1917]">{selectedOrder.shipping.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">Contact Phone:</span>
                    <strong className="text-[#1C1917]">{selectedOrder.shipping.phoneNumber}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#78716C] block">Delivery Location:</span>
                    <strong className="text-[#1C1917]">{selectedOrder.shipping.subCity}</strong>
                    <div>{selectedOrder.shipping.specificAddress}</div>
                  </div>
                </div>
              </div>

              {/* 5. Production Status Update Controls */}
              <div className="p-5 bg-[#FAF8F5] border border-[#1C1917]/20 space-y-3">
                <span className="text-xs uppercase font-mono tracking-wider text-[#1C1917] block font-semibold">
                  5. Advance Print Production Stage
                </span>

                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.orderId, 'PRE_PRESS', 'Pre-press layout verified')}
                    className={`px-3 py-2 border transition-colors ${
                      selectedOrder.status === 'PRE_PRESS'
                        ? 'bg-[#1C1917] text-white font-semibold'
                        : 'bg-white hover:bg-[#EFECE6] text-[#1C1917]'
                    }`}
                  >
                    1. Mark Pre-Press Verified
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.orderId, 'PRINTING', 'Giclée prints sent to Roland Pro')}
                    className={`px-3 py-2 border transition-colors ${
                      selectedOrder.status === 'PRINTING'
                        ? 'bg-[#1C1917] text-white font-semibold'
                        : 'bg-white hover:bg-[#EFECE6] text-[#1C1917]'
                    }`}
                  >
                    2. Mark Printing
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.orderId, 'BOUND', 'Smyth sewn & debossed in atelier')}
                    className={`px-3 py-2 border transition-colors ${
                      selectedOrder.status === 'BOUND'
                        ? 'bg-[#1C1917] text-white font-semibold'
                        : 'bg-white hover:bg-[#EFECE6] text-[#1C1917]'
                    }`}
                  >
                    3. Mark Hand-Bound
                  </button>

                  <button
                    onClick={() => {
                      const code = prompt('Enter courier rider phone or tracking code:', 'ETH-COURIER-' + Math.floor(1000 + Math.random() * 9000));
                      if (code) {
                        onUpdateOrderStatus(selectedOrder.orderId, 'DISPATCHED', 'Handed to Addis dedicated courier', code);
                      }
                    }}
                    className={`px-3 py-2 border transition-colors ${
                      selectedOrder.status === 'DISPATCHED'
                        ? 'bg-[#1C1917] text-white font-semibold'
                        : 'bg-white hover:bg-[#EFECE6] text-[#1C1917]'
                    }`}
                  >
                    4. Dispatch to Courier &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1C1917]/10 flex justify-between items-center text-xs font-mono">
              <span className="text-[#78716C]">Yoki Gifts Print Partner Workflow System</span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#1C1917] text-white hover:bg-[#2C2825]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
