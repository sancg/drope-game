import type { CSSProperties } from 'react'
import type { CharacterDefinition, ClothingItem, RunwayDefinition } from '../dressing/model'

export interface SceneModel {
  character: CharacterDefinition
  runway: RunwayDefinition
  outfit: { face: ClothingItem | undefined; top: ClothingItem | undefined; bottom: ClothingItem | undefined; shoes: ClothingItem | undefined; accessory: ClothingItem | undefined }
  effectNonce: number
}

interface CharacterStageProps { scene: SceneModel }

/** Every dress-up asset has the same 512 x 1024 artboard, so image layers deliberately share an identical origin and size. */
export function CharacterStage({ scene }: CharacterStageProps) {
  const { character, runway, outfit } = scene
  const backgroundStyle = {
    '--mobile-background': `url("${runway.imageSrc}")`,
    '--desktop-background': `url("${runway.desktopImageSrc ?? runway.imageSrc}")`,
  } as CSSProperties
  const layers = [
    { src: character.bodySrc, label: `${character.name} base body` },
    outfit.bottom && { src: outfit.bottom.imageSrc, label: outfit.bottom.name },
    outfit.shoes && { src: outfit.shoes.imageSrc, label: outfit.shoes.name },
    outfit.top && { src: outfit.top.imageSrc, label: outfit.top.name },
    outfit.face ? { src: outfit.face.imageSrc, label: outfit.face.name } : { src: character.faceSrc, label: `${character.name} face` },
    outfit.accessory && { src: outfit.accessory.imageSrc, label: outfit.accessory.name },
  ].filter(Boolean) as Array<{ src: string; label: string }>

  return <div className="character-stage" style={backgroundStyle} aria-label={`${character.name} on ${runway.name}`} role="img">
    <div className="character-asset-stack">
      {layers.map((layer) => <img key={layer.src} src={layer.src} alt="" draggable={false} />)}
    </div>
  </div>
}
