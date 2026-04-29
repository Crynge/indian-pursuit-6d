export class AudioController {
  constructor() {
    this.context = null
    this.engine = null
    this.engineGain = null
    this.siren = null
    this.sirenGain = null
  }

  start() {
    if (this.context) return
    this.context = new window.AudioContext()

    this.engine = this.context.createOscillator()
    this.engine.type = "sawtooth"
    this.engine.frequency.value = 85
    this.engineGain = this.context.createGain()
    this.engineGain.gain.value = 0.02
    this.engine.connect(this.engineGain).connect(this.context.destination)
    this.engine.start()

    this.siren = this.context.createOscillator()
    this.siren.type = "square"
    this.siren.frequency.value = 480
    this.sirenGain = this.context.createGain()
    this.sirenGain.gain.value = 0
    this.siren.connect(this.sirenGain).connect(this.context.destination)
    this.siren.start()
  }

  update(speedRatio, pressure) {
    if (!this.context) return
    const now = this.context.currentTime
    this.engine.frequency.linearRampToValueAtTime(85 + speedRatio * 170, now + 0.1)
    this.engineGain.gain.linearRampToValueAtTime(0.018 + speedRatio * 0.035, now + 0.08)
    this.siren.frequency.linearRampToValueAtTime(420 + Math.sin(now * 5.4) * 120, now + 0.08)
    this.sirenGain.gain.linearRampToValueAtTime(pressure * 0.018, now + 0.12)
  }
}

