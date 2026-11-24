# PixiJS effects and micro-animation guide

This guide explains how to add particles and lightweight animation to the current wardrobe game without breaking the asset alignment that makes the dress-up system work.

## The important decision: what should PixiJS draw?

The game currently renders character, face, clothing, shoes, and accessory PNGs as stacked HTML `<img>` elements in `src/features/game/CharacterStage.tsx`. This is deliberate. Every supplied layer uses the same 512 × 1024 artboard, so DOM image layers preserve the illustrator's placement exactly.

PixiJS is still installed and is excellent for the things that are hard or wasteful in CSS:

- short-lived particles: sparkle, confetti, heart, dust, magic glow;
- animated image sprites and sprite sheets;
- many objects moving each frame;
- effect-only canvas rendering and blending;
- interactive 2D scenes later, if the game grows into one.

For this project, the safest first architecture is **HTML for the aligned wardrobe art, PixiJS for an effect canvas placed above it**. Do not move all of the character PNGs into PixiJS just to make one burst. That would add an asset-loading path and positioning system where the browser already does the job well.

```text
React / Zustand state
        |
        +-- CharacterStage: background + registered image layers
        |
        +-- PixiEffects: transparent canvas, only visual effects
```

## Learn these topics, in this order

1. **Pixi display tree**: `Application`, `Container`, `Sprite`, and `Graphics`.
2. **The ticker**: Pixi calls your small update function each frame; update position, opacity, scale, and rotation there.
3. **Texture loading**: use `Assets.load()` once, rather than recreating image data every frame.
4. **Coordinates and resizing**: relate an effect to a CSS container, never to a fixed phone size.
5. **Lifecycle cleanup**: create Pixi in React `useEffect`, then remove the ticker, observer, canvas, and application during cleanup.
6. **Performance budgets**: cap particles, respect reduced motion, and profile on a real phone.

Do not start with a particle package. A hand-written burst of 12–30 sprites teaches the relevant concepts, gives you full creative control, and is enough for most wardrobe feedback.

## Key PixiJS concepts in plain language

| Pixi term | Plain-language meaning | Use in this game |
| --- | --- | --- |
| `Application` | The canvas renderer plus frame ticker. | One transparent effect canvas. |
| `Container` | A group that can move/scale/rotate its children together. | Group all particles for one equip burst. |
| `Sprite` | An image that Pixi can draw and transform. | A sparkle, heart, or tiny clothing-tag image. |
| `Texture` | The image data used by one or more sprites. | Load one `sparkle.png`; reuse it for every sparkle. |
| `Graphics` | Vector shapes drawn in code. | Quick circles or stars before final art exists. |
| `ticker` | A callback run once per rendered frame. | Move, fade, and remove particles. |
| `Assets` | Pixi's asset loader/cache. | Preload effect textures before a burst is allowed. |

## How the existing game signals an effect

`src/features/dressing/store.ts` already changes `effectNonce` whenever the user equips an item, clears the outfit, or chooses a character. `src/app/App.tsx` includes that value in `SceneModel` and passes it to `CharacterStage`.

Treat `effectNonce` as an event signal, not as a counter that contains game data:

```text
User chooses Jacket 02
  -> equip(item)
  -> outfit.top changes and effectNonce receives Date.now()
  -> React rerenders
  -> PixiEffects sees a new effectNonce and launches one burst
```

That makes the effect play once even when the chosen item is otherwise identical. A later game with different effects can pass a typed effect payload such as `{ kind: 'equip', color: '#ffd4e6' }` instead.

## Recommended file structure

```text
public/assets/
  PARTICLES/
    sparkle.png
    heart.png
src/features/game/
  CharacterStage.tsx       # registered wardrobe image layers
  PixiEffects.tsx          # transparent effect canvas
  particles.ts             # effect recipes and particle types
```

Use a small transparent PNG for final particle art. A 32–96 px square source image is usually enough. Do not use a 1024 px photo as a particle.

## A complete first effect component

Create `src/features/game/PixiEffects.tsx` and use the following as a learning-quality first implementation. It uses Pixi v8, which is the version in this project.

