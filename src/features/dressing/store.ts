import { create } from 'zustand'
import type { DressingState } from './model'

const emptyOutfit = { top: null, bottom: null, accessory: null }

export const useDressingStore = create<DressingState>((set) => ({
  activeCharacterId: 'nova',
  activeRunwayId: 'midnight',
  outfit: emptyOutfit,
  wardrobeOpen: false,
  effectNonce: 0,
  selectCharacter: (activeCharacterId) => set({ activeCharacterId, effectNonce: Date.now() }),
  selectRunway: (activeRunwayId) => set({ activeRunwayId }),
  equip: (item) => set((state) => ({
    outfit: { ...state.outfit, [item.slot]: item.id },
    effectNonce: Date.now(),
  })),
  toggleWardrobe: () => set((state) => ({ wardrobeOpen: !state.wardrobeOpen })),
  clearOutfit: () => set({ outfit: emptyOutfit, effectNonce: Date.now() }),
}))
