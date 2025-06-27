import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"
import Player from "../player/player"

export default class Seestern extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "seestern", properties)

    this.setOrigin(0, 0)
    this.setSize(24, 24)
    this.setOffset(4, 6)

    this.name = "seestern"
  }

  onCollide(player) {
    if (player instanceof Player) {
      player.addItemToInventory(this)
      player.increaseStoneCount()
      this.destroy()
    }
  }

  interact(player) {
    if (this.scene.cameraManager) {
      this.scene.cameraManager.cameraMaskRadius += 50
      this.scene.cameraManager.setCameraMask()
    }
    if (player && player instanceof Player) {
      player.addItemToInventory(this)
      player.increaseStoneCount()
      this.destroy()
    }
  }
}

// Registriere das Stone-Objekt automatisch beim Import
registerGameObject("Seestern", Seestern)
