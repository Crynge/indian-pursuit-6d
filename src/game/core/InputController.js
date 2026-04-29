export class InputController {
  constructor() {
    this.state = {
      left: false,
      right: false,
      accelerate: false,
      brake: false,
      boost: false,
    }

    this.handleDown = (event) => this.setKey(event.code, true)
    this.handleUp = (event) => this.setKey(event.code, false)
    window.addEventListener("keydown", this.handleDown)
    window.addEventListener("keyup", this.handleUp)
  }

  setKey(code, active) {
    if (code === "ArrowLeft" || code === "KeyA") this.state.left = active
    if (code === "ArrowRight" || code === "KeyD") this.state.right = active
    if (code === "ArrowUp" || code === "KeyW") this.state.accelerate = active
    if (code === "ArrowDown" || code === "KeyS") this.state.brake = active
    if (code === "ShiftLeft" || code === "ShiftRight" || code === "Space") this.state.boost = active
  }

  dispose() {
    window.removeEventListener("keydown", this.handleDown)
    window.removeEventListener("keyup", this.handleUp)
  }
}

