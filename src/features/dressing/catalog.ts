import type {
  CharacterDefinition,
  ClothingItem,
  ClothingSlot,
  FaceGroup,
  RunwayDefinition,
  SpriteGridFrame,
} from './model';

const STAGE_WIDTH = 1500;
const STAGE_HEIGHT = 2100;
const LEGACY_SCALE = STAGE_HEIGHT / 1024;
const LEGACY_X_OFFSET = (STAGE_WIDTH - 512 * LEGACY_SCALE) / 2;

const grid = (x: number, y: number, width: number, height: number): SpriteGridFrame => ({
  x,
  y,
  width,
  height,
});

/** Map a trimmed 512 x 1024 legacy sprite onto the base-body canvas without distorting it. */
const legacyGrid = (x: number, y: number, width: number, height: number): SpriteGridFrame =>
  grid(
    LEGACY_X_OFFSET + x * LEGACY_SCALE,
    y * LEGACY_SCALE,
    width * LEGACY_SCALE,
    height * LEGACY_SCALE,
  );

export const characters: CharacterDefinition[] = [
  {
    id: 'luna',
    name: 'Luna',
    bodySrc: '/assets/CUERPOS BASE/WOMAN_BASE.png',
    poseBodySrc: '/assets/CUERPOS BASE/WOMAN_BASE_POSE.png',
    faceSrc: '/assets/CABELLO/Women/H_W_01.png',
    faceGroup: 'woman',
    accent: 0xff7aa5,
  },
  {
    id: 'max',
    name: 'Max',
    bodySrc: '/assets/CUERPOS BASE/MAN_BASE.png',
    poseBodySrc: '/assets/CUERPOS BASE/MAN_BASE_POSE.png',
    faceSrc: '/assets/CABELLO/Men/H_MAN_01.png',
    faceGroup: 'man',
    accent: 0x7daeff,
  },
];

export const runways: RunwayDefinition[] = [
  { id: 'pasarela', name: 'Pasarela', imageSrc: '/assets/FONDOS/PASARELA.png' },
  {
    id: 'parque',
    name: 'Parque',
    imageSrc: '/assets/FONDOS/PARQUE.png',
    desktopImageSrc: '/assets/FONDOS/PARQUE HORIZONTAL.png',
  },
  { id: 'tranqui', name: 'Tranqui', imageSrc: '/assets/FONDOS/TRANQUI.png' },
  { id: 'skate', name: 'Skate', imageSrc: '/assets/FONDOS/SKATE.png' },
];

