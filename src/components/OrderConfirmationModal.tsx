import React from 'react';
import { Check, ShieldCheck, Printer, ArrowRight, Package, Sparkles, Truck } from 'lucide-react';
import { PlacedOrder } from '../types';

interface OrderConfirmationModalProps {
  order: PlacedOrder;
  onClose: () => void;
  onCreateNewBook: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onCreateNewBook,
  onTrackOrder
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-2xl w-full p-8 sm:p-10 shadow-2xl relative my-8">
        {/* Header Lockup */}
        <div className="text-center space-y-3 pb-6 border-b border-[#1C1917]/10">
          <div className="w-12 h-12 rounded-full bg-[#1C1917] text-white flex items-center justify-center mx-auto shadow-md">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="text-xs uppercase font-mono tracking-widest text-[#A87B4F]">
            Order Confirmed & Received
          </div>

          <h2 className="text-3xl font-sans text-[#1C1917] font-light">
            Thank you, {order.shipping.fullName}
          </h2>

          <p className="text-sm text-[#78716C] max-w-md mx-auto">
            Your photobook has entered the pre-press queue at our Bole atelier. Order tracking reference: <span className="font-mono font-bold text-[#1C1917]">{order.orderId}</span>
          </p>
        </div>

        {/* Production Steps Timeline */}
        <div className="py-6 border-b border-[#1C1917]/10">
          <span className="text-xs uppercase tracking-wider font-mono text-[#78716C] block mb-4">
            Print Atelier Production Schedule
          </span>

          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center mx-auto text-[10px]">
                1
              </div>
              <span className="text-[#1C1917] font-medium block">Pre-Press</span>
              <span className="text-[10px] text-[#A87B4F]">In Progress</span>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#EFECE6] text-[#78716C] flex items-center justify-center mx-auto text-[10px]">
                2
              </div>
              <span className="text-[#78716C] block">Giclée Print</span>
              <span className="text-[10px] text-[#A8A29E]">Day 2</span>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#EFECE6] text-[#78716C] flex items-center justify-center mx-auto text-[10px]">
                3
              </div>
              <span className="text-[#78716C] block">Linen Binding</span>
              <span className="text-[10px] text-[#A8A29E]">Day 3</span>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#EFECE6] text-[#78716C] flex items-center justify-center mx-auto text-[10px]">
                4
              </div>
              <span className="text-[#78716C] block">Handover</span>
              <span className="text-[10px] text-[#A8A29E]">Day 4-5</span>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="py-6 border-b border-[#1C1917]/10 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[#78716C] block">Book Title & Spec:</span>
              <strong className="text-[#1C1917] font-sans text-sm block">
                {order.config.title}
              </strong>
              <span className="text-[#57534E]">
                {order.config.size === 'A4_HARDCOVER' ? 'A4 Hardcover' : 'A5 Magazine'} · {order.config.pageCount} Pages ({order.photos.length} photos)
              </span>
            </div>

            <div>
              <span className="text-[#78716C] block">Delivery Coordinate:</span>
              <strong className="text-[#1C1917] block">
                {order.shipping.subCity}
              </strong>
              <span className="text-[#57534E] truncate block">
                {order.shipping.specificAddress}
              </span>
            </div>

            <div>
              <span className="text-[#78716C] block">Payment Gateway:</span>
              <strong className="text-[#1C1917] block">
                {order.paymentMethod.replace('_', ' ')}
              </strong>
              <span className="text-[#A87B4F]">
                {order.paymentStatus === 'PAID' ? 'Payment Verified' : 'Cash upon Delivery'}
              </span>
            </div>

            <div>
              <span className="text-[#78716C] block">Total Amount:</span>
              <strong className="text-base text-[#1C1917] tabular-nums block font-sans">
                {order.pricing.total.toLocaleString()} ETB
              </strong>
              <span className="text-[#A8A29E] text-[10px]">VAT Included</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#1C1917] bg-[#EFECE6] hover:bg-[#E5E0D8] border border-[#1C1917]/10 transition-colors justify-center flex-1 sm:flex-initial"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.orderId);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#1C1917] bg-white hover:bg-[#FAF8F5] border border-[#1C1917]/20 transition-colors justify-center flex-1 sm:flex-initial"
            >
              <Truck className="w-3.5 h-3.5 text-[#A87B4F]" />
              <span>Track Live Status</span>
            </button>
          </div>

          <button
            onClick={onCreateNewBook}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#2C2825] transition-colors w-full sm:w-auto justify-center"
          >
            <span>Create Another Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
