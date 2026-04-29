import { createVehicleMesh } from "../core/VehicleFactory"
import { trafficPresets } from "../data/vehiclePresets"
import { laneToX, randBetween, wrapIndex } from "../core/helpers"

export class TrafficSystem {
  constructor(scene) {
    this.scene = scene
    this.vehicles = []
    this.spawnCursor = 0

    for (let index = 0; index < 18; index += 1) {
      const preset = trafficPresets[index % trafficPresets.length]
      const mesh = createVehicleMesh(preset)
      mesh.visible = false
      mesh.userData.speed = randBetween(28, 48)
      mesh.userData.lane = index % 4
      mesh.userData.type = preset.name
      scene.add(mesh)
      this.vehicles.push(mesh)
    }

    this.reset()
  }

  reset() {
    this.spawnCursor = 0
    this.vehicles.forEach((vehicle, index) => {
      this.positionVehicle(vehicle, -30 - index * 14, index % 4, true)
    })
  }

  positionVehicle(vehicle, z, lane, firstPlacement = false) {
    const preset = trafficPresets[wrapIndex(this.spawnCursor, trafficPresets.length)]
    vehicle.position.set(laneToX(lane) + randBetween(-0.22, 0.22), 0, z)
    vehicle.rotation.y = Math.PI
    vehicle.visible = true
    vehicle.userData.speed = randBetween(26, 52)
    vehicle.userData.lane = lane
    vehicle.userData.type = preset.name
    this.spawnCursor += firstPlacement ? 0 : 1
  }

  update(delta, worldSpeed, playerX) {
    this.vehicles.forEach((vehicle, index) => {
      vehicle.position.z += (worldSpeed - vehicle.userData.speed) * delta
      if (vehicle.position.z > 24) {
        const lane = Math.floor(Math.random() * 4)
        const offset = -220 - index * 16 - Math.random() * 48
        this.positionVehicle(vehicle, offset, lane)
      }

      const sway = Math.sin((performance.now() * 0.001 + index) * 0.7) * 0.02
      vehicle.position.x += sway * delta * 18
      vehicle.position.x += (playerX - vehicle.position.x) * 0.0003
    })
  }

  getCollisionBodies() {
    return this.vehicles.map((vehicle) => ({
      x: vehicle.position.x,
      z: vehicle.position.z,
      width: vehicle.userData.bounds.width,
      depth: vehicle.userData.bounds.depth,
      mesh: vehicle,
    }))
  }
}

