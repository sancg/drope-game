import { useEffect, useRef } from 'react'
import { Application, Container, Graphics } from 'pixi.js'
import type { CharacterDefinition, ClothingItem, RunwayDefinition } from '../dressing/model'

export interface SceneModel {
  character: CharacterDefinition
  runway: RunwayDefinition
  outfit: {
    top: ClothingItem | undefined
    bottom: ClothingItem | undefined
    accessory: ClothingItem | undefined
  }
  effectNonce: number
}

interface CharacterStageProps {
  scene: SceneModel
}

const hex = (color: string) => Number.parseInt(color.replace('#', ''), 16)

function shape(draw: (graphics: Graphics) => void) {
  const graphics = new Graphics()
  draw(graphics)
  return graphics
}

export function CharacterStage({ scene }: CharacterStageProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef(scene)
  const redrawRef = useRef<(burst: boolean) => void>(() => undefined)

  useEffect(() => {
    sceneRef.current = scene
    redrawRef.current(false)
  }, [scene])

  useEffect(() => {
    if (scene.effectNonce) redrawRef.current(true)
  }, [scene.effectNonce])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const app = new Application()
    let destroyed = false
    let initialized = false
    let removeTicker = () => undefined
    let observer: ResizeObserver | undefined

    const start = async () => {
      await app.init({
        width: Math.max(host.clientWidth, 1),
        height: Math.max(host.clientHeight, 1),
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      })
      initialized = true
      if (destroyed) {
        app.destroy()
        return
      }

      app.canvas.setAttribute('aria-label', 'Animated dressing character on runway')
      app.canvas.setAttribute('role', 'img')
      host.appendChild(app.canvas)

      let characterLayer: Container | undefined
      let particleLayer: Container | undefined
      let particleLife = 0
      const particleVelocity: Array<{ x: number; y: number; rotation: number }> = []

      const redraw = (burst: boolean) => {
        const { width, height } = app.screen
        const model = sceneRef.current
        app.stage.removeChildren().forEach((child) => child.destroy({ children: true }))
        particleVelocity.length = 0

        const background = shape((g) => {
          g.rect(0, 0, width, height).fill(hex(model.runway.colors[0]))
          for (let index = 0; index < 6; index += 1) {
            const alpha = 0.04 + index * 0.012
            g.circle(width * (0.1 + index * 0.19), height * (0.12 + (index % 2) * 0.11), width * 0.3).fill({ color: hex(model.runway.colors[1]), alpha })
          }
        })
        app.stage.addChild(background)

        const runway = shape((g) => {
          const horizon = height * 0.62
          g.moveTo(width * 0.35, horizon).lineTo(width * 0.65, horizon).lineTo(width * 1.05, height).lineTo(width * -0.05, height).closePath().fill({ color: 0xf8f2ef, alpha: 0.92 })
          g.moveTo(width * 0.47, horizon).lineTo(width * 0.53, horizon).lineTo(width * 0.57, height).lineTo(width * 0.43, height).closePath().fill({ color: 0xffffff, alpha: 0.85 })
          g.moveTo(0, horizon).lineTo(width, horizon).stroke({ color: 0xffffff, alpha: 0.35, width: 2 })
        })
        app.stage.addChild(runway)

        const scale = Math.min(width / 390, height / 740)
        const anchorX = width / 2
        const anchorY = height * 0.54
        characterLayer = new Container({ x: anchorX, y: anchorY, scale })
        const shadow = shape((g) => g.ellipse(0, 205, 52, 12).fill({ color: 0x121221, alpha: 0.28 }))
        characterLayer.addChild(shadow)

        const { character, outfit } = model
        const legs = shape((g) => {
          g.roundRect(-39, 83, 32, 112, 15).fill(character.skin)
          g.roundRect(7, 83, 32, 112, 15).fill(character.skin)
          g.roundRect(-52, 184, 46, 17, 8).fill(0xf7f7fb)
          g.roundRect(6, 184, 46, 17, 8).fill(0xf7f7fb)
        })
        characterLayer.addChild(legs)

        if (outfit.bottom) {
          const bottom = shape((g) => {
            const color = hex(outfit.bottom!.color)
            if (outfit.bottom!.id === 'bottom-denim') {
              g.roundRect(-51, 72, 102, 63, 10).fill(color)
              g.moveTo(-51, 121).lineTo(51, 121).stroke({ color: hex(outfit.bottom!.accent), width: 3, alpha: 0.7 })
            } else {
              g.roundRect(-43, 76, 35, 112, 10).fill(color)
              g.roundRect(8, 76, 35, 112, 10).fill(color)
              g.moveTo(0, 82).lineTo(0, 183).stroke({ color: hex(outfit.bottom!.accent), width: 2, alpha: 0.7 })
            }
          })
          characterLayer.addChild(bottom)
        }

        const body = shape((g) => {
          g.roundRect(-48, -15, 96, 112, 31).fill(character.skin)
          g.roundRect(-72, 0, 24, 90, 12).fill(character.skin)
          g.roundRect(48, 0, 24, 90, 12).fill(character.skin)
        })
        characterLayer.addChild(body)

        if (outfit.top) {
          const top = shape((g) => {
            const color = hex(outfit.top!.color)
            g.roundRect(-54, -10, 108, 94, 22).fill(color)
            if (outfit.top!.id === 'top-lime') {
              g.roundRect(-73, -3, 25, 75, 11).fill(color)
              g.roundRect(48, -3, 25, 75, 11).fill(color)
              g.moveTo(0, -5).lineTo(0, 80).stroke({ color: hex(outfit.top!.accent), width: 3 })
            }
            g.moveTo(-29, 0).lineTo(29, 0).stroke({ color: hex(outfit.top!.accent), alpha: 0.55, width: 3 })
          })
          characterLayer.addChild(top)
        }

        const head = shape((g) => {
          g.circle(0, -80, 54).fill(character.skin)
          g.circle(0, -101, 58).fill(character.hair)
          g.circle(0, -76, 52).fill(character.skin)
          g.circle(-17, -80, 3.5).fill(0x1e1930)
          g.circle(17, -80, 3.5).fill(0x1e1930)
          g.moveTo(-9, -60).quadraticCurveTo(0, -55, 9, -60).stroke({ color: 0x9b4655, width: 2 })
        })
        characterLayer.addChild(head)

        if (outfit.accessory) {
          const accessory = shape((g) => {
            const color = hex(outfit.accessory!.color)
            const accent = hex(outfit.accessory!.accent)
            if (outfit.accessory!.id === 'accessory-shade') {
              g.roundRect(-38, -88, 30, 17, 7).fill(color)
              g.roundRect(8, -88, 30, 17, 7).fill(color)
              g.rect(-8, -82, 16, 3).fill(accent)
            } else if (outfit.accessory!.id === 'accessory-star') {
              g.star(-38, -128, 5, 13, 5).fill(color)
              g.star(38, -128, 5, 13, 5).fill(color)
            } else {
              g.roundRect(49, 58, 37, 41, 9).fill(color)
              g.arc(67, 58, 14, Math.PI, 0).stroke({ color: accent, width: 4 })
            }
          })
          characterLayer.addChild(accessory)
        }

        app.stage.addChild(characterLayer)
        particleLayer = new Container({ x: anchorX, y: anchorY - 25, scale })
        if (burst) {
          for (let index = 0; index < 18; index += 1) {
            const dot = shape((g) => g.circle(0, 0, index % 3 === 0 ? 5 : 3).fill(index % 2 ? character.accent : 0xffffff))
            const angle = (Math.PI * 2 * index) / 18
            particleVelocity.push({ x: Math.cos(angle) * (2.5 + (index % 4)), y: Math.sin(angle) * (2.5 + (index % 3)) - 2, rotation: angle })
            particleLayer.addChild(dot)
          }
          particleLife = 32
        }
        app.stage.addChild(particleLayer)
      }

      redrawRef.current = redraw
      redraw(false)
      observer = new ResizeObserver(() => {
        app.renderer.resize(Math.max(host.clientWidth, 1), Math.max(host.clientHeight, 1))
        redraw(false)
      })
      observer.observe(host)

      const tick = () => {
        if (characterLayer) characterLayer.y = app.screen.height * 0.54 + Math.sin(performance.now() / 650) * 3
        if (particleLayer && particleLife > 0) {
          particleLayer.children.forEach((particle, index) => {
            const velocity = particleVelocity[index]
            particle.x += velocity.x
            particle.y += velocity.y
            particle.rotation += velocity.rotation * 0.05
            particle.alpha = particleLife / 32
          })
          particleLife -= 1
        }
      }
      app.ticker.add(tick)
      removeTicker = () => {
        app.ticker.remove(tick)
      }
    }

    void start()
    return () => {
      destroyed = true
      observer?.disconnect()
      removeTicker()
      redrawRef.current = () => undefined
      if (initialized) app.destroy(true, { children: true })
    }
  }, [])

  return <div className="character-stage" ref={hostRef} />
}
