# Atelier Wardrobe

A responsive character dressing game built with React, TypeScript, Vite, and Zustand. Choose Luna or Max, select a runway, and combine faces and clothing in the wardrobe.

## Get started

Requirements: Node.js and npm.

```sh
npm ci
npm run dev
```

Vite prints the local development URL in the terminal.

## Commands

```sh
npm run build    # Type-check and create the production build in dist/
npm run lint     # Run ESLint
npm run preview  # Serve the production build locally (run build first)
```

## How the game is organized

- `src/app/App.tsx` assembles the stage, character and runway pickers, and wardrobe.
- `src/features/dressing/store.ts` stores the active character, runway, and outfit.
- `src/features/dressing/catalog.ts` defines characters, runways, wardrobe items, and placement grids.
- `src/features/dressing/components/` contains the wardrobe and selection controls.
- `src/features/game/CharacterStage.tsx` draws the character's PNG layers.
- `src/styles/global.css` controls the responsive layout and layer styling.
- `public/assets/` contains the bodies, faces, clothing, and backgrounds.

## Character image alignment

The base bodies use a **1500 × 2100 px** artboard. The face PNGs used by the game also use that full canvas, so the face artwork's coordinates in the PNG are its coordinates in the game. Face layers render at the same origin and size as the body: do not crop, resize, or add a face-specific offset in code.

Current face assets:

- Women: `public/assets/CABELLO/Women/H_W_01.png` through `H_W_04.png`
- Men: `public/assets/CABELLO/Men/H_MAN_01.png` through `H_MAN_03.png`

When preparing a face, open the matching `WOMAN_BASE.png` or `MAN_BASE.png` as a guide, align the head and neck directly over it, then export the face on the unchanged 1500 × 2100 transparent canvas. Update the file path in `catalog.ts` if you add or rename a face. Face choices are filtered to the active character's group.

Clothing assets may be cropped. Their `grid(x, y, width, height)` in `catalog.ts` places each crop on the 1500 × 2100 body grid. Preserve the source art's proportions when choosing that rectangle. `legacyGrid()` maps the existing 512 × 1024 clothing coordinate system onto the stage.

Selecting the `CH_01_Pose` jacket switches the character to its matching `*_BASE_POSE.png` body. Other outfits use the standard `*_BASE.png` body.

See [the asset alignment guide](docs/ASSET_ALIGNMENT_GUIDE.md) for the full placement workflow and [the learning guide](docs/WARDROBE_GAME_LEARNING_GUIDE.md) for project-specific implementation notes.
