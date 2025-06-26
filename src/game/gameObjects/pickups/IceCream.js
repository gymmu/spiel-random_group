import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"
import Player from "../player/player"

export default class Icecream extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "icecream", properties)

    this.setOrigin(0, 0)
    this.setSize(24, 24)
    this.setOffset(4, 8)

    this.name = "icecream"
  }

  onCollide(player) {
    if (player instanceof Player) {
      player.increaseSpeed(50)
      this.scene.time.delayedCall(1000, () => {
        player.resetSpeed()
      })
      this.destroy()
    }
  }
}

// Registriere das Flower-Objekt automatisch beim Import
registerGameObject("Icecream", Icecream)
