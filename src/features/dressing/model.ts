export type ClothingSlot = 'face' | 'top' | 'bottom' | 'shoes' | 'accessory'

export type CharacterId = 'luna' | 'sol' | 'leo' | 'max'

export type RunwayId = 'pasarela' | 'parque' | 'tranqui' | 'skate'

export interface CharacterDefinition {
  id: CharacterId
  name: string
  bodySrc: string
  faceSrc: string
  accent: number
}

export interface RunwayDefinition {
  id: RunwayId
  name: string
  imageSrc: string
  desktopImageSrc?: string
}

export interface ClothingItem {
  id: string
  slot: ClothingSlot
  name: string
  imageSrc: string
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