```tsx
import { useEffect, useRef } from 'react'
import { Application, Assets, Container, Sprite, Texture } from 'pixi.js'

type Particle = {
  sprite: Sprite
  vx: number
  vy: number
  gravity: number
  spin: number
  age: number
  lifetime: number
}

interface PixiEffectsProps {
  effectNonce: number
  reducedMotion?: boolean
}

export function PixiEffects({ effectNonce, reducedMotion = false }: PixiEffectsProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const burstRef = useRef<(() => void>(() => undefined)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const app = new Application()
    let destroyed = false
    let removeTicker = () => undefined

    async function start() {
      await app.init({
        resizeTo: host,
        backgroundAlpha: 0,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        antialias: true,
      })
      if (destroyed) return

      app.canvas.setAttribute('aria-hidden', 'true')
      host.appendChild(app.canvas)

      const texture = await Assets.load<Texture>('/assets/PARTICLES/sparkle.png')
      if (destroyed) return

      const particles = new Container()
      app.stage.addChild(particles)
      const active: Particle[] = []

      burstRef.current = () => {
        if (reducedMotion) return
        const x = app.screen.width / 2
        const y = app.screen.height * 0.53

        for (let index = 0; index < 18; index += 1) {
          const sprite = new Sprite(texture)
          sprite.anchor.set(0.5)
          sprite.x = x
          sprite.y = y
          sprite.alpha = 1
          sprite.scale.set(0.22 + Math.random() * 0.18)
          particles.addChild(sprite)

          const angle = (Math.PI * 2 * index) / 18 + (Math.random() - 0.5) * 0.35
          const speed = 1.9 + Math.random() * 2.3
          active.push({
            sprite,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.8,
            gravity: 0.055,
            spin: (Math.random() - 0.5) * 0.16,
            age: 0,
            lifetime: 34 + Math.random() * 14,
          })
        }
      }

      const tick = () => {
        for (let index = active.length - 1; index >= 0; index -= 1) {
          const particle = active[index]
          particle.age += 1
          particle.sprite.x += particle.vx
          particle.sprite.y += particle.vy
          particle.vy += particle.gravity
          particle.sprite.rotation += particle.spin
          particle.sprite.alpha = Math.max(0, 1 - particle.age / particle.lifetime)

          if (particle.age >= particle.lifetime) {
            particle.sprite.destroy()
            active.splice(index, 1)
          }
        }
      }

      app.ticker.add(tick)
      removeTicker = () => app.ticker.remove(tick)
    }

    void start()
    return () => {
      destroyed = true
      burstRef.current = () => undefined
      removeTicker()
      app.destroy(true, { children: true })
    }
  }, [reducedMotion])

  useEffect(() => {
    if (effectNonce) burstRef.current()
  }, [effectNonce])

  return <div className="pixi-effects" ref={hostRef} />
}
```

### What each part is doing

- `resizeTo: host` makes the renderer match the effect host whenever the host changes size. This is more reliable than calculating a canvas size only once.
- `backgroundAlpha: 0` makes the canvas transparent, allowing the character and background below it to remain visible.
- `resolution: Math.min(devicePixelRatio, 2)` keeps effects sharp on high-density screens without asking a phone to draw a 3× canvas.
- `Assets.load` loads the PNG once. Every `Sprite` shares the loaded texture, which is cheap.
- `active` holds only currently visible particles. Finished sprites are destroyed and removed.
- The reverse `for` loop allows safe removal from `active` during the update.
- `destroyed` prevents an asynchronous load from appending a canvas after React has unmounted the component.

## Connect the component to the stage

Import and render it in `CharacterStage.tsx` after the image stack:

```tsx
import { PixiEffects } from './PixiEffects'

// Inside .character-stage, after .character-asset-stack:
<PixiEffects effectNonce={scene.effectNonce} />
```

Add this CSS in `src/styles/global.css`:

```css
.pixi-effects,
.pixi-effects canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.pixi-effects { z-index: 1; }
```

The image stack does not need a z-index because the Pixi effect is later in the DOM and has its own stacking level. Keep the interactive React controls above it; `pointer-events: none` ensures effects never block a wardrobe tap.

## Correct canvas sizing and coordinate placement

There are three different sizes to keep separate:

| Size | Example | Why it matters |
| --- | --- | --- |
| Source art size | 512 × 1024 character PNG | Must be identical across aligned dress-up layers. |
| CSS layout size | e.g. 374 × 749 on a phone | The image stack's visible size after responsive CSS. |
| Canvas backing resolution | CSS size × `resolution` | The number of pixels Pixi actually draws for sharpness. |

