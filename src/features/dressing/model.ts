export type ClothingSlot = 'face' | 'top' | 'bottom' | 'shoes' | 'accessory'

export type CharacterId = 'luna' | 'max'

export type FaceGroup = 'woman' | 'man'

export type RunwayId = 'pasarela' | 'parque' | 'tranqui' | 'skate'

export interface CharacterDefinition {
  id: CharacterId
  name: string
  bodySrc: string
  poseBodySrc: string
  faceSrc: string
  faceGroup: FaceGroup
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
  faceGroup?: FaceGroup
  /** Placement of a cropped PNG on the shared 1500 x 2100 base-body canvas. */
  grid?: SpriteGridFrame
}

export interface SpriteGridFrame {
  x: number
  y: number
  width: number
  height: number
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
