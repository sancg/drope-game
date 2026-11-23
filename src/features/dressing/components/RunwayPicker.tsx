import { runways } from '../catalog'
import { useDressingStore } from '../store'

export function RunwayPicker() {
  const activeRunwayId = useDressingStore((state) => state.activeRunwayId)
  const selectRunway = useDressingStore((state) => state.selectRunway)

  return (
    <div className="runway-picker" aria-label="Choose a runway">
      {runways.map((runway) => (
        <button
          key={runway.id}
          className={`runway-dot ${activeRunwayId === runway.id ? 'is-selected' : ''}`}
          aria-label={`Use ${runway.name} runway`}
          aria-pressed={activeRunwayId === runway.id}
          onClick={() => selectRunway(runway.id)}
          style={{ backgroundImage: `url("${runway.imageSrc}")` }}
        />
      ))}
    </div>
  )
}
