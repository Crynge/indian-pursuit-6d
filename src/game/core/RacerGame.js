import * as THREE from "three"
import { playerPreset, policePreset } from "../data/vehiclePresets"
import { EnvironmentSystem } from "../systems/EnvironmentSystem"
import { PursuitSystem } from "../systems/PursuitSystem"
import { TrafficSystem } from "../systems/TrafficSystem"
import { AudioController } from "./AudioController"
import { HudController } from "./HudController"
import { clamp, damp, detectCollision } from "./helpers"
import { InputController } from "./InputController"
import { createVehicleMesh } from "./VehicleFactory"

export class RacerGame {
  constructor({ mount, hudRoot }) {
    this.mount = mount
    this.hud = new HudController(hudRoot)
    this.audio = new AudioController()
    this.input = new InputController()
    this.started = false
    this.gameOver = false
    this.lastFrame = performance.now()
    this.fpsSamples = []

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x06090f)
    this.scene.fog = new THREE.FogExp2(0x0b1018, 0.024)

    this.camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.1, 400)
    this.camera.position.set(0, 4.9, 12.6)
    this.camera.lookAt(0, 1.1, -30)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    this.renderer.setSize(mount.clientWidth, mount.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(this.renderer.domElement)

    this.setupLights()
    this.setupWorld()

    this.hud.bindStart(
      () => this.start(),
      () => this.reset(),
    )

    this.resizeHandler = () => this.handleResize()
    window.addEventListener("resize", this.resizeHandler)
    this.animate = this.animate.bind(this)
    requestAnimationFrame(this.animate)
  }

  setupLights() {
    const hemi = new THREE.HemisphereLight(0x88c8ff, 0x050608, 1.35)
    this.scene.add(hemi)

    const key = new THREE.DirectionalLight(0xffe7b2, 1.75)
    key.position.set(-8, 13, 8)
    key.castShadow = true
    key.shadow.camera.left = -18
    key.shadow.camera.right = 18
    key.shadow.camera.top = 18
    key.shadow.camera.bottom = -18
    key.shadow.mapSize.set(1024, 1024)
    this.scene.add(key)

    const rim = new THREE.PointLight(0x44d8ff, 3.2, 50, 2.2)
    rim.position.set(0, 4, 9)
    this.scene.add(rim)
  }

  setupWorld() {
    this.environment = new EnvironmentSystem(this.scene)

    this.player = createVehicleMesh(playerPreset)
    this.player.scale.setScalar(0.88)
    this.player.position.set(0, 0, 8.2)
    this.scene.add(this.player)

    this.police = createVehicleMesh(policePreset)
    this.police.scale.setScalar(0.92)
    this.police.position.set(0, 0, 8.5)
    this.scene.add(this.police)

    this.traffic = new TrafficSystem(this.scene)
    this.pursuit = new PursuitSystem(this.police)

    this.state = {
      speed: 110,
      worldSpeed: 38,
      boost: 1,
      heat: 0.22,
      score: 0,
      distance: 0,
      status: "TAP IGNITION TO RUN NH6",
      collisionPulse: 0,
      boosting: false,
      pressure: 0.12,
      fps: 60,
      traffic: this.traffic.vehicles.length,
      speedRatio: 0.5,
    }
  }

  start() {
    this.started = true
    this.gameOver = false
    this.audio.start()
    this.hud.hideIntro()
    this.state.status = "DELHI TO MUMBAI HEAT RUN"
  }

  reset() {
    this.started = true
    this.gameOver = false
    this.audio.start()
    this.traffic.reset()
    this.pursuit.reset()
    this.player.position.set(0, 0, 8.2)
    this.camera.position.set(0, 4.9, 12.6)
    Object.assign(this.state, {
      speed: 110,
      worldSpeed: 38,
      boost: 1,
      heat: 0.22,
      score: 0,
      distance: 0,
      status: "BACK ON THE RING ROAD",
      collisionPulse: 0,
      boosting: false,
      pressure: 0.12,
      fps: 60,
      traffic: this.traffic.vehicles.length,
      speedRatio: 0.5,
    })
    this.hud.hideIntro()
  }

  handleResize() {
    this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight)
  }

  updatePlayer(delta) {
    const steering = Number(this.input.state.right) - Number(this.input.state.left)
    const throttle = this.input.state.accelerate ? 1 : 0
    const brake = this.input.state.brake ? 1 : 0
    const wantsBoost = this.input.state.boost && this.state.boost > 0.08

    this.state.speed += throttle * delta * 54
    this.state.speed -= brake * delta * 88
    this.state.speed -= delta * 12
    this.state.speed = clamp(this.state.speed, 64, wantsBoost ? 238 : 214)

    if (wantsBoost) {
      this.state.speed += delta * 45
      this.state.boost = clamp(this.state.boost - delta * 0.26, 0, 1)
    } else {
      this.state.boost = clamp(this.state.boost + delta * 0.085, 0, 1)
    }

    const targetX = clamp(this.player.position.x + steering * delta * (5.8 + this.state.speed * 0.012), -5.9, 5.9)
    this.player.position.x = damp(this.player.position.x, targetX, 9.5, delta)
    this.player.rotation.z = damp(this.player.rotation.z, -steering * 0.28, 7.2, delta)
    this.player.rotation.y = damp(this.player.rotation.y, steering * 0.05, 5.5, delta)
    this.player.position.y = Math.sin(performance.now() * 0.008) * 0.03

    this.state.speedRatio = this.state.speed / 238
    this.state.worldSpeed = 30 + this.state.speed * 0.37
    this.state.boosting = wantsBoost
    this.state.heat = clamp(this.state.heat + delta * (0.04 + this.state.speedRatio * 0.09 + Number(wantsBoost) * 0.14) - delta * 0.025, 0.08, 1)
    this.state.distance += this.state.speed * delta * 0.004
    this.state.score += Math.round(this.state.speed * delta * (1 + this.state.heat))
  }

  updateCollisions(delta) {
    const playerBody = {
      x: this.player.position.x,
      z: this.player.position.z + 7.8,
      width: 0.86,
      depth: 1.56,
    }

    let collisionFound = false
    for (const body of this.traffic.getCollisionBodies()) {
      if (detectCollision(playerBody, body)) {
        collisionFound = true
        this.state.speed = clamp(this.state.speed - 65, 62, 220)
        this.state.heat = clamp(this.state.heat + 0.08, 0, 1)
        this.state.status = `CLIPPED ${body.mesh.userData.type.toUpperCase()} • HOLD THE LINE`
        body.mesh.position.z += 12
        body.mesh.position.x += Math.sign(body.mesh.position.x - this.player.position.x || 1) * 0.8
        break
      }
    }

    this.state.collisionPulse = collisionFound ? 1 : clamp(this.state.collisionPulse - delta * 1.8, 0, 1)
  }

  updateCamera(delta) {
    const sway = (Number(this.input.state.right) - Number(this.input.state.left)) * 0.45
    this.camera.position.x = damp(this.camera.position.x, this.player.position.x * 0.28 + sway, 4.5, delta)
    this.camera.position.y = damp(this.camera.position.y, 4.9 + this.state.speedRatio * 0.35 + this.state.collisionPulse * 0.15, 2.6, delta)
    this.camera.position.z = damp(this.camera.position.z, 12.6 - this.state.speedRatio * 1.45 + Number(this.state.boosting) * -0.8, 2.8, delta)
    this.camera.lookAt(this.player.position.x * 0.22, 1.2, -28 - this.state.speedRatio * 20)
  }

  updateFps(delta) {
    this.fpsSamples.push(1 / delta)
    if (this.fpsSamples.length > 20) this.fpsSamples.shift()
    const average = this.fpsSamples.reduce((sum, fps) => sum + fps, 0) / this.fpsSamples.length
    this.state.fps = Math.round(average)
  }

  tick(delta) {
    this.updatePlayer(delta)
    this.environment.update(delta, this.state.worldSpeed)
    this.traffic.update(delta, this.state.worldSpeed, this.player.position.x)
    this.updateCollisions(delta)

    const pursuitState = this.pursuit.update(delta, this.player, this.state)
    this.state.pressure = pursuitState.pressure

    if (pursuitState.captureMeter > 0.9) {
      this.gameOver = true
      this.started = false
      this.state.status = "CAUGHT BY INTERCEPTOR UNIT"
      this.hud.showRetry("BUSTED ON THE EXPRESSWAY • HIT RESTART")
    } else if (this.state.collisionPulse > 0.5) {
      this.state.status = "TRAFFIC IMPACT • POLICE CLOSING FAST"
    } else if (this.state.boosting) {
      this.state.status = "BOOSTING THROUGH NH48 TRAFFIC"
    } else if (this.state.pressure > 0.7) {
      this.state.status = "REDLINE PURSUIT • DO NOT LIFT"
    }

    if (this.police.userData.lightBar) {
      const strobe = Math.sin(performance.now() * 0.018) > 0
      this.police.userData.lightBar.material.emissive.setHex(strobe ? 0xff4f4f : 0x44d8ff)
      this.police.userData.lightBar.material.color.setHex(strobe ? 0xff7272 : 0x6adaff)
    }

    this.audio.update(this.state.speedRatio, this.state.pressure)
    this.updateCamera(delta)
    this.updateFps(delta)
    this.state.traffic = this.traffic.vehicles.length
  }

  animate(now) {
    requestAnimationFrame(this.animate)
    const delta = Math.min((now - this.lastFrame) / 1000, 0.05)
    this.lastFrame = now

    if (this.started && !this.gameOver) {
      this.tick(delta)
    }

    this.hud.update(this.state)
    this.renderer.render(this.scene, this.camera)
  }
}
