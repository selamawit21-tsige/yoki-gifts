import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Printer,
  Users,
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react';
import { PlacedOrder, PrintProvider, OrderStatus, BookQRMedia } from '../types';

interface AdminDashboardProps {
  orders: PlacedOrder[];
  printers: PrintProvider[];
  onReassignPrinter: (orderId: string, newPrinterId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onPreviewQR: (qrMedia: BookQRMedia) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  printers,
  onReassignPrinter,
  onUpdateOrderStatus,
  onPreviewQR
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'printers' | 'customers'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);

  // Financial calculations in ETB
  const totalGMV = orders.reduce((sum, o) => sum + o.pricing.total, 0);
  const platformRevenue = Math.round(totalGMV * 0.3); // 30% platform margin
  const printPartnersPayout = Math.round(totalGMV * 0.7); // 70% printer share

  const filteredOrders = orders.filter(o =>
    o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shipping.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.config.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shipping.subCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Extract unique customers
  const customersMap = new Map<string, {
    name: string;
    phone: string;
    email: string;
    subCity: string;
    totalOrders: number;
    totalSpentETB: number;
  }>();

  orders.forEach(o => {
    const key = o.shipping.phoneNumber || o.shipping.fullName;
    const existing = customersMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpentETB += o.pricing.total;
    } else {
      customersMap.set(key, {
        name: o.shipping.fullName,
        phone: o.shipping.phoneNumber,
        email: o.shipping.email || 'N/A',
        subCity: o.shipping.subCity,
        totalOrders: 1,
        totalSpentETB: o.pricing.total
      });
    }
  });

