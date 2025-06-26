import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"
import Player from "../player/player"

export default class Bonbon extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "bonbon", properties)

    this.setOrigin(0, 0)
    this.setSize(24, 24)
    this.setOffset(4, 6)

    this.name = "bonbon"
  }

  onCollide(player) {
    if (this.scene.cameraManager) {
      this.scene.cameraManager.cameraMaskRadius += 50
      this.scene.cameraManager.setCameraMask()
    }
    if (player instanceof Player) {
      player.addItemToInventory(this)
      player.increaseStoneCount()
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
registerGameObject("Bonbon", Bonbon)
