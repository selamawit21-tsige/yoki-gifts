import React from 'react';
import { Video, Mic, QrCode, Play } from 'lucide-react';
import { BookQRMedia } from '../types';

interface PrintableQRBadgeProps {
  qrMedia: BookQRMedia;
  onPreviewMedia: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const PrintableQRBadge: React.FC<PrintableQRBadgeProps> = ({
  qrMedia,
  onPreviewMedia,
  size = 'md'
}) => {
  const isVideo = qrMedia.mediaType === 'VIDEO';

  return (
    <div
      onClick={onPreviewMedia}
      className="cursor-pointer group bg-white p-3.5 border border-[#1C1917]/15 inline-flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all hover:border-[#1C1917]"
      title="Click to simulate scanning this QR code"
    >
      {/* Authentic QR Barcode SVG representation */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white p-1 border border-black/10 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          shapeRendering="crispEdges"
        >
          {/* Background */}
          <rect width="100" height="100" fill="#FFFFFF" />

          {/* Top-Left Corner Position Finder */}
          <rect x="6" y="6" width="28" height="28" fill="#1C1917" />
          <rect x="10" y="10" width="20" height="20" fill="#FFFFFF" />
          <rect x="14" y="14" width="12" height="12" fill="#1C1917" />

          {/* Top-Right Corner Position Finder */}
          <rect x="66" y="6" width="28" height="28" fill="#1C1917" />
          <rect x="70" y="10" width="20" height="20" fill="#FFFFFF" />
          <rect x="74" y="14" width="12" height="12" fill="#1C1917" />

          {/* Bottom-Left Corner Position Finder */}
          <rect x="6" y="66" width="28" height="28" fill="#1C1917" />
          <rect x="10" y="70" width="20" height="20" fill="#FFFFFF" />
          <rect x="14" y="74" width="12" height="12" fill="#1C1917" />

          {/* Simulated Timing and Data Matrix Cells */}
          <rect x="38" y="10" width="6" height="6" fill="#1C1917" />
          <rect x="50" y="10" width="6" height="6" fill="#1C1917" />
          <rect x="38" y="22" width="6" height="6" fill="#1C1917" />
          <rect x="46" y="26" width="6" height="6" fill="#1C1917" />
          <rect x="54" y="22" width="6" height="6" fill="#1C1917" />

          <rect x="10" y="38" width="6" height="6" fill="#1C1917" />
          <rect x="22" y="38" width="6" height="6" fill="#1C1917" />
          <rect x="26" y="46" width="6" height="6" fill="#1C1917" />

          <rect x="38" y="38" width="8" height="8" fill="#1C1917" />
          <rect x="50" y="38" width="6" height="6" fill="#1C1917" />
          <rect x="62" y="38" width="8" height="8" fill="#1C1917" />
          <rect x="74" y="42" width="6" height="6" fill="#1C1917" />
          <rect x="86" y="38" width="6" height="6" fill="#1C1917" />

          <rect x="38" y="50" width="6" height="6" fill="#1C1917" />
          <rect x="48" y="48" width="8" height="8" fill="#1C1917" />
          <rect x="60" y="52" width="6" height="6" fill="#1C1917" />
          <rect x="70" y="50" width="6" height="6" fill="#1C1917" />
          <rect x="82" y="52" width="6" height="6" fill="#1C1917" />

          <rect x="38" y="66" width="6" height="6" fill="#1C1917" />
          <rect x="48" y="66" width="6" height="6" fill="#1C1917" />
          <rect x="60" y="66" width="8" height="8" fill="#1C1917" />
          <rect x="72" y="66" width="6" height="6" fill="#1C1917" />
          <rect x="84" y="70" width="8" height="8" fill="#1C1917" />

          <rect x="38" y="78" width="8" height="8" fill="#1C1917" />
          <rect x="50" y="82" width="6" height="6" fill="#1C1917" />
          <rect x="66" y="78" width="6" height="6" fill="#1C1917" />
          <rect x="78" y="82" width="6" height="6" fill="#1C1917" />

          {/* Center Emblem Disc */}
          <circle cx="50" cy="50" r="10" fill="#FAF8F5" stroke="#1C1917" strokeWidth="1.5" />
        </svg>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
          <Play className="w-4 h-4 fill-white" />
          <span className="text-[8px] font-mono uppercase mt-0.5">Test Scan</span>
        </div>
      </div>

      {/* Captions below QR */}
      <div className="mt-2 space-y-0.5 max-w-[140px]">
        <div className="flex items-center justify-center gap-1 text-[9px] font-mono uppercase text-[#A87B4F] font-semibold">
          {isVideo ? (
            <>
              <Video className="w-2.5 h-2.5" />
              <span>Video Memory</span>
            </>
          ) : (
            <>
              <Mic className="w-2.5 h-2.5" />
              <span>Voice Note</span>
            </>
          )}
        </div>
        <p className="font-sans italic text-[10px] text-[#57534E] leading-tight">
          {qrMedia.captionText || 'Scan with camera to play'}
        </p>
      </div>
    </div>
  );
};
