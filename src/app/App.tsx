import { useMemo } from 'react'
import { getCharacter, getItem, getRunway } from '../features/dressing/catalog'
import { CharacterPicker } from '../features/dressing/components/CharacterPicker'
import { RunwayPicker } from '../features/dressing/components/RunwayPicker'
import { Wardrobe } from '../features/dressing/components/Wardrobe'
import { useDressingStore } from '../features/dressing/store'
import { CharacterStage } from '../features/game/CharacterStage'

export function App() {
  const activeCharacterId = useDressingStore((state) => state.activeCharacterId)
  const activeRunwayId = useDressingStore((state) => state.activeRunwayId)
  const outfit = useDressingStore((state) => state.outfit)
  const effectNonce = useDressingStore((state) => state.effectNonce)
  const wardrobeOpen = useDressingStore((state) => state.wardrobeOpen)
  const toggleWardrobe = useDressingStore((state) => state.toggleWardrobe)
  const sceneModel = useMemo(() => ({
    character: getCharacter(activeCharacterId),
    runway: getRunway(activeRunwayId),
    outfit: {
      face: getItem(outfit.face),
      top: getItem(outfit.top),
      bottom: getItem(outfit.bottom),
      shoes: getItem(outfit.shoes),
      accessory: getItem(outfit.accessory),
    },
    effectNonce,
  }), [activeCharacterId, activeRunwayId, effectNonce, outfit])

  return (
    <main className={`app-shell ${wardrobeOpen ? 'wardrobe-is-open' : ''}`}>
      <section className="game-screen" aria-label="Runway dressing room">
        <CharacterStage scene={sceneModel} />
        <div className="screen-shade" />
        <header className="game-header">
          <div className="brand-lockup">
            <span className="brand-mark">✦</span>
            <span>atelier</span>
          </div>
          <button className="wardrobe-button" onClick={toggleWardrobe} aria-expanded={wardrobeOpen} aria-controls="wardrobe-panel">
            <span className="wardrobe-icon" aria-hidden="true">⌑</span>
            <span>Wardrobe</span>
          </button>
        </header>

        <div className="scene-title" aria-live="polite">
          <span className="eyebrow">Choose a face, make it yours</span>
          <p>{sceneModel.character.name} is ready to style.</p>
        </div>

        <footer className="game-controls">
          <CharacterPicker />
          <div className="runway-control">
            <span className="eyebrow">Set</span>
            <RunwayPicker />
          </div>
        </footer>
      </section>
      <Wardrobe />
    </main>
  )
}
