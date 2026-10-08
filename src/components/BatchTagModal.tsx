import React, { useState } from 'react';
import { X, Check, Tag, Plus, CheckSquare, Square } from 'lucide-react';
import { PhotoItem } from '../types';

interface BatchTagModalProps {
  photos: PhotoItem[];
  onApplyTags: (photoIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => void;
  onClose: () => void;
  presetTags: string[];
  allTags: string[];
}

export const BatchTagModal: React.FC<BatchTagModalProps> = ({
  photos,
  onApplyTags,
  onClose,
  presetTags,
  allTags
}) => {
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(
    () => new Set(photos.map((p) => p.id))
  );
  const [tagsToAdd, setTagsToAdd] = useState<Set<string>>(new Set());
  const [tagsToRemove, setTagsToRemove] = useState<Set<string>>(new Set());
  const [newCustomTag, setNewCustomTag] = useState('');

  // Combined list of unique tags
  const combinedTags = Array.from(new Set([...presetTags, ...allTags]));

  const togglePhotoSelect = (id: string) => {
    const next = new Set(selectedPhotoIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedPhotoIds(next);
  };

  const handleSelectAll = () => {
    setSelectedPhotoIds(new Set(photos.map((p) => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedPhotoIds(new Set());
  };

  const toggleTagToAdd = (tag: string) => {
    const nextAdd = new Set(tagsToAdd);
    const nextRemove = new Set(tagsToRemove);

    if (nextAdd.has(tag)) {
      nextAdd.delete(tag);
    } else {
      nextAdd.add(tag);
      nextRemove.delete(tag); // cannot both add and remove
    }
    setTagsToAdd(nextAdd);
    setTagsToRemove(nextRemove);
  };

  const toggleTagToRemove = (tag: string) => {
    const nextRemove = new Set(tagsToRemove);
    const nextAdd = new Set(tagsToAdd);

    if (nextRemove.has(tag)) {
      nextRemove.delete(tag);
    } else {
      nextRemove.add(tag);
      nextAdd.delete(tag);
    }
    setTagsToRemove(nextRemove);
    setTagsToAdd(nextAdd);
  };

  const handleAddNewCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCustomTag.trim();
    if (!trimmed) return;

    // Capitalize first letter
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const nextAdd = new Set(tagsToAdd);
    nextAdd.add(formatted);
    setTagsToAdd(nextAdd);
    setNewCustomTag('');
  };

  const handleSave = () => {
    if (selectedPhotoIds.size === 0) {
      alert('Please select at least one photo to tag.');
      return;
    }
    onApplyTags(
      Array.from(selectedPhotoIds),
      Array.from(tagsToAdd),
      Array.from(tagsToRemove)
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#1C1917]/20 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A87B4F] block">
              Multi-Photo Curator
            </span>
            <h3 className="text-xl sm:text-2xl font-sans font-medium text-[#1C1917]">
              Batch Tag Manager
            </h3>
            <span className="text-xs text-[#78716C] font-mono">
              Apply or remove tags across {photos.length} photos
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Select Target Photos */}
        <div className="py-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#1C1917] font-semibold">
              1. Select Photos ({selectedPhotoIds.size} of {photos.length} selected):
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[#A87B4F] hover:underline"
              >
                Select All
              </button>
              <span className="text-[#A8A29E]">·</span>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="text-[#78716C] hover:underline"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {/* Photo selection thumbnails carousel */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-[#EFECE6]/50 border border-[#1C1917]/10">
            {photos.map((photo) => {
              const isSelected = selectedPhotoIds.has(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => togglePhotoSelect(photo.id)}
                  className={`relative aspect-square cursor-pointer border-2 transition-all group overflow-hidden ${
                    isSelected
                      ? 'border-[#1C1917] shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      isSelected ? 'bg-black/25' : 'bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-5 h-5 bg-[#1C1917] text-white flex items-center justify-center rounded-xs shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Choose Tags to Add */}
        <div className="py-4 border-t border-[#1C1917]/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#1C1917] font-semibold">
              2. Tags to Add to Selected ({tagsToAdd.size} selected):
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {combinedTags.map((tag) => {
              const isMarkedAdd = tagsToAdd.has(tag);
              return (
                <button
                  key={`add-${tag}`}
                  type="button"
                  onClick={() => toggleTagToAdd(tag)}
                  className={`px-3 py-1.5 text-xs font-mono border transition-all flex items-center gap-1.5 ${
                    isMarkedAdd
                      ? 'bg-[#1C1917] text-white border-[#1C1917] font-semibold'
                      : 'bg-white text-[#57534E] border-[#1C1917]/15 hover:border-[#1C1917]'
                  }`}
                >
                  {isMarkedAdd ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Plus className="w-3 h-3 text-[#A87B4F]" />
                  )}
                  <span>+{tag}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom tag input */}
          <form onSubmit={handleAddNewCustomTag} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newCustomTag}
              onChange={(e) => setNewCustomTag(e.target.value)}
              placeholder="Create new custom tag (e.g. Sunset, Vows, Reception)..."
              maxLength={24}
              className="flex-1 px-3 py-1.5 bg-white border border-[#1C1917]/20 text-xs font-mono focus:outline-none focus:border-[#1C1917]"
            />
            <button
              type="submit"
              disabled={!newCustomTag.trim()}
              className="px-3 py-1.5 bg-[#1C1917] text-white text-xs font-mono disabled:opacity-40 transition-opacity"
            >
              Add Custom Tag
            </button>
          </form>
        </div>

        {/* Step 3: Choose Tags to Remove */}
        {allTags.length > 0 && (
          <div className="py-4 border-t border-[#1C1917]/10 space-y-2">
            <span className="text-xs font-mono font-semibold text-[#1C1917] block">
              3. Tags to Remove from Selected ({tagsToRemove.size} selected):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const isMarkedRemove = tagsToRemove.has(tag);
                return (
                  <button
                    key={`remove-${tag}`}
                    type="button"
                    onClick={() => toggleTagToRemove(tag)}
                    className={`px-3 py-1 text-xs font-mono border transition-all flex items-center gap-1.5 ${
                      isMarkedRemove
                        ? 'bg-rose-900 text-white border-rose-900 font-semibold'
                        : 'bg-white text-[#78716C] border-[#1C1917]/15 hover:border-rose-400'
                    }`}
                  >
                    <span>&minus; {tag}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-5 border-t border-[#1C1917]/10 flex items-center justify-between">
          <span className="text-xs font-mono text-[#78716C]">
            Targeting {selectedPhotoIds.size} photo{selectedPhotoIds.size === 1 ? '' : 's'}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-[#78716C] hover:text-[#1C1917]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={selectedPhotoIds.size === 0 || (tagsToAdd.size === 0 && tagsToRemove.size === 0)}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#2C2825] disabled:opacity-50 transition-colors shadow-sm font-medium"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Tags</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
