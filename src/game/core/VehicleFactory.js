import * as THREE from "three"

function makeCabin(materialColor) {
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.52, 1.2),
    new THREE.MeshStandardMaterial({
      color: materialColor,
      metalness: 0.2,
      roughness: 0.15,
      transparent: true,
      opacity: 0.82,
    }),
  )
  cabin.position.y = 0.78
  return cabin
}

function makeWheel(x, z) {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.28, 16),
    new THREE.MeshStandardMaterial({ color: 0x0f1014, roughness: 0.9 }),
  )
  wheel.rotation.z = Math.PI / 2
  wheel.position.set(x, 0.24, z)
  return wheel
}

function makeLight(color, x, y, z) {
  const light = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.16, 0.08),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.4,
      toneMapped: false,
    }),
  )
  light.position.set(x, y, z)
  return light
}

export function createVehicleMesh(preset) {
  const group = new THREE.Group()
  const width = preset.width ?? 1.4
  const height = preset.height ?? 0.9
  const length = preset.length ?? 3.1

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, length),
    new THREE.MeshPhysicalMaterial({
      color: preset.body,
      roughness: 0.34,
      metalness: 0.45,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2,
    }),
  )
  body.position.y = height * 0.5
  group.add(body)

  const accent = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.92, height * 0.24, length * 0.9),
    new THREE.MeshStandardMaterial({ color: preset.accent, roughness: 0.5 }),
  )
  accent.position.y = height * 0.46
  group.add(accent)

  if (preset.rickshaw) {
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.9, height * 0.62, length * 0.6),
      new THREE.MeshStandardMaterial({ color: 0x212936, roughness: 0.36 }),
    )
    canopy.position.set(0, height * 1.04, 0.16)
    group.add(canopy)
  } else {
    const cabin = makeCabin(0x90b2d1)
    cabin.scale.set(width * 0.66, height * 0.84, length * 0.5)
    cabin.position.z = -0.15
    group.add(cabin)
  }

  group.add(makeWheel(width * 0.54, length * 0.32))
  group.add(makeWheel(-width * 0.54, length * 0.32))
  group.add(makeWheel(width * 0.54, -length * 0.32))
  group.add(makeWheel(-width * 0.54, -length * 0.32))

  group.add(makeLight(0xffffff, width * 0.36, 0.54, -length * 0.52))
  group.add(makeLight(0xffffff, -width * 0.36, 0.54, -length * 0.52))
  group.add(makeLight(0xff4b4b, width * 0.36, 0.54, length * 0.52))
  group.add(makeLight(0xff4b4b, -width * 0.36, 0.54, length * 0.52))

  if (preset.lights) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.14, 0.24),
      new THREE.MeshStandardMaterial({
        color: 0x44d8ff,
        emissive: 0xff4b4b,
        emissiveIntensity: 0.85,
        toneMapped: false,
      }),
    )
    bar.position.y = height + 0.58
    group.add(bar)
    group.userData.lightBar = bar
  }

  group.userData.bounds = { width: width * 0.48, depth: length * 0.48 }
  group.castShadow = true
  group.receiveShadow = true
  return group
}
