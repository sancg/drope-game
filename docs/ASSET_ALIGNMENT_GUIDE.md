# Asset Alignment Guide

## How alignment works in this project

The stage uses the body assets' exact **1500 × 2100** canvas. Its aspect ratio is 5:7. Every layer is placed on this grid; the source PNG's own dimensions do not set its location. A `grid(x, y, width, height)` value in `src/features/dressing/catalog.ts` sets the placement rectangle in stage pixels.

All face images now use the same **1500 × 2100** artboard as the body. `CharacterStage` draws them as full-canvas layers with no face-specific grid, scale, or position calculation. Place a face on the body artboard in an image editor and export it at the same dimensions; the artwork's position in the PNG becomes its game position. This applies to both Luna and Max and their wardrobe faces.

Current face assets are in `public/assets/CABELLO/Women/` and `public/assets/CABELLO/Men/`. Each selected catalog face is 1500 × 2100 px. The earlier cropped and 810 × 850 aligned files are no longer used by the game.

Use the matching `WOMAN_BASE.png` or `MAN_BASE.png` as a locked guide layer when editing a face. Keep the face artboard at 1500 × 2100, place the hair and head to match the head/neck on that guide, hide the body guide, and export the transparent face layer without resizing or moving its canvas.

Legacy garments were authored on a 512 × 1024 canvas. `legacyGrid()` maps that original canvas proportionally into a centered 1050 × 2100 region on the body canvas. This keeps the clothes' proportions while placing them against the 1500 × 2100 body. New assets should be designed directly on the 1500 × 2100 body grid.

The wardrobe cards use `object-fit: contain` and `object-position: center`, so every garment, accessory, and cropped head is centered and fully visible in its preview instead of being shifted upward or cut off.

## Current audit

| Asset group | Source canvas | Rendering rule | Result |
| --- | --- | --- | --- |
| Luna and Max bases | 1500 × 2100 | Full stage canvas | Reference grid for every layer. |
| Pose bases and `CH_01_Pose` | 1500 × 2100 | Full stage canvas | Keep pose base and jacket aligned. |
| Face PNGs | 1500 × 2100 | Full stage canvas | Export directly on the matching body artboard. |
| Existing tops, jackets, bottoms, shoes, accessories | Trimmed PNGs | Legacy frame mapped into body grid | Uniform 2.05 scale; centered 1050 px wide legacy canvas. |
| New layers | Any trimmed PNG | `grid(x, y, width, height)` in body pixels | Measure rectangle on a 1500 × 2100 working canvas. |

All 14 legacy clothing/accessory sprites in the current catalog were measured against their alpha bounds, cropped into `public/assets/optimized/`, and mapped into body-grid coordinates. Their placement is stable even though the PNG files have different widths and heights.

## Adding or replacing assets

1. Import or place the selected `WOMAN_BASE.png` or `MAN_BASE.png` as a locked **1500 × 2100** reference layer. Do not resize the canvas.
2. Add transparent layers for the clothes and faces. Use the base artwork itself as the position guide: align neck, shoulder seams, waist, hips, knees, and feet directly against its pixels.
3. Align clothing to the relevant body landmarks on that same canvas. Tops should meet the shoulder and waist guides; pants should begin at the waist/hip guides; shoes should sit at the foot guide.
4. After clothing alignment, crop transparent margins and record the crop's rectangle `(x, y, width, height)` on the original 1500 × 2100 canvas.
5. Add the cropped PNG path and `grid(x, y, width, height)` to `catalog.ts`. The crop file can have any pixel dimensions; its grid rectangle controls size and location.
6. For a face, keep the full 1500 × 2100 artboard. Align the face and neck over the corresponding base body, then export without cropping the canvas.
7. Test Luna and Max, then open the wardrobe to check both the stage and card preview.

Grid sketch (1500 × 2100 canvas; use the character base image underneath as the precise guide):

```text
1500 px wide
┌─────────────────────┐ y=0
│        head         │
│    neck/shoulders   │
│         top         │
│                     │
│        waist        │
│       trousers      │
│                     │
│         legs        │
│                     │
│        shoes        │ y=2100 / canvas edge
└─────────────────────┘
```

## If one cropped face needs a small correction

Start by adjusting `headGrid` in `src/features/dressing/catalog.ts`:

```css
const garmentGrid = grid(x, y, width, height) // 1500 x 2100 body-canvas pixels
```

Gridded clothing continues to use `grid(...)`. Faces do not: keep them on the full body artboard and the renderer places them at the correct stage coordinates.

## Recommended learning resources

- [MDN: object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) explains how an image is scaled inside its box.
- [MDN: object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) covers moving an image within that box.
- [MDN: transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) is the reference for translating or scaling a single layer.
- [MDN Learn CSS layout](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout) is a good next tutorial series for positioning and responsive layouts.
