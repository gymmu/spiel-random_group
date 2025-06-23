/**
 * Returns a random direction as a string: "left", "right", "up", or "down".
 * Useful for NPC movement logic.
 *
 * @returns {"left" | "right" | "up" | "down"} A random direction.
 */
export function getRandomDirection() {
  const r = Math.floor(4 * Math.random())
  if (r === 0) {
    return "left"
  } else if (r === 1) {
    return "right"
  } else if (r === 2) {
    return "up"
  } else {
    return "down"
  }
}
