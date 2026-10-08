import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Check,
  BookOpen,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { PhotoItem } from '../types';

interface AutoLayoutModalProps {
  photos: PhotoItem[];
  onApplyLayout: (reorderedPhotos: PhotoItem[]) => void;
  onClose: () => void;
}

export type AutoLayoutStyle = 'HARMONIOUS' | 'THEMATIC_STORY';

interface SuggestedSpread {
  spreadNumber: number;
  chapterName: string;
  leftPhoto?: PhotoItem;
  rightPhoto?: PhotoItem;
  isSymmetrical: boolean;
  leftAspect: string;
  rightAspect: string;
}

export const AutoLayoutModal: React.FC<AutoLayoutModalProps> = ({
  photos,
  onApplyLayout,
  onClose
}) => {
  const [layoutStyle, setLayoutStyle] = useState<AutoLayoutStyle>('HARMONIOUS');

  // Intelligent Layout Suggestion Algorithm
  const { suggestedPhotos, suggestedSpreads, symmetryScore, stats } = useMemo(() => {
    if (photos.length === 0) {
      return {
        suggestedPhotos: [],
        suggestedSpreads: [],
        symmetryScore: 100,
        stats: { totalSpreads: 0, symmetricalPairs: 0, chaptersCount: 0 }
      };
    }

    // 1. Identify and anchor cover photo
    const coverPhoto = photos.find((p) => p.isCover) || photos[0];
    const nonCoverPhotos = photos.filter((p) => p.id !== coverPhoto.id);

    // 2. Thematic Chapter Clustering
    const knownTags = ['Ceremony', 'Portraits', 'Candid', 'Landscape', 'Details'];
    const chapterBuckets: Record<string, PhotoItem[]> = {};

    knownTags.forEach((tag) => {
      chapterBuckets[tag] = [];
    });
    chapterBuckets['Other Memories'] = [];

    nonCoverPhotos.forEach((photo) => {
      const primaryTag = photo.tags && photo.tags.length > 0 ? photo.tags[0] : null;
      if (primaryTag && knownTags.includes(primaryTag)) {
        chapterBuckets[primaryTag].push(photo);
      } else if (primaryTag) {
        if (!chapterBuckets[primaryTag]) chapterBuckets[primaryTag] = [];
        chapterBuckets[primaryTag].push(photo);
      } else {
        chapterBuckets['Other Memories'].push(photo);
      }
    });

    const orderedPhotos: PhotoItem[] = [coverPhoto];
    const spreadsList: SuggestedSpread[] = [];
    let spreadCounter = 1;
    let symmetricalCount = 0;
    const activeChapters = Object.keys(chapterBuckets).filter(
      (k) => chapterBuckets[k].length > 0
    );

    if (layoutStyle === 'HARMONIOUS') {
      // Prioritize pure aspect-ratio symmetry within each chapter, then across leftovers
      activeChapters.forEach((chapterName) => {
        const cluster = chapterBuckets[chapterName];
        const landscapes = cluster.filter((p) => p.aspectRatio === 'landscape');
        const portraits = cluster.filter((p) => p.aspectRatio === 'portrait');
        const squares = cluster.filter((p) => p.aspectRatio === 'square');

        // Pair landscapes together
        while (landscapes.length >= 2) {
          const left = landscapes.shift()!;
          const right = landscapes.shift()!;
          orderedPhotos.push(left, right);
          symmetricalCount++;
          spreadsList.push({
            spreadNumber: spreadCounter++,
            chapterName,
            leftPhoto: left,
            rightPhoto: right,
            isSymmetrical: true,
            leftAspect: 'Landscape (4:3)',
            rightAspect: 'Landscape (4:3)'
          });
        }

        // Pair portraits together
        while (portraits.length >= 2) {
          const left = portraits.shift()!;
          const right = portraits.shift()!;
          orderedPhotos.push(left, right);
          symmetricalCount++;
          spreadsList.push({
            spreadNumber: spreadCounter++,
            chapterName,
            leftPhoto: left,
            rightPhoto: right,
            isSymmetrical: true,
            leftAspect: 'Portrait (3:4)',
            rightAspect: 'Portrait (3:4)'
          });
        }

        // Pair squares together
        while (squares.length >= 2) {
          const left = squares.shift()!;
          const right = squares.shift()!;
          orderedPhotos.push(left, right);
          symmetricalCount++;
          spreadsList.push({
            spreadNumber: spreadCounter++,
            chapterName,
            leftPhoto: left,
            rightPhoto: right,
            isSymmetrical: true,
            leftAspect: 'Square (1:1)',
            rightAspect: 'Square (1:1)'
          });
        }

        // Odd leftovers in this chapter
        const leftovers = [...landscapes, ...portraits, ...squares];
        while (leftovers.length >= 2) {
          const left = leftovers.shift()!;
          const right = leftovers.shift()!;
          const same = left.aspectRatio === right.aspectRatio;
          if (same) symmetricalCount++;
          orderedPhotos.push(left, right);
          spreadsList.push({
            spreadNumber: spreadCounter++,
            chapterName,
            leftPhoto: left,
            rightPhoto: right,
            isSymmetrical: same,
            leftAspect: left.aspectRatio || 'Standard',
            rightAspect: right.aspectRatio || 'Standard'
          });
        }

        if (leftovers.length === 1) {
          const left = leftovers.shift()!;
          orderedPhotos.push(left);
          spreadsList.push({
            spreadNumber: spreadCounter++,
            chapterName,
            leftPhoto: left,
            isSymmetrical: false,
            leftAspect: left.aspectRatio || 'Standard',
            rightAspect: 'Endpaper/Note'
          });
        }
      });
    } else {
      // THEMATIC_STORY: Sequential chapter walk with pairing
      activeChapters.forEach((chapterName) => {
        const cluster = [...chapterBuckets[chapterName]];
        while (cluster.length >= 2) {
          const left = cluster.shift()!;
          const right = cluster.shift()!;
          const same = left.aspectRatio === right.aspectRatio;
          if (same) symmetricalCount++;
          orderedPhotos.push(left, right);
          spreadsList.push({
            spreadNumber: spreadCounter++,
            chapterName,
            leftPhoto: left,
            rightPhoto: right,
            isSymmetrical: same,
            leftAspect: left.aspectRatio || 'Standard',
            rightAspect: right.aspectRatio || 'Standard'
          });
        }
        if (cluster.length === 1) {
          const left = cluster.shift()!;
          orderedPhotos.push(left);
          spreadsList.push({
            spreadNumber: spreadCounter++,
            chapterName,
            leftPhoto: left,
            isSymmetrical: false,
            leftAspect: left.aspectRatio || 'Standard',
            rightAspect: 'Endpaper/Note'
          });
        }
      });
    }

    const totalPairs = spreadsList.length;
    const score = totalPairs > 0 ? Math.round((symmetricalCount / totalPairs) * 100) : 100;

    return {
      suggestedPhotos: orderedPhotos,
      suggestedSpreads: spreadsList,
      symmetryScore: score,
      stats: {
        totalSpreads: totalPairs,
        symmetricalPairs: symmetricalCount,
        chaptersCount: activeChapters.length
      }
    };
  }, [photos, layoutStyle]);

  const handleApply = () => {
    onApplyLayout(suggestedPhotos);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1917]/10 pb-5 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A87B4F]">
                Intelligent Atelier Engine
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold rounded-xs">
                {symmetryScore}% Symmetry Match
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-sans font-medium text-[#1C1917] mt-0.5">
              Auto-Layout Suggestion Studio
            </h3>
            <p className="text-xs text-[#78716C] font-mono mt-0.5">
              Balanced spreads grouped by aspect ratio (portrait & landscape) and narrative tags
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors self-end sm:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout Style Toggle & Metric Badges */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-5 border-b border-[#1C1917]/10 items-center">
          {/* Style Selector */}
          <div className="md:col-span-6 flex items-center gap-2 text-xs font-mono">
            <span className="text-[#1C1917] font-semibold shrink-0">Layout Strategy:</span>
            <div className="flex items-center bg-[#EFECE6] p-0.5 border border-[#1C1917]/10">
              <button
                type="button"
                onClick={() => setLayoutStyle('HARMONIOUS')}
                className={`px-3 py-1.5 transition-colors ${
                  layoutStyle === 'HARMONIOUS'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Harmonious Symmetrical
              </button>
              <button
                type="button"
                onClick={() => setLayoutStyle('THEMATIC_STORY')}
                className={`px-3 py-1.5 transition-colors ${
                  layoutStyle === 'THEMATIC_STORY'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Narrative Chapters
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="md:col-span-6 flex flex-wrap items-center justify-start md:justify-end gap-3 text-xs font-mono text-[#78716C]">
            <span className="bg-white px-2.5 py-1 border border-[#1C1917]/10">
              <strong className="text-[#1C1917] font-semibold">{stats.totalSpreads}</strong> Spreads
            </span>
            <span className="bg-white px-2.5 py-1 border border-[#1C1917]/10">
              <strong className="text-[#1C1917] font-semibold">{stats.symmetricalPairs}</strong> Balanced Pairs
            </span>
            <span className="bg-white px-2.5 py-1 border border-[#1C1917]/10">
              <strong className="text-[#1C1917] font-semibold">{stats.chaptersCount}</strong> Thematic Chapters
            </span>
          </div>
        </div>

        {/* Cover Photo Anchor Bar */}
        <div className="py-3 px-4 my-4 bg-white border border-[#1C1917]/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#A87B4F]" />
            <span className="text-[#1C1917] font-semibold">Page 1 Anchor:</span>
            <span className="text-[#57534E] truncate max-w-xs">{suggestedPhotos[0]?.name}</span>
          </div>
          <span className="text-[#A87B4F] text-[10px] uppercase tracking-wider font-semibold">
            Cover Monograph
          </span>
        </div>

        {/* Spreads Preview Grid */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          <div className="text-xs font-mono uppercase tracking-wider text-[#78716C]">
            Proposed Book Spreads Sequence ({suggestedSpreads.length} Spreads):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {suggestedSpreads.map((spread) => (
              <div
                key={spread.spreadNumber}
                className="bg-white border border-[#1C1917]/15 p-3.5 flex flex-col justify-between space-y-2.5 hover:border-[#1C1917] transition-colors shadow-xs"
              >
                {/* Spread Header */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-semibold text-[#1C1917]">
                    Spread #{spread.spreadNumber}
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#1C1917]/10 text-[9px] text-[#A87B4F]">
                    {spread.chapterName}
                  </span>
                </div>

                {/* Dual-Page Micro Spread Rendering */}
                <div className="grid grid-cols-2 gap-1.5 bg-[#EAE4D8] p-2 border border-[#1C1917]/10 aspect-[16/10] relative shadow-inner">
                  {/* Left Page */}
                  <div className="bg-[#FAF8F5] relative overflow-hidden flex flex-col justify-between p-1 border border-[#1C1917]/5">
                    {spread.leftPhoto ? (
                      <img
                        src={spread.leftPhoto.url}
                        alt={spread.leftPhoto.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-[8px] font-mono text-[#A8A29E]">
                        Endpaper
                      </div>
                    )}
                  </div>

                  {/* Right Page */}
                  <div className="bg-[#FAF8F5] relative overflow-hidden flex flex-col justify-between p-1 border border-[#1C1917]/5">
                    {spread.rightPhoto ? (
                      <img
                        src={spread.rightPhoto.url}
                        alt={spread.rightPhoto.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-[8px] font-mono text-[#A8A29E]">
                        Endpaper
                      </div>
                    )}
                  </div>
                </div>

                {/* Spread Pairing Info */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#78716C] border-t border-[#1C1917]/5 pt-1.5">
                  <span className="truncate max-w-[140px]">
                    {spread.leftAspect}
                  </span>
                  {spread.isSymmetrical ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      ✓ Balanced
                    </span>
                  ) : (
                    <span className="text-amber-700">Dynamic</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t border-[#1C1917]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#78716C]">
            <Info className="w-3.5 h-3.5 text-[#A87B4F]" />
            <span>Applying will rearrange your photo order to match this layout.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-[#78716C] hover:text-[#1C1917]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#2C2825] transition-colors shadow-sm font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A87B4F]" />
              <span>Apply Auto-Layout to Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