  const customersList = Array.from(customersMap.values());

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Admin Header */}
      <div className="border-b border-[#1C1917]/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A87B4F]">
            <ShieldCheck className="w-4 h-4" />
            <span>Atelier Central Administration</span>
          </div>
          <h1 className="text-3xl font-sans text-[#1C1917] font-normal mt-1">
            Platform Operations & Financial Ledger
          </h1>
          <p className="text-xs text-[#78716C] font-mono">
            Managing customer photobook orders, commercial print partner shops, and Ethiopian Birr (ETB) distributions.
          </p>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex items-center bg-[#EFECE6] p-1 border border-[#1C1917]/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-mono transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-[#1C1917] shadow-sm font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('printers')}
            className={`px-4 py-2 text-xs font-mono transition-colors ${
              activeTab === 'printers'
                ? 'bg-white text-[#1C1917] shadow-sm font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Print Providers ({printers.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 text-xs font-mono transition-colors ${
              activeTab === 'customers'
                ? 'bg-white text-[#1C1917] shadow-sm font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Customer Directory ({customersList.length})
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-[#1C1917]/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block">
            Total Gross Merchandise (ETB)
          </span>
          <div className="text-2xl font-sans font-medium text-[#1C1917] tabular-nums mt-1 font-mono">
            {totalGMV.toLocaleString()} ETB
          </div>
          <span className="text-[11px] text-[#A87B4F] font-mono block mt-1">
            {orders.length} total customer orders
          </span>
        </div>

        <div className="bg-white p-5 border border-[#1C1917]/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block">
            Platform Net Margin (30%)
          </span>
          <div className="text-2xl font-sans font-medium text-[#1C1917] tabular-nums mt-1 font-mono">
            {platformRevenue.toLocaleString()} ETB
          </div>
          <span className="text-[11px] text-emerald-700 font-mono block mt-1">
            Yoki Gifts Atelier Retained
          </span>
        </div>

        <div className="bg-white p-5 border border-[#1C1917]/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block">
            Printer Partners Share (70%)
          </span>
          <div className="text-2xl font-sans font-medium text-[#1C1917] tabular-nums mt-1 font-mono">
            {printPartnersPayout.toLocaleString()} ETB
          </div>
          <span className="text-[11px] text-[#78716C] font-mono block mt-1">
            Disbursed across Addis print labs
          </span>
        </div>

        <div className="bg-white p-5 border border-[#1C1917]/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] block">
            Partner Print Capacity
          </span>
          <div className="text-2xl font-sans font-medium text-[#1C1917] tabular-nums mt-1">
            {printers.reduce((acc, p) => acc + p.capacityPerDay, 0)} Books / Day
          </div>
          <span className="text-[11px] text-[#78716C] font-mono block mt-1">
            Across 3 certified Addis facilities
          </span>
        </div>
      </div>

      {/* TAB 1: ALL ORDERS LEDGER */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-[#1C1917]/10">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, customers, or book titles..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#1C1917]/15 text-xs font-mono focus:outline-none focus:border-[#1C1917]"
              />
            </div>
            <div className="text-xs font-mono text-[#78716C]">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>

          <div className="bg-white border border-[#1C1917]/10 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAF8F5] border-b border-[#1C1917]/10 text-[#78716C] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Book Title & Spec</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Assigned Print Partner</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total (ETB)</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]/5">
                {filteredOrders.map((order) => {
                  const assignedPrinter = printers.find(p => p.id === order.assignedPrinterId);

                  return (
                    <tr key={order.orderId} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-4">
                        <strong className="text-[#1C1917] block">{order.orderId}</strong>
                        <span className="text-[11px] text-[#78716C]">{order.createdAt}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-sans text-sm text-[#1C1917] block font-medium">
                          {order.config.title}
                        </span>
                        <span className="text-[11px] text-[#78716C]">
                          {order.config.size === 'A4_HARDCOVER' ? 'A4 Hardcover' : 'A5 Magazine'} · {order.config.pageCount}p ({order.photos.length} photos)
                        </span>
                        {order.config.qrMedia?.enabled && (
                          <span className="text-[10px] text-[#A87B4F] block">
                            QR Media: {order.config.qrMedia.title}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="text-[#1C1917] block font-medium">{order.shipping.fullName}</span>
                        <span className="text-[11px] text-[#78716C]">{order.shipping.phoneNumber}</span>
                        <div className="text-[10px] text-[#A8A29E] truncate max-w-[150px]">
                          {order.shipping.subCity}
                        </div>
                      </td>

                      <td className="p-4">
                        <select
                          value={order.assignedPrinterId}
                          onChange={(e) => onReassignPrinter(order.orderId, e.target.value)}
                          className="bg-white border border-[#1C1917]/20 p-1.5 text-xs text-[#1C1917] focus:outline-none"
                        >
                          {printers.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.orderId, e.target.value as OrderStatus)}
                          className="bg-white border border-[#1C1917]/20 p-1.5 text-xs text-[#1C1917] focus:outline-none font-semibold"
                        >
                          <option value="NEW_ORDER">New Order</option>
                          <option value="PRE_PRESS">Pre-Press</option>
                          <option value="PRINTING">Printing</option>
                          <option value="BOUND">Bound</option>
                          <option value="DISPATCHED">Dispatched</option>
                          <option value="DELIVERED">Delivered</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <strong className="text-[#1C1917] tabular-nums block">
                          {order.pricing.total.toLocaleString()} ETB
                        </strong>
                        <span className="text-[10px] text-emerald-700">
                          {order.paymentMethod.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 bg-[#1C1917] text-white hover:bg-[#2C2825] transition-colors rounded-sm text-xs"
                          title="Inspect Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRINT PROVIDERS MANAGEMENT */}
      {activeTab === 'printers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {printers.map((printer) => {
            const activeOrders = orders.filter(o => o.assignedPrinterId === printer.id && o.status !== 'DELIVERED');
            const totalDisbursed = orders
              .filter(o => o.assignedPrinterId === printer.id && o.paymentStatus === 'PAID')
              .reduce((sum, o) => sum + (o.pricing.subtotal * 0.7), 0);

            return (
              <div
                key={printer.id}
                className="bg-white border border-[#1C1917]/15 p-6 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A87B4F]">
                        Certified Print Lab
                      </span>
                      <h3 className="font-sans text-xl text-[#1C1917] mt-1">
                        {printer.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold bg-[#FAF8F5] border border-[#1C1917]/10 px-2 py-1">
                      ★ {printer.rating}
                    </span>
                  </div>

                  <p className="text-xs text-[#57534E] mt-2 font-mono">
                    Specialty: {printer.specialty}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#1C1917]/10 space-y-2 text-xs font-mono text-[#78716C]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#A87B4F]" />
                      <span>{printer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#A87B4F]" />
                      <span>{printer.phone} ({printer.contactPerson})</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 bg-[#FAF8F5] p-3 border border-[#1C1917]/10 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[#78716C] block">Active In Queue</span>
                      <strong className="text-[#1C1917] text-base">{activeOrders.length} Jobs</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C] block">Daily Capacity</span>
                      <strong className="text-[#1C1917] text-base">{printer.capacityPerDay} Books/day</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1C1917]/10 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#78716C] block">Total Disbursed</span>
                    <strong className="text-[#1C1917] tabular-nums font-semibold">
                      {Math.round(totalDisbursed).toLocaleString()} ETB
                    </strong>
                  </div>

                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Active Partner
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: CUSTOMER DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="bg-white border border-[#1C1917]/10 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FAF8F5] border-b border-[#1C1917]/10 text-[#78716C] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Email</th>
                <th className="p-4">Addis Sub-City / Region</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4 text-right">Lifetime Spent (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1917]/5">
              {customersList.map((cust, idx) => (
                <tr key={idx} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="p-4 font-sans text-sm font-medium text-[#1C1917]">
                    {cust.name}
                  </td>
                  <td className="p-4 text-[#1C1917]">{cust.phone}</td>
                  <td className="p-4 text-[#78716C]">{cust.email}</td>
                  <td className="p-4 text-[#78716C]">{cust.subCity}</td>
                  <td className="p-4 text-[#1C1917] font-semibold">{cust.totalOrders} photobooks</td>
                  <td className="p-4 text-right font-semibold text-[#1C1917] tabular-nums">
                    {cust.totalSpentETB.toLocaleString()} ETB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal for Admin */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex justify-between items-start border-b border-[#1C1917]/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#A87B4F]">Admin Inspection</span>
                <h3 className="font-sans text-2xl text-[#1C1917]">{selectedOrder.config.title}</h3>
                <span className="text-xs font-mono text-[#78716C]">Order {selectedOrder.orderId}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-xs font-mono uppercase text-[#78716C]">
                Close ✕
              </button>
            </div>

            <div className="py-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 bg-white p-4 border border-[#1C1917]/10">
                <div>
                  <span className="text-[#78716C] block">Customer:</span>
                  <strong className="text-[#1C1917]">{selectedOrder.shipping.fullName} ({selectedOrder.shipping.phoneNumber})</strong>
                </div>
                <div>
                  <span className="text-[#78716C] block">Payment Gateway:</span>
                  <strong className="text-[#1C1917]">{selectedOrder.paymentMethod.replace('_', ' ')} · {selectedOrder.pricing.total.toLocaleString()} ETB</strong>
                </div>
                <div>
                  <span className="text-[#78716C] block">Assigned Print Lab:</span>
                  <strong className="text-[#1C1917]">
                    {printers.find(p => p.id === selectedOrder.assignedPrinterId)?.name || 'Unassigned'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#78716C] block">Delivery Location:</span>
                  <strong className="text-[#1C1917]">{selectedOrder.shipping.subCity}</strong>
                </div>
              </div>

              {selectedOrder.config.qrMedia?.enabled && (
                <div className="p-4 bg-white border border-[#1C1917]/10 flex items-center justify-between">
                  <div>
                    <span className="text-[#78716C] block">QR Code Media Attached:</span>
                    <strong className="text-[#1C1917]">{selectedOrder.config.qrMedia.title}</strong>
                  </div>
                  <button
                    onClick={() => onPreviewQR(selectedOrder.config.qrMedia!)}
                    className="px-3 py-1.5 bg-[#1C1917] text-white text-xs font-mono"
                  >
                    Test QR Audio/Video
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#1C1917]/10 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#1C1917] text-white text-xs font-mono uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
