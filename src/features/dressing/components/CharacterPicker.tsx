import type { CSSProperties } from 'react'
import { characters } from '../catalog'
import { useDressingStore } from '../store'

export function CharacterPicker() {
  const activeCharacterId = useDressingStore((state) => state.activeCharacterId)
  const selectCharacter = useDressingStore((state) => state.selectCharacter)

  return (
    <div className="character-picker" aria-label="Choose a character">
      <span className="eyebrow">Model</span>
      <div className="avatar-list">
        {characters.map((character) => (
          <button
            className={`avatar-button ${activeCharacterId === character.id ? 'is-selected' : ''}`}
            key={character.id}
            onClick={() => selectCharacter(character.id)}
            aria-pressed={activeCharacterId === character.id}
          >
            <span className="avatar-swatch" style={{ '--avatar-accent': `#${character.accent.toString(16)}` } as CSSProperties} />
            <span>{character.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
