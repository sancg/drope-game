import type { CSSProperties } from 'react'
import { slotLabels, wardrobeItems } from '../catalog'
import type { ClothingSlot } from '../model'
import { useDressingStore } from '../store'

const slots: ClothingSlot[] = ['top', 'bottom', 'accessory']

export function Wardrobe() {
  const wardrobeOpen = useDressingStore((state) => state.wardrobeOpen)
  const outfit = useDressingStore((state) => state.outfit)
  const equip = useDressingStore((state) => state.equip)
  const toggleWardrobe = useDressingStore((state) => state.toggleWardrobe)
  const clearOutfit = useDressingStore((state) => state.clearOutfit)

  if (!wardrobeOpen) return null

  return (
    <aside className="wardrobe-panel" id="wardrobe-panel" aria-label="Wardrobe">
      <header className="wardrobe-header">
        <div>
          <span className="eyebrow">Your collection</span>
          <h1>Wardrobe</h1>
        </div>
        <button className="icon-button" onClick={toggleWardrobe} aria-label="Close wardrobe">
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <div className="wardrobe-scroll">
        {slots.map((slot) => (
          <section className="clothing-section" key={slot} aria-labelledby={`${slot}-heading`}>
            <div className="section-heading">
              <h2 id={`${slot}-heading`}>{slotLabels[slot]}</h2>
              <span>{wardrobeItems.filter((item) => item.slot === slot).length} looks</span>
            </div>
            <div className="item-carousel">
              {wardrobeItems.filter((item) => item.slot === slot).map((item) => {
                const selected = outfit[slot] === item.id
                return (
                  <button
                    className={`clothing-card ${selected ? 'is-selected' : ''}`}
                    key={item.id}
                    onClick={() => equip(item)}
                    aria-pressed={selected}
                  >
                    <span className={`garment-preview ${item.slot}`} style={{ '--garment': item.color, '--trim': item.accent } as CSSProperties}>
                      <span />
                    </span>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <button className="clear-button" onClick={clearOutfit}>Clear outfit</button>
    </aside>
  )
}
