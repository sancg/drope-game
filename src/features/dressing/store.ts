import { create } from 'zustand';
import type { DressingState } from './model';

const emptyOutfit = { face: null, top: null, bottom: null, shoes: null, accessory: null };

export const useDressingStore = create<DressingState>((set) => ({
  activeCharacterId: 'luna',
  activeRunwayId: 'skate',
  outfit: emptyOutfit,
  wardrobeOpen: false,
  effectNonce: 0,
  selectCharacter: (activeCharacterId) =>
    set((state) => ({
      activeCharacterId,
      // A face belongs to the current character group, so never carry one to the other model.
      outfit: { ...state.outfit, face: null },
      effectNonce: Date.now(),
    })),
  selectRunway: (activeRunwayId) => set({ activeRunwayId }),
  equip: (item) =>
    set((state) => {
      const activeFaceGroup = state.activeCharacterId === 'luna' ? 'woman' : 'man';
      if (item.slot === 'face' && item.faceGroup !== activeFaceGroup) return {};

      return {
        outfit: { ...state.outfit, [item.slot]: item.id },
        effectNonce: Date.now(),
      };
    }),
  toggleWardrobe: () => set((state) => ({ wardrobeOpen: !state.wardrobeOpen })),
  clearOutfit: () => set({ outfit: emptyOutfit, effectNonce: Date.now() }),
}));