export const wardrobeItems: ClothingItem[] = [
  {
    id: 'face-woman-one',
    slot: 'face',
    name: 'Curls',
    imageSrc: '/assets/CABELLO/Women/H_W_01.png',
    description: 'Long curls',
    faceGroup: 'woman',
  },
  {
    id: 'face-woman-two',
    slot: 'face',
    name: 'Waves',
    imageSrc: '/assets/CABELLO/Women/H_W_02.png',
    description: 'Soft waves',
    faceGroup: 'woman',
  },
  {
    id: 'face-woman-three',
    slot: 'face',
    name: 'Braids',
    imageSrc: '/assets/CABELLO/Women/H_W_03.png',
    description: 'Long braids',
    faceGroup: 'woman',
  },
  {
    id: 'face-woman-four',
    slot: 'face',
    name: 'Volume',
    imageSrc: '/assets/CABELLO/Women/H_W_04.png',
    description: 'Full volume',
    faceGroup: 'woman',
  },
  {
    id: 'face-man-one',
    slot: 'face',
    name: 'Classic',
    imageSrc: '/assets/CABELLO/Men/H_MAN_01.png',
    description: 'Classic cut',
    faceGroup: 'man',
  },
  {
    id: 'face-man-two',
    slot: 'face',
    name: 'Fade',
    imageSrc: '/assets/CABELLO/Men/H_MAN_02.png',
    description: 'Fresh fade',
    faceGroup: 'man',
  },
  {
    id: 'face-man-three',
    slot: 'face',
    name: 'Coils',
    imageSrc: '/assets/CABELLO/Men/H_MAN_03.png',
    description: 'Defined coils',
    faceGroup: 'man',
  },
  {
    id: 'top-one',
    slot: 'top',
    name: 'Top 01',
    imageSrc: '/assets/optimized/top-01.png',
    description: 'Sleeveless top',
    grid: legacyGrid(111, 214, 263, 298),
  },
  {
    id: 'top-two',
    slot: 'top',
    name: 'Top 02',
    imageSrc: '/assets/optimized/top-02.png',
    description: 'Statement top',
    grid: legacyGrid(167, 235, 176, 200),
  },
  {
    id: 'top-three',
    slot: 'top',
    name: 'Top 03',
    imageSrc: '/assets/optimized/top-03.png',
    description: 'Everyday top',
    grid: legacyGrid(120, 244, 271, 215),
  },
  {
    id: 'jacket-pose',
    slot: 'top',
    name: 'CH 01 Pose',
    imageSrc: '/assets/CHAQUETAS/CH_01_Pose.png',
    description: 'Pose jacket',
  },
  {
    id: 'jacket-two',
    slot: 'top',
    name: 'Jacket 02',
    imageSrc: '/assets/optimized/jacket-02.png',
    description: 'Layered jacket',
    grid: legacyGrid(0, 108, 505, 522),
  },
  {
    id: 'jacket-three',
    slot: 'top',
    name: 'Jacket 03',
    imageSrc: '/assets/optimized/jacket-03.png',
    description: 'Outer layer',
    grid: legacyGrid(1, 114, 511, 763),
  },
  {
    id: 'bottom-one',
    slot: 'bottom',
    name: 'Bottom 01',
    imageSrc: '/assets/optimized/bottom-01.png',
    description: 'First look',
    grid: legacyGrid(139, 430, 246, 504),
  },
  {
    id: 'bottom-two',
    slot: 'bottom',
    name: 'Bottom 02',
    imageSrc: '/assets/optimized/bottom-02.png',
    description: 'Second look',
    grid: legacyGrid(7, 123, 505, 839),
  },
  {
    id: 'bottom-three',
    slot: 'bottom',
    name: 'Bottom 03',
    imageSrc: '/assets/optimized/bottom-03.png',
    description: 'Third look',
    grid: legacyGrid(142, 156, 259, 812),
  },
  {
    id: 'bottom-four',
    slot: 'bottom',
    name: 'Bottom 04',
    imageSrc: '/assets/optimized/bottom-04.png',
    description: 'Fourth look',
    grid: legacyGrid(115, 236, 286, 682),
  },
  {
    id: 'shoes-one',
    slot: 'shoes',
    name: 'Shoes 01',
    imageSrc: '/assets/optimized/shoes-01.png',
    description: 'First pair',
    grid: legacyGrid(171, 867, 201, 110),
  },
  {
    id: 'shoes-two',
    slot: 'shoes',
    name: 'Shoes 02',
    imageSrc: '/assets/optimized/shoes-02.png',
    description: 'Second pair',
    grid: legacyGrid(171, 872, 207, 115),
  },
  {
    id: 'accessory-one',
    slot: 'accessory',
    name: 'Accessory 01',
    imageSrc: '/assets/optimized/accessory-01.png',
    description: 'Finishing touch',
    grid: legacyGrid(183, 38, 146, 110),
  },
  {
    id: 'accessory-two',
    slot: 'accessory',
    name: 'Accessory 02',
    imageSrc: '/assets/optimized/accessory-02.png',
    description: 'Finishing touch',
    grid: legacyGrid(92, 230, 202, 307),
  },
  {
    id: 'accessory-three',
    slot: 'accessory',
    name: 'Accessory 03',
    imageSrc: '/assets/optimized/accessory-03.png',
    description: 'Finishing touch',
    grid: legacyGrid(1, 114, 511, 763),
  },
];

export const slotLabels: Record<ClothingSlot, string> = {
  face: 'Faces',
  top: 'Tops',
  bottom: 'Bottoms',
  shoes: 'Shoes',
  accessory: 'Accessories',
};

export function getCharacter(id: CharacterDefinition['id']) {
  return characters.find((character) => character.id === id) ?? characters[0];
}

export function getRunway(id: RunwayDefinition['id']) {
  return runways.find((runway) => runway.id === id) ?? runways[0];
}

export function getItem(id: string | null) {
  return wardrobeItems.find((item) => item.id === id);
}

export function getWardrobeItems(slot: ClothingSlot, faceGroup?: FaceGroup) {
  return wardrobeItems.filter(
    (item) => item.slot === slot && (slot !== 'face' || item.faceGroup === faceGroup),
  );
}
