import React, { useState } from 'react';
import { X, Play, Pause, Volume2, Video, Mic, ExternalLink, Sparkles, QrCode } from 'lucide-react';
import { BookQRMedia } from '../types';

interface QRMediaPreviewModalProps {
  qrMedia: BookQRMedia;
  onClose: () => void;
}

export const QRMediaPreviewModal: React.FC<QRMediaPreviewModalProps> = ({
  qrMedia,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(35);

  const isVideo = qrMedia.mediaType === 'VIDEO';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#78716C] hover:text-[#1C1917] transition-colors"
          title="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pb-6 border-b border-[#1C1917]/10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A87B4F]">
            <QrCode className="w-4 h-4" />
            <span>Interactive QR Media Preview</span>
          </div>
          <h3 className="font-sans text-2xl text-[#1C1917] font-normal">
            {qrMedia.title || (isVideo ? 'Video Memory Keepsake' : 'Voice Memo Audio')}
          </h3>
          <p className="text-xs text-[#78716C] font-mono">
            {qrMedia.captionText || 'Printed in the physical photobook for smartphone scanning'}
          </p>
        </div>

        {/* Simulation Screen */}
        <div className="py-6 space-y-6">
          {isVideo ? (
            /* Video Simulation Player */
            <div className="bg-[#1C1917] text-white aspect-video relative overflow-hidden flex flex-col justify-between p-4 shadow-lg">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span className="flex items-center gap-1.5 font-mono">
                  <Video className="w-3.5 h-3.5 text-red-400" />
                  <span>4K Video Playback</span>
                </span>
                <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded-sm">01:45</span>
              </div>

              {/* Center Play Button Graphic */}
              <div className="flex flex-col items-center justify-center my-auto space-y-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all group"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1 fill-white" />
                  )}
                </button>
                <span className="text-[11px] font-mono text-white/80">
                  {isPlaying ? 'Playing Media Stream' : 'Click to Simulate Playback'}
                </span>
              </div>

              {/* Video Timeline Bar */}
              <div className="space-y-1">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="bg-[#A87B4F] h-full transition-all duration-300"
                    style={{ width: isPlaying ? '72%' : `${playbackProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/60">
                  <span>{isPlaying ? '01:15' : '00:35'}</span>
                  <span>01:45</span>
                </div>
              </div>
            </div>
          ) : (
            /* Audio / Voice Note Simulation Player */
            <div className="bg-[#EFECE6] p-6 border border-[#1C1917]/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#1C1917]">
                  <Mic className="w-4 h-4 text-[#A87B4F]" />
                  <span className="font-semibold">Recorded Voice Memo</span>
                </div>
                <span className="text-[11px] font-mono text-[#78716C]">
                  {qrMedia.audioDuration || '02:14'}
                </span>
              </div>

              {/* Sound Wave Graphic Simulation */}
              <div className="flex items-center justify-between gap-1 h-12 bg-white/60 p-2 border border-[#1C1917]/10">
                {[20, 45, 60, 30, 80, 95, 40, 70, 85, 30, 50, 90, 65, 40, 80, 55, 35, 75, 90, 60, 30, 45].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 transition-all ${
                      i < 12 ? 'bg-[#1C1917]' : 'bg-[#1C1917]/20'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1C1917] text-white hover:bg-[#2C2825] text-xs font-mono transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Voice Note</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />
                      <span>Play Voice Recording</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-[#78716C]">
                  <Volume2 className="w-4 h-4" />
                  <span>High-Fidelity Audio</span>
                </div>
              </div>
            </div>
          )}

          {/* Destination URL & Verification */}
          <div className="bg-white p-4 border border-[#1C1917]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-[#78716C] block">Linked Destination URL:</span>
              <span className="text-[#1C1917] font-semibold truncate max-w-xs block" title={qrMedia.mediaUrl}>
                {qrMedia.mediaUrl || 'https://yoki-gifts.et/media/sample-memory-01'}
              </span>
            </div>
            {qrMedia.mediaUrl && (
              <a
                href={qrMedia.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#1C1917]/15 text-[#1C1917] transition-colors whitespace-nowrap self-start sm:self-center"
              >
                <span>Open External Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="pt-4 border-t border-[#1C1917]/10 flex items-center justify-between text-xs font-mono text-[#78716C]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A87B4F]" />
            <span>High-Contrast Archival Barcode Standard (ISO/IEC 18004)</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#1C1917] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
