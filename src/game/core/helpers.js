export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function lerp(start, end, alpha) {
  return start + (end - start) * alpha
}

export function damp(current, target, smoothing, delta) {
  const alpha = 1 - Math.exp(-smoothing * delta)
  return lerp(current, target, alpha)
}

export function randBetween(min, max) {
  return min + Math.random() * (max - min)
}

export function laneToX(lane) {
  return -5.4 + lane * 3.6
}

export function wrapIndex(index, size) {
  return ((index % size) + size) % size
}

export function detectCollision(a, b) {
  return Math.abs(a.x - b.x) < a.width + b.width && Math.abs(a.z - b.z) < a.depth + b.depth
}

export function formatKph(speed) {
  return Math.round(speed).toString().padStart(3, "0")
}

