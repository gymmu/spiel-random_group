import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"

export default class Healflower extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "healflower", properties)

    this.setOrigin(0, 0)
    this.setSize(24, 32)
    this.setOffset(8, 0)

    this.name = "healflower"
  }

  onCollide(player) {
    //super.onCollide(player)
    player.heal(this.props.healAmount || 2)

    // Wenn die Blume einen Schlüssel hat, geben wir ihn dem Spieler
    if (this.props.keyName) {
      player.addKey(this.props.keyName)
    }

    if (this.scene.cameraManager) {
      this.scene.cameraManager.cameraMaskRadius += 50
      this.scene.cameraManager.setCameraMask()
    }
    this.destroy()
  }
}

// Registriere das Flower-Objekt automatisch beim Import
registerGameObject("Healflower", Healflower)
