# Wardrobe UI improvement guide

This document is a practical design backlog for making the wardrobe game feel clearer, more playful, and more complete while keeping its mobile-first layout.

## First principle: improve feedback before adding decoration

The most valuable UI improvements help a player answer three questions instantly:

1. Who am I styling right now?
2. What am I allowed to change?
3. What changed after I tapped?

Current controls already expose model, set, and wardrobe. Build on that structure instead of adding competing panels or permanent labels everywhere.

## A useful visual hierarchy

```text
Top:     brand + one clear wardrobe action
Middle:  character, scene, and only the current styling prompt
Bottom:  character and set choices
Panel:   wardrobe categories and selected item state
```

On a phone, the character is the reward. Do not allow large controls or long titles to cover the face, outfit, or feet.

## High-impact improvements, ordered by value

| Improvement | Player benefit | Main files | Complexity |
| --- | --- | --- | --- |
| Show the selected item name near the character | Confirms what changed without reopening the panel. | `App.tsx`, `global.css` | Low |
| Give each character picker a real face thumbnail | Makes model choice more meaningful than a colour dot. | `CharacterPicker.tsx`, `catalog.ts` | Low |
| Use real cropped art in wardrobe cards | Lets the player recognize items before reading. | `Wardrobe.tsx`, `global.css` | Already started |
| Add category tabs or sticky category navigation | Reduces scrolling in a larger collection. | `Wardrobe.tsx`, `global.css` | Medium |
| Add an outfit summary / equipped-state strip | Shows face, top, bottom, shoes, accessory at once. | New component + store selectors | Medium |
| Add a camera/save-look flow | Gives a goal and creates a shareable result. | New feature | Medium |
| Add unlocks, challenges, or style scores | Creates replay value. | New state and content | High |

## 1. Make selection state unmistakable

Every tappable choice needs more than a colour change. A good selected card can use three signals:

- a visible border or ring;
- a small checkmark badge;
- an `aria-pressed="true"` state for assistive technology.

The wardrobe cards already use `aria-pressed`. Add a checkmark without changing the card's layout dramatically:

```tsx
<button className={`clothing-card ${selected ? 'is-selected' : ''}`} aria-pressed={selected}>
  {selected && <span className="selection-badge" aria-hidden="true">✓</span>}
  {/* preview and labels */}
</button>
```

```css
.clothing-card { position: relative; }
.selection-badge {
  position: absolute;
  top: .45rem;
  right: .45rem;
  width: 1.35rem;
  height: 1.35rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #fff;
  color: #4b1836;
  font-weight: 700;
}
```

Keep the checkmark outside the actual asset preview so the preview remains legible.

## 2. Improve character and background controls

The colour swatches are compact, but characters are fundamentally visual. Add a `thumbnailSrc` to `CharacterDefinition`, ideally a small crop of the matching face art. Render it in `CharacterPicker` instead of a solid circle.

For scene backgrounds, keep the compact dots but add a text label for the active choice. A player should not have to memorize that the third dot means Tranqui.

```tsx
<p className="selected-set" aria-live="polite">Set: {sceneModel.runway.name}</p>
```

Avoid auto-advancing carousels, hidden gestures, or icon-only controls for these core selections.

## 3. Add an outfit summary

An outfit summary works especially well when the wardrobe sheet is closed. It could live just above the bottom controls and show a compact list such as:

```text
Face: Curly   Top: Jacket 02   Bottom: Bottom 01   Shoes: Shoes 02
```

Make each populated token a button that opens the wardrobe and scrolls to the corresponding category later. Initially, even a non-interactive summary is useful. It gives the player confidence that the state is saved and makes a full look feel intentional.

## 4. Organize a growing wardrobe

The current horizontal rows are good for a small catalogue. When more than roughly 8–10 items per category are available, use a sticky tab row:

```text
[ Faces ] [ Tops ] [ Bottoms ] [ Shoes ] [ Accessories ]
```

Good behavior:

- tap a tab to scroll its section into view;
- keep the tab row visible while the panel scrolls;
- show item counts only if they are meaningful;
- retain horizontal product rows for easy one-handed browsing.

Do not replace every row with a dense grid on mobile. Horizontal rows keep asset art larger and better support a touch-first browse flow.

## 5. Add micro-interactions carefully

Micro-interactions should confirm direct player actions, not constantly compete with the art.

| Interaction | Recommended treatment | Avoid |
| --- | --- | --- |
| Tap wardrobe card | 120–180 ms scale-down, selected border, small sparkle burst. | Long bouncy animations that delay selection. |
| Open wardrobe | Bottom-sheet slide with opacity. | Full-screen takeover with no clear close control. |
| Change face | Tiny pop or fade on the head layer. | A spinning character that obscures the face. |
| Change scene | Background cross-fade. | A dramatic flash that harms readability. |
| Clear outfit | Confirmation only if the player would lose saved progress. | A modal confirmation for a reversible local action. |

Respect the existing `prefers-reduced-motion` CSS block. The UI must remain fully usable with animation disabled.

## 6. Use spacing, contrast, and touch targets as design tools

Mobile UI quality is often more about these three things than additional graphics:

- Keep interactive controls at least 44 × 44 CSS pixels.
- Place enough contrast behind white text; the current scene overlay is the right idea, but test it against every supplied background.
- Use a small spacing scale, for example 4, 8, 12, 16, 24, and 32 px, instead of arbitrary gaps.
- Preserve safe-area padding at the top and bottom on phones with notches or home indicators.
- Never rely on pink versus green alone to show a selected state; include a ring, check, or text.

## 7. Accessibility additions worth making now

- Keep buttons as real `<button>` elements.
- Give preview images empty alt text when the card label already describes the item; this avoids duplicate screen-reader speech.
- Keep `aria-pressed` on selectable controls.
- Use an `aria-live="polite"` status message for meaningful choices, such as “Jacket 02 equipped.”
- Return focus to the Wardrobe button when the sheet closes.
- Test keyboard Tab order even if the game is primarily touch-driven.
- Maintain readable contrast for text over all five backgrounds.

## 8. A practical next sprint

If the goal is a noticeably better game in a short iteration, make these changes in this order:

1. Add a check badge to selected cards and an active set label.
2. Replace character colour dots with face thumbnails.
3. Add the equip sparkle effect described in `PIXIJ_EFFECTS_AND_ANIMATION_GUIDE.md`.
4. Add a compact outfit summary above the controls.
5. Test each background at a 390 × 844 viewport and on one real phone.

This sequence improves clarity first, then delight, without requiring new backend systems or a redesign.

## UI review checklist

Before considering a UI change complete, verify:

- The player can still see the full outfit on a 390 × 844 viewport.
- The selected state is obvious without colour alone.
- Touch targets are at least 44 px.
- The wardrobe is closable and keyboard focus remains sensible.
- Text has acceptable contrast on Pasarela, Parque, Tranqui, and Skate backgrounds.
- Motion is brief, optional, and does not block input.
- The change works with long item names and with the wardrobe panel open.
