import React from 'react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'configurator' | 'upload') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#1C1917]/10 bg-[#FAF8F5] text-[#57534E] py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <span className="font-sans text-2xl tracking-tight text-[#1C1917] block">
            Yoki Gifts
          </span>
          <p className="text-xs text-[#78716C] leading-relaxed max-w-sm">
            Bespoke memory books and luxury editorial photobooks inspired by Pixory. Printed on acid-free European fine art papers and hand-bound in natural linen at our atelier in Addis Ababa.
          </p>
          <div className="text-[11px] font-mono text-[#A8A29E] pt-2">
            Cameroon St. · Bole Atlas · Addis Ababa, Ethiopia
          </div>
        </div>

        {/* Collections */}
        <div className="md:col-span-3 space-y-3 text-xs">
          <span className="font-mono uppercase tracking-wider text-[#1C1917] block font-semibold">
            Collections
          </span>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate('configurator')}
                className="hover:text-[#1C1917] transition-colors"
              >
                The Heirloom Hardcover (A4)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('configurator')}
                className="hover:text-[#1C1917] transition-colors"
              >
                The Editorial Magazine (A5)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('configurator')}
                className="hover:text-[#1C1917] transition-colors"
              >
                The Voyage Travel Collection
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('upload')}
                className="hover:text-[#1C1917] transition-colors"
              >
                Photo Curation Studio
              </button>
            </li>
          </ul>
        </div>

        {/* Paper & Craft */}
        <div className="md:col-span-4 space-y-3 text-xs">
          <span className="font-mono uppercase tracking-wider text-[#1C1917] block font-semibold">
            Paper & Atelier Standards
          </span>
          <div className="space-y-1.5 text-[#78716C]">
            <p>100% Acid-free archival cotton papers (200 – 260 gsm)</p>
            <p>Smyth-sewn 180° true layflat bookbinding</p>
            <p>Individual foil heat debossing on European cloth</p>
            <p>Telebirr, CBE Birr & Dedicated Addis Ababa delivery</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-[#1C1917]/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#A8A29E] gap-4">
        <div>
          &copy; {new Date().getFullYear()} Yoki Gifts. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Privacy & Archival Policy</span>
          <span aria-hidden="true">·</span>
          <span>Delivery Terms (ETB)</span>
          <span aria-hidden="true">·</span>
          <span>Bole Studio Atelier</span>
        </div>
      </div>
    </footer>
  );
};
