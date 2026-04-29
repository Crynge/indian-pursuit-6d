import * as THREE from "three"
import { randBetween } from "../core/helpers"

function makeSignTexture(label, accent) {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 192
  const ctx = canvas.getContext("2d")
  ctx.fillStyle = accent
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#f7f4ea"
  ctx.font = "700 54px Teko"
  ctx.fillText(label, 34, 82)
  ctx.font = "600 22px IBM Plex Sans"
  ctx.fillText("INDIA EXPRESS CORRIDOR", 34, 124)
  ctx.fillStyle = "#ffcf7a"
  ctx.fillRect(0, canvas.height - 18, canvas.width, 18)
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}

function createRoadSegment(index) {
  const group = new THREE.Group()
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 36),
    new THREE.MeshStandardMaterial({
      color: 0x12181c,
      roughness: 0.94,
      metalness: 0.05,
    }),
  )
  road.rotation.x = -Math.PI / 2
  road.receiveShadow = true
  group.add(road)

  for (let lane = 0; lane < 3; lane += 1) {
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.02, 4),
      new THREE.MeshStandardMaterial({
        color: 0xf7e1c3,
        emissive: 0xf7b16d,
        emissiveIntensity: 0.16,
      }),
    )
    stripe.position.set(-4.5 + lane * 3.6, 0.02, 0)
    group.add(stripe)
  }

  const barrierMaterial = new THREE.MeshStandardMaterial({ color: 0x687381, roughness: 0.85 })
  ;[-9.3, 9.3].forEach((x, sideIndex) => {
    const barrier = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.58, 36), barrierMaterial)
    barrier.position.set(x, 0.28, 0)
    group.add(barrier)

    const signPole = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 4.8, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xb0bac8, roughness: 0.4 }),
    )
    signPole.position.set(x + (sideIndex === 0 ? -2.4 : 2.4), 2.4, randBetween(-10, 10))
    group.add(signPole)

    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(3.3, 1.3, 0.18),
      new THREE.MeshStandardMaterial({
        map: makeSignTexture(sideIndex === 0 ? "NH48  JAIPUR" : "MUMBAI  E-WAY", sideIndex === 0 ? "#0d6e4c" : "#1458a8"),
        roughness: 0.52,
      }),
    )
    signBoard.position.copy(signPole.position)
    signBoard.position.y += 1.4
    group.add(signBoard)

    const lightPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 5.5),
      new THREE.MeshStandardMaterial({ color: 0x8a94a4, roughness: 0.35 }),
    )
    lightPole.position.set(x + (sideIndex === 0 ? -1.2 : 1.2), 2.75, randBetween(-13, 13))
    group.add(lightPole)

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffe4b5,
        emissive: 0xffad47,
        emissiveIntensity: 1.4,
        toneMapped: false,
      }),
    )
    lamp.position.copy(lightPole.position)
    lamp.position.y += 2.55
    group.add(lamp)
  })

  for (let side = -1; side <= 1; side += 2) {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(randBetween(2.8, 5.2), randBetween(5.5, 10), randBetween(3, 5)),
      new THREE.MeshStandardMaterial({ color: side < 0 ? 0x1c2735 : 0x171e2b, roughness: 0.86 }),
    )
    block.position.set(side * randBetween(12, 17), block.geometry.parameters.height * 0.5, randBetween(-14, 14))
    group.add(block)

    const palm = new THREE.Group()
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.22, 2.7),
      new THREE.MeshStandardMaterial({ color: 0x78553a }),
    )
    trunk.position.y = 1.35
    palm.add(trunk)
    for (let leaf = 0; leaf < 5; leaf += 1) {
      const frond = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.05, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x1d7d51 }),
      )
      frond.position.y = 2.7
      frond.rotation.y = (leaf / 5) * Math.PI * 2
      frond.rotation.x = 0.65
      palm.add(frond)
    }
    palm.position.set(side * randBetween(10.6, 14.4), 0, randBetween(-15, 15))
    group.add(palm)
  }

  group.position.z = -index * 36
  return group
}

export class EnvironmentSystem {
  constructor(scene) {
    this.scene = scene
    this.segments = Array.from({ length: 14 }, (_, index) => createRoadSegment(index))
    this.segments.forEach((segment) => scene.add(segment))
  }

  update(delta, speed) {
    const advance = speed * delta
    this.segments.forEach((segment) => {
      segment.position.z += advance
      if (segment.position.z > 30) {
        const farthest = Math.min(...this.segments.map((item) => item.position.z))
        segment.position.z = farthest - 36
      }
    })
  }
}
