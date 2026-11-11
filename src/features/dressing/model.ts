export type ClothingSlot = 'top' | 'bottom' | 'accessory'

export type CharacterId = 'nova' | 'mika' | 'sky'

export type RunwayId = 'midnight' | 'rose' | 'aqua' | 'golden'

export interface CharacterDefinition {
  id: CharacterId
  name: string
  skin: number
  hair: number
  accent: number
}

export interface RunwayDefinition {
  id: RunwayId
  name: string
  colors: [string, string]
}

export interface ClothingItem {
  id: string
  slot: ClothingSlot
  name: string
  color: string
  accent: string
  description: string
}

export type Outfit = Record<ClothingSlot, string | null>

export interface DressingState {
  activeCharacterId: CharacterId
  activeRunwayId: RunwayId
  outfit: Outfit
  wardrobeOpen: boolean
  effectNonce: number
  selectCharacter: (id: CharacterId) => void
  selectRunway: (id: RunwayId) => void
  equip: (item: ClothingItem) => void
  toggleWardrobe: () => void
  clearOutfit: () => void
}
