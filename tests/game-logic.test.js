import { describe, expect, it } from "vitest"
import { clamp, detectCollision, formatKph } from "../src/game/core/helpers"
import { computePressure } from "../src/game/systems/PursuitSystem"

describe("game helpers", () => {
  it("clamps values into range", () => {
    expect(clamp(12, 0, 10)).toBe(10)
    expect(clamp(-4, 0, 10)).toBe(0)
    expect(clamp(7, 0, 10)).toBe(7)
  })

  it("detects vehicle collisions", () => {
    expect(detectCollision({ x: 0, z: 0, width: 1, depth: 2 }, { x: 0.5, z: 1, width: 1, depth: 2 })).toBe(true)
    expect(detectCollision({ x: 0, z: 0, width: 1, depth: 2 }, { x: 5, z: 6, width: 1, depth: 2 })).toBe(false)
  })

  it("formats speed for the HUD", () => {
    expect(formatKph(9)).toBe("009")
    expect(formatKph(132.4)).toBe("132")
  })

  it("raises police pressure when heat and collisions are high", () => {
    const calm = computePressure(0.1, 0.9, 0, 0.016)
    const hot = computePressure(0.9, 0.25, 1, 0.016)
    expect(hot).toBeGreaterThan(calm)
  })
})
