import React from 'react';
import { ShoppingBag, Sparkles, Printer, ShieldCheck, User, Truck } from 'lucide-react';
import { AppUserRole } from '../types';

interface NavbarProps {
  activeRole: AppUserRole;
  onChangeRole: (role: AppUserRole) => void;
  activeView: 'landing' | 'configurator' | 'upload' | 'checkout' | 'confirmation';
  onNavigate: (view: 'landing' | 'configurator' | 'upload' | 'checkout') => void;
  photosCount: number;
  totalETB: number;
  activeOrdersCount: number;
  onOpenTrackOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onChangeRole,
  activeView,
  onNavigate,
  photosCount,
  totalETB,
  activeOrdersCount,
  onOpenTrackOrder
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#1C1917]/10 transition-colors">
      {/* Role Switcher Sub-Bar (Clean Unboxed Layout) */}
      <div className="bg-[#EFECE6] border-b border-[#1C1917]/10 px-6 py-1.5 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#78716C]">
            <span className="uppercase tracking-wider text-[10px]">Workspace Role:</span>
            <div className="flex items-center bg-white/70 p-0.5 border border-[#1C1917]/10">
              <button
                onClick={() => onChangeRole('customer')}
                className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors ${
                  activeRole === 'customer'
                    ? 'bg-[#1C1917] text-white font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <User className="w-3 h-3" />
                <span>Customer Atelier</span>
              </button>

              <button
                onClick={() => onChangeRole('printer')}
                className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors ${
                  activeRole === 'printer'
                    ? 'bg-[#1C1917] text-white font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <Printer className="w-3 h-3" />
                <span>Print Partner Portal</span>
                <span className="font-mono text-[10px] ml-0.5 bg-amber-200 text-amber-900 px-1 py-0.2 rounded-sm">
                  {activeOrdersCount}
                </span>
              </button>

              <button
                onClick={() => onChangeRole('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors ${
                  activeRole === 'admin'
                    ? 'bg-[#1C1917] text-white font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Console</span>
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#78716C]">
            <button
              onClick={onOpenTrackOrder}
              className="flex items-center gap-1 text-[#1C1917] hover:underline font-semibold"
            >
              <Truck className="w-3 h-3 text-[#A87B4F]" />
              <span>Track Order</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Ethiopian Birr (ETB)</span>
            <span aria-hidden="true">·</span>
            <span>Addis Ababa Atelier</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            if (activeRole !== 'customer') onChangeRole('customer');
            onNavigate('landing');
          }}
          className="text-2xl font-sans tracking-tight font-light text-[#1C1917] hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917]"
        >
          Yoki Gifts
        </button>

        {/* Zone 2: Navigation links according to active role */}
        {activeRole === 'customer' ? (
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-[#78716C]">
            <button
              onClick={() => onNavigate('landing')}
              className={`transition-colors hover:text-[#1C1917] ${
                activeView === 'landing' ? 'text-[#1C1917] font-medium underline underline-offset-8 decoration-1 decoration-[#1C1917]' : ''
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => onNavigate('configurator')}
              className={`transition-colors hover:text-[#1C1917] ${
                activeView === 'configurator' ? 'text-[#1C1917] font-medium underline underline-offset-8 decoration-1 decoration-[#1C1917]' : ''
              }`}
            >
              Configurator
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className={`transition-colors hover:text-[#1C1917] ${
                activeView === 'upload' ? 'text-[#1C1917] font-medium underline underline-offset-8 decoration-1 decoration-[#1C1917]' : ''
              }`}
            >
              Photo Studio
            </button>
            <button
              onClick={() => {
                const craftEl = document.getElementById('craft-section');
                if (craftEl) {
                  craftEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('craft-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="transition-colors hover:text-[#1C1917]"
            >
              Paper & Craft
            </button>
            <button
              onClick={onOpenTrackOrder}
              className="transition-colors hover:text-[#1C1917] flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5 text-[#A87B4F]" />
              <span>Track Order</span>
            </button>
          </nav>
        ) : activeRole === 'printer' ? (
          <div className="hidden md:flex items-center gap-3 text-xs font-mono text-[#78716C]">
            <span className="text-[#1C1917] font-semibold">Print Partner: Bole Fine Art Press</span>
            <span aria-hidden="true">·</span>
            <span>Commercial Production Queue</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3 text-xs font-mono text-[#78716C]">
            <span className="text-[#1C1917] font-semibold">Central Admin: Yoki Headquarters</span>
            <span aria-hidden="true">·</span>
            <span>Platform Financial & Partner Oversight</span>
          </div>
        )}

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-4">
          {activeRole === 'customer' ? (
            <>
              {activeView !== 'checkout' && (
                <button
                  onClick={() => onNavigate('checkout')}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-wider font-medium text-[#1C1917] bg-[#EFECE6] hover:bg-[#E5E0D8] border border-[#1C1917]/10 transition-colors whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Cart</span>
                  <span className="font-mono tabular-nums text-[#78716C]">({photosCount})</span>
                  <span className="font-mono tabular-nums font-semibold ml-1">{totalETB.toLocaleString()} ETB</span>
                </button>
              )}

              {activeView === 'landing' ? (
                <button
                  onClick={() => onNavigate('configurator')}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-white bg-[#1C1917] hover:bg-[#2C2825] transition-colors whitespace-nowrap"
                >
                  Create Book
                </button>
              ) : activeView === 'configurator' ? (
                <button
                  onClick={() => onNavigate('upload')}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-white bg-[#1C1917] hover:bg-[#2C2825] transition-colors whitespace-nowrap"
                >
                  Upload Photos
                </button>
              ) : activeView === 'upload' ? (
                <button
                  onClick={() => onNavigate('checkout')}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-white bg-[#1C1917] hover:bg-[#2C2825] transition-colors whitespace-nowrap"
                >
                  Checkout
                </button>
              ) : null}
            </>
          ) : (
            <button
              onClick={() => onChangeRole('customer')}
              className="px-4 py-2 text-xs uppercase tracking-wider font-mono text-[#1C1917] bg-white border border-[#1C1917]/20 hover:bg-[#FAF8F5] transition-colors whitespace-nowrap"
            >
              Switch to Customer View
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
