import { getWardrobeItems, slotLabels } from '../catalog';
import type { ClothingSlot } from '../model';
import { useDressingStore } from '../store';

const slots: ClothingSlot[] = ['face', 'top', 'bottom', 'shoes', 'accessory'];

export function Wardrobe() {
  const wardrobeOpen = useDressingStore((state) => state.wardrobeOpen);
  const activeCharacterId = useDressingStore((state) => state.activeCharacterId);
  const outfit = useDressingStore((state) => state.outfit);
  const equip = useDressingStore((state) => state.equip);
  const toggleWardrobe = useDressingStore((state) => state.toggleWardrobe);
  const clearOutfit = useDressingStore((state) => state.clearOutfit);

  if (!wardrobeOpen) return null;

  return (
    <aside className='wardrobe-panel' id='wardrobe-panel' aria-label='Wardrobe'>
      <header className='wardrobe-header'>
        <div>
          <span className='eyebrow'>Nuestros diseños</span>
          <h1>Ropero Moua</h1>
        </div>
        <button className='icon-button' onClick={toggleWardrobe} aria-label='Close wardrobe'>
          <span aria-hidden='true'>×</span>
        </button>
      </header>

      <div className='wardrobe-scroll'>
        {slots.map((slot) => {
          const items = getWardrobeItems(slot, activeCharacterId === 'luna' ? 'woman' : 'man');
          return (
            <section
              className='clothing-section'
              key={slot}
              aria-labelledby={`${slot}-heading`}
            >
              <div className='section-heading'>
                <h2 id={`${slot}-heading`}>{slotLabels[slot]}</h2>
                <span>{items.length} looks</span>
              </div>
              <div className='item-carousel'>
                {items.map((item) => {
                  const selected = outfit[slot] === item.id;
                  return (
                    <button
                      className={`clothing-card ${selected ? 'is-selected' : ''}`}
                      key={item.id}
                      onClick={() => equip(item)}
                      aria-pressed={selected}
                    >
                      <span className={`garment-preview ${item.slot}`}>
                        <img src={item.imageSrc} alt='' />
                      </span>
                      <strong>{item.name}</strong>
                      <small>{item.description}</small>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <button className='clear-button' onClick={clearOutfit}>
        Clear outfit
      </button>
    </aside>
  );
}
