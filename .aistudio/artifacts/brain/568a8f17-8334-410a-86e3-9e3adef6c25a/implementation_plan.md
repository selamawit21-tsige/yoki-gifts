# Custom Cover Photo, Page Grid Layouts & Per-Page Visual Text & Color Editor

A major creative customization update for **Yoki Gifts**:
1. **Front Cover Photo Customizer**: Customers can choose between **Cameo Inset Window** and **Full-Bleed Photo Wrap**, assign any uploaded photo to the front cover, and view realistic cloth debossing or glossy wrap.
2. **Book Page Grid Layouts**: Multi-photo grid layouts (e.g., 2×2 quad grid, 3-photo grid, rule-of-thirds alignment grid) for any spread.
3. **Per-Page In-Photo Text Editor**: Interactive editor allowing users to place text directly in the middle of any photo or drag-and-drop with alignment grid guidelines.
4. **Curated 12-Color Swatch Palette**: 1-click swatch palette for instantaneous color adjustments across text overlays, page mats, and cover accents.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user-confirmed choices govern this implementation:
> - **Cover Photo Style**: Customer choice between **Cameo Inset Window** (cloth aperture frame with debossed title) and **Full-Bleed Photo Wrap** (photo wrapping the front cover).
> - **In-Photo Text Tool**: Interactive editor featuring centered text presets, drag-and-drop text positioning, and visual alignment grid guidelines.
> - **Color Customization**: A curated **12-color swatch palette** enabling quick 1-click color styling for text and page elements without tedious sliders.
> - **Preservation**: All photo crops, tags, and assignments remain preserved across edits.

---

## 1. Overview & Core Features

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Front Cover Customizer                          │
│                                                                        │
│  Cover Style: [Cameo Inset Window]  [Full-Bleed Photo Wrap]            │
│  Selected Cover Photo: [Addis Coffee Ceremony (Change Photo ▾)]        │
│                                                                        │
│  ┌─────────────────────────┬─────────────────────────┐                 │
│  │ Back Cover (Cloth)      │ Front Cover             │                 │
│  │                         │ ┌─────────────────────┐ │                 │
│  │                         │ │  Cover Photo Inset  │ │                 │
│  │                         │ └─────────────────────┘ │                 │
│  │                         │ OUR MEMORY CHRONICLE    │                 │
│  └─────────────────────────┴─────────────────────────┘                 │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│              Per-Page Drag & Floating Text Editor Modal                │
│                                                                        │
│  [Center Text] [Top] [Bottom] [Toggle 3×3 Alignment Grid]              │
│                                                                        │
│  12-Color Swatch Palette:                                              │
│  [⚫ #1C1917] [⚪ #FFFFFF] [🟡 Gold] [🟤 Coffee] [🟠 Terracotta] ...   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │   Photo Canvas with Drag & Grid Guidelines                       │  │
│  │   ┌ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┐  │  │
│  │   │  [Draggable Text Box: "Morning Sun in Addis"]             │  │  │
│  │   └ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  [Reset Text]                                  [Save to Page & Spread] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Architecture & Component Changes

1. **`src/types.ts`**:
   - Add `coverStyle?: 'CAMEO_INSET' | 'FULL_WRAP'` to `BookConfiguration`.
   - Add `coverPhotoId?: string` to `BookConfiguration`.
   - Update `PhotoTransform` to include `textPositionX?: number; textPositionY?: number; textColorHex?: string; textBgColorHex?: string; textFontSize?: 'sm' | 'md' | 'lg' | 'xl'`.
   - Add `'GRID_QUAD_2X2'` to `SpreadTemplateType`.
2. **`src/data/products.ts`**:
   - Add `ATELIER_12_COLORS`: 12 curated swatches with names and hex codes (Carbon, Snow, Gold, Silver, Terracotta, Sage, Navy, Blush, Coffee, Ochre, Sepia, Bone).
3. **`src/components/CoverPhotoPickerModal.tsx`**:
   - New modal to select any uploaded photo as the book's cover photo and toggle between Cameo Inset Window and Full-Bleed Photo Wrap.
4. **`src/components/PagePhotoTextEditorModal.tsx`**:
   - New per-page editing tool with:
     - Interactive drag positioning on top of the photo.
     - One-click presets: Center Middle, Top Banner, Bottom Subtitle.
     - 3×3 Rule-of-Thirds alignment grid toggle.
     - 12-color swatch palette for text and text background chips.
     - Font size and style selector using customer's selected book font.
5. **Update `ConfiguratorView.tsx` & `PhotoUploaderView.tsx`**:
   - Add Cover Photo & Style controls directly in the Book Specifications configurator and studio header.
   - Add direct "Edit Page Text" button on photo cards and spread views.
6. **Update `FullBookProofModal.tsx` & Spreads**:
   - Render Cameo Inset vs Full Wrap on Cover Spread.
   - Render 2×2 Quad Grid (`GRID_QUAD_2X2`) in the Layout Gallery.
   - Support arbitrary (X, Y) text positioning and 12-color text styling.

---

## 3. Implementation Steps

1. Update `src/types.ts` with `coverStyle`, `coverPhotoId`, `GRID_QUAD_2X2`, and extended `PhotoTransform`.
2. Define the 12 curated colors in `src/data/products.ts`.
3. Create `src/components/PagePhotoTextEditorModal.tsx` (drag text, alignment grid, 12-color palette).
4. Update `src/components/CoverPhotoPickerModal.tsx` (or integrate directly into Configurator & Uploader).
5. Update `src/components/FullBookProofModal.tsx` to display the selected cover photo style and quad grid.
6. Test compilation and linting with `compile_applet` and `lint_applet`.