Never set `canvas.width = window.innerWidth` by hand when using `resizeTo: host`; doing both produces confusing scale and blur bugs. Give the host a real CSS size (`position: absolute; inset: 0`) and let Pixi track it.

For an effect at the visual centre of the character, use the stage proportion first:

```ts
const x = app.screen.width * 0.5
const y = app.screen.height * 0.53
```

If you later need an effect attached to a precise feature, convert from the character's artboard coordinates. The current image stack is positioned with CSS, so obtain its `getBoundingClientRect()` and map a source coordinate:

```ts
const stack = document.querySelector('.character-asset-stack')!
const rect = stack.getBoundingClientRect()
const artX = 256 // centre in the 512 px source artboard
const artY = 260 // example: face centre
const x = rect.left - hostRect.left + (artX / 512) * rect.width
const y = rect.top - hostRect.top + (artY / 1024) * rect.height
```

Use this only when needed. A percentage-based position is easier to maintain for a general outfit burst.

## Adding and animating images

For a static effect image, create a sprite once:

```ts
const texture = await Assets.load<Texture>('/assets/PARTICLES/heart.png')
const heart = new Sprite(texture)
heart.anchor.set(0.5)
heart.position.set(app.screen.width / 2, app.screen.height / 2)
heart.scale.set(0.4)
app.stage.addChild(heart)
```

Then animate a few properties in the ticker. Small loops are more polished than a large, constant movement:

```ts
let elapsed = 0
app.ticker.add(() => {
  elapsed += 1
  heart.y = app.screen.height * 0.5 + Math.sin(elapsed / 20) * 6
  heart.rotation = Math.sin(elapsed / 35) * 0.08
  heart.alpha = 0.75 + Math.sin(elapsed / 24) * 0.15
})
```

For a sprite sheet, use `AnimatedSprite` with an array of textures. Use that for an animated twinkle or a pop, not for the entire character unless you are intentionally moving to a Pixi-first renderer.

## Effect recipes worth adding first

| Player event | Effect | Implementation hint |
| --- | --- | --- |
| Equip any item | 12–18 sparkles that expand and fade. | Use the example burst. |
| Equip accessory | 6 tiny stars around the face or hand. | Start the burst at a mapped artboard coordinate. |
| Change face | Two or three soft hearts that float upward. | Lower gravity and longer lifetime. |
| Clear outfit | A short, subtle dissolve of neutral dots. | Use a muted texture; do not celebrate a destructive action. |
| Change background | A one-time colour wash/fade. | Prefer CSS opacity transition; no Pixi needed. |

## Performance and accessibility checklist

- Start at 18 particles; stay under 40 concurrent particles on a typical phone until you profile.
- Load textures once and reuse them. Never call `Assets.load` from inside the ticker.
- Destroy sprites that have finished; do not leave invisible objects in `stage.children`.
- Cap `resolution` at 2.
- Use `prefers-reduced-motion` to skip decorative bursts or show only a very short fade.
- Do not put game information solely in a particle animation. A selected wardrobe card must still clearly show the selected state.
- Avoid filters, blur, masks, and huge texture files in the first version; each can be expensive on mobile GPUs.
- Test with browser performance tools on a real phone, not only a laptop.

## Common mistakes and how to fix them

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Canvas is blurry | Backing resolution does not account for device pixel ratio. | Use `autoDensity: true` and a capped `resolution`. |
| Effect does not resize after rotating a phone | Canvas was sized once using `window.innerWidth`. | Give the host dimensions and use `resizeTo: host`. |
| Effects block taps | The canvas captures pointer events. | Add `pointer-events: none`. |
| Burst gets slower every click | Old particles/tickers remain alive. | Destroy expired sprites and remove ticker on cleanup. |
| Image repeats network downloads | Textures are loaded per interaction. | `Assets.load` once at setup and reuse the texture. |
| Clothing shifts after adding a Pixi effect | Character positioning was duplicated in two coordinate systems. | Keep wardrobe layers in one DOM stack; Pixi draws effects only. |

## When to move the whole character to PixiJS

Use PixiJS for all character layers only when the product needs things CSS image layers cannot comfortably provide: drag-and-drop placement, skeletal animation, depth sorting during movement, hundreds of scene objects, or a 2D world. At that point, make a planned migration: define one logical scene size, load all sprite textures through Pixi assets, use one shared anchor, and create a test matrix for each body/face/outfit combination. For effects and micro-animation alone, the hybrid approach above is simpler and more robust.
