import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"
import Player from "../player/player"

export default class Shell extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "shell", properties)

    this.setOrigin(0, 0)
    this.setSize(24, 24)
    this.setOffset(4, 6)

    this.name = "shell"
  }

  onCollide(player) {
    if (player instanceof Player) {
      player.addItemToInventory(this)
      this.destroy()
    }
  }

  interact(player) {
    if (player && player instanceof Player) {
      player.addItemToInventory(this)
      player.increaseStoneCount()
      this.destroy()
    }
  }
}

// Registriere das Stone-Objekt automatisch beim Import
registerGameObject("Shell", Shell)
