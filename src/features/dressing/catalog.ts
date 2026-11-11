import type { CharacterDefinition, ClothingItem, ClothingSlot, RunwayDefinition } from './model'

export const characters: CharacterDefinition[] = [
  { id: 'nova', name: 'Nova', skin: 0xe5ad8c, hair: 0x24171c, accent: 0xff7aa5 },
  { id: 'mika', name: 'Mika', skin: 0xb96f4a, hair: 0x211829, accent: 0x8ce0d0 },
  { id: 'sky', name: 'Sky', skin: 0x8f533e, hair: 0x10131b, accent: 0xf8c95f },
]

export const runways: RunwayDefinition[] = [
  { id: 'midnight', name: 'Midnight', colors: ['#11112a', '#39366d'] },
  { id: 'rose', name: 'Rose room', colors: ['#30172e', '#c84975'] },
  { id: 'aqua', name: 'Aqua glow', colors: ['#092a3b', '#1ba8b2'] },
  { id: 'golden', name: 'Golden hour', colors: ['#4a2718', '#d58942'] },
]

export const wardrobeItems: ClothingItem[] = [
  { id: 'top-cloud', slot: 'top', name: 'Cloud tee', color: '#F5F3FF', accent: '#C4B5FD', description: 'Soft cropped tee' },
  { id: 'top-berry', slot: 'top', name: 'Berry knit', color: '#EC4899', accent: '#F9A8D4', description: 'Fitted ribbed knit' },
  { id: 'top-lime', slot: 'top', name: 'Lime jacket', color: '#B5E550', accent: '#395329', description: 'Statement jacket' },
  { id: 'bottom-ink', slot: 'bottom', name: 'Ink cargos', color: '#202436', accent: '#697491', description: 'Relaxed cargo trousers' },
  { id: 'bottom-denim', slot: 'bottom', name: 'Denim skirt', color: '#4A71B8', accent: '#A0B9E8', description: 'High-rise mini skirt' },
  { id: 'bottom-plum', slot: 'bottom', name: 'Plum flares', color: '#713C80', accent: '#D4A7DD', description: 'Soft flare trousers' },
  { id: 'accessory-pearl', slot: 'accessory', name: 'Pearl bag', color: '#F9F1E7', accent: '#D3B99E', description: 'Mini shoulder bag' },
  { id: 'accessory-star', slot: 'accessory', name: 'Star clips', color: '#F9D259', accent: '#FFF2A7', description: 'Two sparkle clips' },
  { id: 'accessory-shade', slot: 'accessory', name: 'Sunset shades', color: '#F36E5A', accent: '#241C38', description: 'Tinted sunglasses' },
]

export const slotLabels: Record<ClothingSlot, string> = {
  top: 'Tops',
  bottom: 'Bottoms',
  accessory: 'Accessories',
}

export function getCharacter(id: CharacterDefinition['id']) {
  return characters.find((character) => character.id === id) ?? characters[0]
}

export function getRunway(id: RunwayDefinition['id']) {
  return runways.find((runway) => runway.id === id) ?? runways[0]
}

export function getItem(id: string | null) {
  return wardrobeItems.find((item) => item.id === id)
}
