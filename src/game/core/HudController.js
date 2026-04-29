import { formatKph } from "./helpers"

export class HudController {
  constructor(root) {
    this.root = root
    this.elements = {
      speed: root.querySelector("[data-speed]"),
      score: root.querySelector("[data-score]"),
      distance: root.querySelector("[data-distance]"),
      heat: root.querySelector("[data-heat]"),
      status: root.querySelector("[data-status]"),
      boostBar: root.querySelector("[data-boost-fill]"),
      heatBar: root.querySelector("[data-heat-fill]"),
      boostVignette: root.querySelector("[data-boost-vignette]"),
      intro: root.querySelector("[data-intro]"),
      startButton: root.querySelector("[data-start]"),
      retryButton: root.querySelector("[data-retry]"),
      audit: root.querySelector("[data-audit]"),
    }
  }

  bindStart(onStart, onRetry) {
    this.elements.startButton?.addEventListener("click", onStart)
    this.elements.retryButton?.addEventListener("click", onRetry)
  }

  hideIntro() {
    if (this.elements.intro) this.elements.intro.classList.add("hidden")
  }

  showRetry(message) {
    if (this.elements.intro) this.elements.intro.classList.remove("hidden")
    if (this.elements.status) this.elements.status.textContent = message
  }

  update(state) {
    if (this.elements.speed) this.elements.speed.textContent = formatKph(state.speed)
    if (this.elements.score) this.elements.score.textContent = state.score.toString().padStart(6, "0")
    if (this.elements.distance) this.elements.distance.textContent = `${state.distance.toFixed(1)} KM`
    if (this.elements.heat) this.elements.heat.textContent = `${Math.round(state.heat * 100)}%`
    if (this.elements.status) this.elements.status.textContent = state.status
    if (this.elements.boostBar) this.elements.boostBar.style.transform = `scaleX(${state.boost.toFixed(3)})`
    if (this.elements.heatBar) this.elements.heatBar.style.transform = `scaleX(${state.heat.toFixed(3)})`

    if (this.elements.boostVignette) {
      this.elements.boostVignette.classList.toggle("active", state.boosting)
    }

    if (this.elements.audit) {
      this.elements.audit.textContent = `FPS ${state.fps.toString().padStart(2, "0")} • Traffic ${state.traffic} • Pressure ${Math.round(state.pressure * 100)}%`
    }
  }
}

