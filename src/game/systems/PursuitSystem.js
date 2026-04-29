import { clamp, damp, detectCollision } from "../core/helpers"

export function computePressure(heat, speedRatio, collisionPulse, delta) {
  const tension = heat * 0.78 + (1 - speedRatio) * 0.24 + collisionPulse * 0.62
  return clamp(tension * delta * 0.58, 0, 0.07)
}

export class PursuitSystem {
  constructor(policeMesh) {
    this.policeMesh = policeMesh
    this.pressure = 0.18
    this.captureMeter = 0
  }

  reset() {
    this.pressure = 0.18
    this.captureMeter = 0
    this.policeMesh.position.set(0, 0, 8)
  }

  update(delta, player, state) {
    this.pressure = clamp(
      this.pressure + computePressure(state.heat, state.speedRatio, state.collisionPulse, delta) - Number(state.boosting) * delta * 0.06,
      0.08,
      1,
    )

    const targetGap = 6.8 - this.pressure * 4.3 - state.speedRatio * 1.2
    const targetX = player.position.x * 0.92
    this.policeMesh.position.x = damp(this.policeMesh.position.x, targetX, 3.8, delta)
    this.policeMesh.position.z = damp(this.policeMesh.position.z, targetGap, 2.2, delta)

    const collision = detectCollision(
      { x: player.position.x, z: player.position.z + 7.8, width: 0.88, depth: 1.6 },
      { x: this.policeMesh.position.x, z: this.policeMesh.position.z, width: 0.92, depth: 1.7 },
    )

    this.captureMeter = clamp(
      this.captureMeter + (collision ? delta * 1.15 : -delta * 0.42) + this.pressure * delta * 0.1,
      0,
      1,
    )

    return {
      pressure: this.pressure,
      captureMeter: this.captureMeter,
      collision,
    }
  }
}

