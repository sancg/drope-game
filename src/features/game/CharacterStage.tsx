import type { CSSProperties } from 'react';
import type {
  CharacterDefinition,
  ClothingItem,
  RunwayDefinition,
  SpriteGridFrame,
} from '../dressing/model';

export interface SceneModel {
  character: CharacterDefinition;
  runway: RunwayDefinition;
  outfit: {
    face: ClothingItem | undefined;
    top: ClothingItem | undefined;
    bottom: ClothingItem | undefined;
    shoes: ClothingItem | undefined;
    accessory: ClothingItem | undefined;
  };
  effectNonce: number;
}

interface CharacterStageProps {
  scene: SceneModel;
}

function gridStyle(frame: SpriteGridFrame): CSSProperties {
  return {
    left: `${(frame.x / 1500) * 100}%`,
    top: `${(frame.y / 2100) * 100}%`,
    width: `${(frame.width / 1500) * 100}%`,
    height: `${(frame.height / 2100) * 100}%`,
  };
}

/** One 1500 x 2100 grid controls the body and every layer, regardless of PNG crop size. */
export function CharacterStage({ scene }: CharacterStageProps) {
  const { character, runway, outfit } = scene;
  const usesPoseBase = outfit.top?.id === 'jacket-pose';
  const backgroundStyle = {
    '--mobile-background': `url("${runway.imageSrc}")`,
    '--desktop-background': `url("${runway.desktopImageSrc ?? runway.imageSrc}")`,
  } as CSSProperties;
  const layers = [
    {
      src: usesPoseBase ? character.poseBodySrc : character.bodySrc,
      label: `${character.name} ${usesPoseBase ? 'pose' : 'base'} body`,
      kind: 'body',
    },
    outfit.face
      ? { src: outfit.face.imageSrc, label: outfit.face.name, kind: 'face' }
      : { src: character.faceSrc, label: `${character.name} face`, kind: 'face' },
    outfit.bottom && {
      src: outfit.bottom.imageSrc,
      label: outfit.bottom.name,
      kind: 'bottom',
      grid: outfit.bottom.grid,
    },
    outfit.shoes && {
      src: outfit.shoes.imageSrc,
      label: outfit.shoes.name,
      kind: 'shoes',
      grid: outfit.shoes.grid,
    },
    outfit.top && {
      src: outfit.top.imageSrc,
      label: outfit.top.name,
      kind: 'top',
      grid: outfit.top.grid,
    },
    outfit.accessory && {
      src: outfit.accessory.imageSrc,
      label: outfit.accessory.name,
      kind: 'accessory',
      grid: outfit.accessory.grid,
    },
  ].filter(Boolean) as Array<{
    src: string;
    label: string;
    kind: string;
    grid?: SpriteGridFrame;
  }>;

  return (
    <div
      className='character-stage'
      style={backgroundStyle}
      aria-label={`${character.name} on ${runway.name}`}
      role='img'
    >
      <div className='character-asset-stack'>
        {layers.map((layer) => (
          <img
            className={`stage-layer stage-layer--${layer.kind} ${layer.grid ? 'stage-layer--gridded' : ''}`}
            key={layer.src}
            src={layer.src}
            style={layer.grid ? gridStyle(layer.grid) : undefined}
            alt=''
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
