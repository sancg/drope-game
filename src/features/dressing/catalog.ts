import type { CharacterDefinition, ClothingItem, ClothingSlot, RunwayDefinition } from './model'

export const characters: CharacterDefinition[] = [
  { id: 'luna', name: 'Luna', bodySrc: '/assets/CUERPOS BASE/CUERPO MUJER.png', faceSrc: '/assets/CABELLO/CABELLO 01.png', accent: 0xff7aa5 },
  { id: 'sol', name: 'Sol', bodySrc: '/assets/CUERPOS BASE/MODIFICACION CUERPO MUJER.png', faceSrc: '/assets/CABELLO/CABELLO 02.png', accent: 0x8ce0d0 },
  { id: 'leo', name: 'Leo', bodySrc: '/assets/CUERPOS BASE/CUERPO D HOMBRE.png', faceSrc: '/assets/CABELLO/R HOMBRE 01.png', accent: 0xf8c95f },
  { id: 'max', name: 'Max', bodySrc: '/assets/CUERPOS BASE/MODIFICACION CUERPO HOMBRE.png', faceSrc: '/assets/CABELLO/R HOMBRE 02.png', accent: 0x7daeff },
]

export const runways: RunwayDefinition[] = [
  { id: 'pasarela', name: 'Pasarela', imageSrc: '/assets/FONDOS/PASARELA.png' },
  { id: 'parque', name: 'Parque', imageSrc: '/assets/FONDOS/PARQUE.png', desktopImageSrc: '/assets/FONDOS/PARQUE HORIZONTAL.png' },
  { id: 'tranqui', name: 'Tranqui', imageSrc: '/assets/FONDOS/TRANQUI.png' },
  { id: 'skate', name: 'Skate', imageSrc: '/assets/FONDOS/SKATE.png' },
]

export const wardrobeItems: ClothingItem[] = [
  { id: 'face-curls', slot: 'face', name: 'Curly', imageSrc: '/assets/CABELLO/CABELLO 01.png', description: 'Warm curls' },
  { id: 'face-wave', slot: 'face', name: 'Wavy', imageSrc: '/assets/CABELLO/CABELLO 02.png', description: 'Soft waves' },
  { id: 'face-bob', slot: 'face', name: 'Bob', imageSrc: '/assets/CABELLO/CABELLO 03.png', description: 'Short bob' },
  { id: 'face-pink', slot: 'face', name: 'Pink', imageSrc: '/assets/CABELLO/CABELLO 04.png', description: 'Pink style' },
  { id: 'face-man-one', slot: 'face', name: 'Classic', imageSrc: '/assets/CABELLO/R HOMBRE 01.png', description: 'Classic cut' },
  { id: 'face-man-two', slot: 'face', name: 'Fade', imageSrc: '/assets/CABELLO/R HOMBRE 02.png', description: 'Fresh fade' },
  { id: 'face-man-three', slot: 'face', name: 'Coils', imageSrc: '/assets/CABELLO/R HOMBRE 03.png', description: 'Defined coils' },
  { id: 'top-one', slot: 'top', name: 'Top 01', imageSrc: '/assets/CAMISAS/camisa 01.png', description: 'Sleeveless top' },
  { id: 'top-two', slot: 'top', name: 'Top 02', imageSrc: '/assets/CAMISAS/CAMISA 02.png', description: 'Statement top' },
  { id: 'top-three', slot: 'top', name: 'Top 03', imageSrc: '/assets/CAMISAS/CAMISA 03.png', description: 'Everyday top' },
  { id: 'jacket-one', slot: 'top', name: 'Jacket 01', imageSrc: '/assets/CHAQUETAS/CHQUETA 01 FIGURIN MODIFICADO.png', description: 'Styled jacket' },
  { id: 'jacket-two', slot: 'top', name: 'Jacket 02', imageSrc: '/assets/CHAQUETAS/CHAQUETA 02.png', description: 'Layered jacket' },
  { id: 'jacket-three', slot: 'top', name: 'Jacket 03', imageSrc: '/assets/CHAQUETAS/CHAQUETA 03.png', description: 'Outer layer' },
  { id: 'bottom-one', slot: 'bottom', name: 'Bottom 01', imageSrc: '/assets/PANTALONES/PANTALON 01.png', description: 'First look' },
  { id: 'bottom-two', slot: 'bottom', name: 'Bottom 02', imageSrc: '/assets/PANTALONES/PANTALON 02.png', description: 'Second look' },
  { id: 'bottom-three', slot: 'bottom', name: 'Bottom 03', imageSrc: '/assets/PANTALONES/PANTALON 03.png', description: 'Third look' },
  { id: 'bottom-four', slot: 'bottom', name: 'Bottom 04', imageSrc: '/assets/PANTALONES/PANTALON 04.png', description: 'Fourth look' },
  { id: 'shoes-one', slot: 'shoes', name: 'Shoes 01', imageSrc: '/assets/ZAPATOS/ZAPATOS 01.png', description: 'First pair' },
  { id: 'shoes-two', slot: 'shoes', name: 'Shoes 02', imageSrc: '/assets/ZAPATOS/ZAPATOS 02.png', description: 'Second pair' },
  { id: 'accessory-one', slot: 'accessory', name: 'Accessory 01', imageSrc: '/assets/ACCESORIOS/ACCESORIO 1.png', description: 'Finishing touch' },
  { id: 'accessory-two', slot: 'accessory', name: 'Accessory 02', imageSrc: '/assets/ACCESORIOS/ACCESORIO 2.png', description: 'Finishing touch' },
  { id: 'accessory-three', slot: 'accessory', name: 'Accessory 03', imageSrc: '/assets/ACCESORIOS/ACCESORIO 03.png', description: 'Finishing touch' },
]

export const slotLabels: Record<ClothingSlot, string> = {
  face: 'Faces',
  top: 'Tops',
  bottom: 'Bottoms',
  shoes: 'Shoes',
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
