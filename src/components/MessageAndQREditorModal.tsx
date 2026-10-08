import React, { useState } from 'react';
import {
  X,
  FileText,
  QrCode,
  Sparkles,
  Check,
  Video,
  Mic,
  Feather,
  Heart,
  BookOpen
} from 'lucide-react';
import { BookMessage, BookQRMedia, ArtMotif } from '../types';

interface MessageAndQREditorModalProps {
  initialMessage?: BookMessage;
  initialQR?: BookQRMedia;
  onSave: (message: BookMessage, qrMedia: BookQRMedia) => void;
  onClose: () => void;
}

export const MessageAndQREditorModal: React.FC<MessageAndQREditorModalProps> = ({
  initialMessage,
  initialQR,
  onSave,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'message' | 'qr'>('message');

  // Message state
  const [message, setMessage] = useState<BookMessage>(() => ({
    enabled: initialMessage?.enabled ?? true,
    type: initialMessage?.type ?? 'DEDICATION',
    title: initialMessage?.title ?? 'To Our Beloved Family',
    bodyText: initialMessage?.bodyText ?? 'May these photographs preserve the laughter, the quiet mornings over fresh coffee, and the blessings that bind us together through every generation.',
    authorSignature: initialMessage?.authorSignature ?? 'With enduring love & gratitude',
    artMotif: initialMessage?.artMotif ?? 'BOTANICAL_SPRIG',
    pagePlacement: initialMessage?.pagePlacement ?? 'FRONT_DEDICATION'
  }));

  // QR state
  const [qr, setQR] = useState<BookQRMedia>(() => ({
    enabled: initialQR?.enabled ?? true,
    mediaType: initialQR?.mediaType ?? 'VIDEO',
    title: initialQR?.title ?? 'Highland Journey & Celebration Video',
    mediaUrl: initialQR?.mediaUrl ?? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    captionText: initialQR?.captionText ?? 'Scan with your camera to watch our vows & celebration',
    audioDuration: initialQR?.audioDuration ?? '02:45'
  }));

  const handleApplyPreset = (presetKey: 'VOWS' | 'MEMOIR' | 'FAMILY' | 'COFFEE') => {
    if (presetKey === 'VOWS') {
      setMessage({
        ...message,
        enabled: true,
        type: 'VOWS',
        title: 'Our Vows Before Family & Elders',
        bodyText: 'To walk together through every season, under the highland eucalyptus breezes and wherever our footsteps lead us. Forever rooted in love and grace.',
        authorSignature: 'Sara & Michael · November 2025',
        artMotif: 'BOTANICAL_SPRIG'
      });
      setQR({
        ...qr,
        enabled: true,
        mediaType: 'VIDEO',
        title: 'Reception Dance & Blessing Ceremony',
        mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        captionText: 'Scan to watch our reception entrance & family dances'
      });
    } else if (presetKey === 'MEMOIR') {
      setMessage({
        ...message,
        enabled: true,
        type: 'MEMOIR',
        title: 'Highland Escarpment Field Notes',
        bodyText: 'We stood at the cliff edge as morning mist rolled through the jagged canyons of the Simien mountains. The wind was cool and pure, carrying memories of an ancient land.',
        authorSignature: 'The Voyage Archive',
        artMotif: 'HERITAGE_CREST'
      });
      setQR({
        ...qr,
        enabled: true,
        mediaType: 'AUDIO_VOICE',
        title: 'Campfire Ambient Audio at Gich Ridge',
        mediaUrl: 'https://actions.google.com/sounds/v1/nature/wind_through_trees.ogg',
        captionText: 'Scan to listen to the dawn birdsong & highland mountain wind',
        audioDuration: '03:12'
      });
    } else if (presetKey === 'FAMILY') {
      setMessage({
        ...message,
        enabled: true,
        type: 'DEDICATION',
        title: 'A Tribute to Generations Past & Present',
        bodyText: 'Dedicated to our parents and grandparents, whose hands laid the foundations of our home. Every smile within these pages carries your warmth.',
        authorSignature: 'With love from all the children',
        artMotif: 'COFFEE_BRANCH'
      });
      setQR({
        ...qr,
        enabled: true,
        mediaType: 'AUDIO_VOICE',
        title: 'Grandmother’s Voice Blessing & Prayer',
        mediaUrl: 'https://actions.google.com/sounds/v1/human_voices/gentle_whisper_prayer.ogg',
        captionText: 'Scan to hear Grandmother’s traditional blessing in Amharic',
        audioDuration: '01:50'
      });
    } else if (presetKey === 'COFFEE') {
      setMessage({
        ...message,
        enabled: true,
        type: 'LETTER',
        title: 'Morning Rituals Around the Jebena',
        bodyText: 'The incense curls toward the open window. Three rounds of coffee, frankincense smoke, and stories told without hurry. This is where memory begins.',
        authorSignature: 'Bole Mornings · 2026',
        artMotif: 'COFFEE_BRANCH'
      });
      setQR({
        ...qr,
        enabled: true,
        mediaType: 'VIDEO',
        title: 'Traditional Coffee Roasting & Ceremony',
        mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        captionText: 'Scan to watch the full coffee ceremony ritual'
      });
    }
  };

  const handleSaveAll = () => {
    onSave(message, qr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#78716C] hover:text-[#1C1917] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pb-6 border-b border-[#1C1917]/10">
          <div className="text-xs uppercase font-mono tracking-widest text-[#A87B4F]">
            Interactive In-Book Storytelling
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans text-[#1C1917] font-normal">
            Personal Message & Scannable QR Code
          </h2>
          <p className="text-xs text-[#78716C] font-mono">
            Enhance your photobook spreads with dedication prose and scannable media that plays on smartphones.
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="pt-4 pb-2">
          <span className="text-[11px] font-mono text-[#78716C] block mb-2">
            Quick Story Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('VOWS')}
              className="px-3 py-1 bg-white hover:bg-[#EFECE6] border border-[#1C1917]/10 text-xs font-mono text-[#1C1917] transition-colors"
            >
              Wedding Vows & Video
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('FAMILY')}
              className="px-3 py-1 bg-white hover:bg-[#EFECE6] border border-[#1C1917]/10 text-xs font-mono text-[#1C1917] transition-colors"
            >
              Family Blessing & Voice Note
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('MEMOIR')}
              className="px-3 py-1 bg-white hover:bg-[#EFECE6] border border-[#1C1917]/10 text-xs font-mono text-[#1C1917] transition-colors"
            >
              Travel Expedition Memoir
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('COFFEE')}
              className="px-3 py-1 bg-white hover:bg-[#EFECE6] border border-[#1C1917]/10 text-xs font-mono text-[#1C1917] transition-colors"
            >
              Coffee Ceremony Story
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#1C1917]/10 mt-4">
          <button
            onClick={() => setActiveTab('message')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'message'
                ? 'border-[#1C1917] text-[#1C1917] font-semibold bg-white/40'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Dedication & Message Box</span>
            {message.enabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#A87B4F]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'qr'
                ? 'border-[#1C1917] text-[#1C1917] font-semibold bg-white/40'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>2. Video / Audio QR Code</span>
            {qr.enabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#A87B4F]" />
            )}
          </button>
        </div>

        {/* Tab 1: Message Editor */}
        {activeTab === 'message' && (
          <div className="py-6 space-y-5">
            <div className="flex items-center justify-between bg-white p-3 border border-[#1C1917]/10">
              <div>
                <strong className="text-xs font-mono text-[#1C1917] block">
                  Print Dedication / Story Box in Book
                </strong>
                <span className="text-[11px] text-[#78716C]">
                  Renders on a dedicated spread with clean serif typography
                </span>
              </div>
              <input
                type="checkbox"
                checked={message.enabled}
                onChange={(e) => setMessage({ ...message, enabled: e.target.checked })}
                className="w-4 h-4 accent-[#1C1917]"
              />
            </div>

            {message.enabled && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[#78716C] block mb-1 font-mono">
                    Message / Section Title
                  </span>
                  <input
                    type="text"
                    value={message.title}
                    onChange={(e) => setMessage({ ...message, title: e.target.value })}
                    placeholder="To Our Beloved Family"
                    className="w-full px-4 py-2.5 bg-white border border-[#1C1917]/20 text-sm font-sans"
                  />
                </div>

                <div>
                  <span className="text-xs text-[#78716C] block mb-1 font-mono">
                    Message Body Text (Prose, Vows, or Memories)
                  </span>
                  <textarea
                    rows={4}
                    value={message.bodyText}
                    onChange={(e) => setMessage({ ...message, bodyText: e.target.value })}
                    placeholder="Write your personal memories, dedication words, or wedding vows here..."
                    className="w-full px-4 py-2.5 bg-white border border-[#1C1917]/20 text-sm font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <span className="text-xs text-[#78716C] block mb-1 font-mono">
                    Author / Signature Line
                  </span>
                  <input
                    type="text"
                    value={message.authorSignature}
                    onChange={(e) => setMessage({ ...message, authorSignature: e.target.value })}
                    placeholder="With all our love, Tsige & Dawit"
                    className="w-full px-4 py-2 bg-white border border-[#1C1917]/20 text-xs font-sans italic"
                  />
                </div>

                {/* Art Motif Selection */}
                <div>
                  <span className="text-xs text-[#78716C] block mb-1.5 font-mono">
                    Archival Art Motif (Printed Accent)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    {[
                      { id: 'NONE', label: 'Minimal (No Art)' },
                      { id: 'BOTANICAL_SPRIG', label: 'Botanical Leaf' },
                      { id: 'COFFEE_BRANCH', label: 'Coffee Branch' },
                      { id: 'HERITAGE_CREST', label: 'Highland Crest' }
                    ].map((art) => (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => setMessage({ ...message, artMotif: art.id as ArtMotif })}
                        className={`p-2.5 text-left border transition-colors ${
                          message.artMotif === art.id
                            ? 'border-[#1C1917] bg-white font-semibold'
                            : 'border-[#1C1917]/10 bg-[#FAF8F5] text-[#57534E]'
                        }`}
                      >
                        {art.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Placement */}
                <div>
                  <span className="text-xs text-[#78716C] block mb-1.5 font-mono">
                    Page Spread Placement
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {[
                      { id: 'FRONT_DEDICATION', label: 'Opening Page (p. 1)' },
                      { id: 'SPREAD_CENTER', label: 'Center Monograph' },
                      { id: 'BACK_INSCRIPTION', label: 'Final Endpage' }
                    ].map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => setMessage({ ...message, pagePlacement: place.id as any })}
                        className={`p-2.5 text-left border transition-colors ${
                          message.pagePlacement === place.id
                            ? 'border-[#1C1917] bg-white font-semibold'
                            : 'border-[#1C1917]/10 bg-[#FAF8F5] text-[#57534E]'
                        }`}
                      >
                        {place.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: QR Media Editor */}
        {activeTab === 'qr' && (
          <div className="py-6 space-y-5">
            <div className="flex items-center justify-between bg-white p-3 border border-[#1C1917]/10">
              <div>
                <strong className="text-xs font-mono text-[#1C1917] block">
                  Embed Scannable Video / Audio QR Code
                </strong>
                <span className="text-[11px] text-[#78716C]">
                  Prints a high-contrast 2D barcode on the page with your custom caption
                </span>
              </div>
              <input
                type="checkbox"
                checked={qr.enabled}
                onChange={(e) => setQR({ ...qr, enabled: e.target.checked })}
                className="w-4 h-4 accent-[#1C1917]"
              />
            </div>

            {qr.enabled && (
              <div className="space-y-4">
                {/* Media Type */}
                <div>
                  <span className="text-xs text-[#78716C] block mb-1.5 font-mono">
                    Media Format
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setQR({ ...qr, mediaType: 'VIDEO' })}
                      className={`p-3 text-left border flex items-center gap-2.5 ${
                        qr.mediaType === 'VIDEO'
                          ? 'border-[#1C1917] bg-white font-semibold'
                          : 'border-[#1C1917]/10 bg-[#FAF8F5]'
                      }`}
                    >
                      <Video className="w-4 h-4 text-[#A87B4F]" />
                      <div className="text-xs font-mono">
                        <div>Video Memory Link</div>
                        <span className="text-[10px] text-[#78716C]">YouTube, Vimeo, Cloud Drive</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQR({ ...qr, mediaType: 'AUDIO_VOICE' })}
                      className={`p-3 text-left border flex items-center gap-2.5 ${
                        qr.mediaType === 'AUDIO_VOICE'
                          ? 'border-[#1C1917] bg-white font-semibold'
                          : 'border-[#1C1917]/10 bg-[#FAF8F5]'
                      }`}
                    >
                      <Mic className="w-4 h-4 text-[#A87B4F]" />
                      <div className="text-xs font-mono">
                        <div>Voice Note / Audio</div>
                        <span className="text-[10px] text-[#78716C]">Vows, blessings, voice memo</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-[#78716C] block mb-1 font-mono">
                    Media Title
                  </span>
                  <input
                    type="text"
                    value={qr.title}
                    onChange={(e) => setQR({ ...qr, title: e.target.value })}
                    placeholder="Wedding First Dance & Blessings"
                    className="w-full px-4 py-2.5 bg-white border border-[#1C1917]/20 text-sm"
                  />
                </div>

                <div>
                  <span className="text-xs text-[#78716C] block mb-1 font-mono">
                    Destination Video / Audio URL
                  </span>
                  <input
                    type="url"
                    value={qr.mediaUrl}
                    onChange={(e) => setQR({ ...qr, mediaUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 bg-white border border-[#1C1917]/20 text-xs font-mono"
                  />
                  <span className="text-[10px] text-[#78716C] font-mono mt-1 block">
                    Any link to YouTube, Vimeo, Google Drive, iCloud, or audio file
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[#78716C] block mb-1 font-mono">
                    Printed Scan Instruction (Caption below QR)
                  </span>
                  <input
                    type="text"
                    value={qr.captionText}
                    onChange={(e) => setQR({ ...qr, captionText: e.target.value })}
                    placeholder="Scan with camera to watch our reception video"
                    className="w-full px-4 py-2 bg-white border border-[#1C1917]/20 text-xs font-sans italic"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#1C1917]/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono uppercase text-[#78716C] hover:text-[#1C1917]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 text-xs font-mono uppercase tracking-wider font-medium text-white bg-[#1C1917] hover:bg-[#2C2825] transition-colors"
          >
            Save to Book Spreads
          </button>
        </div>
      </div>
    </div>
  );
};
