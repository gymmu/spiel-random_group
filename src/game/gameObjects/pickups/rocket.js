import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"
import Player from "../player/player"

export default class Rocket extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "rocket", properties)

    this.setOrigin(0, 0)
    this.setSize(16, 16)
    this.setOffset(16, 16)

    this.name = "rocket"
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

// Registriere das Mushroom-Objekt automatisch beim Import
registerGameObject("rocket", Rocket)
