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
    //super.onCollide(player)
    player.heal(this.props.healAmount || 15)

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
registerGameObject("Icecream", Icecream)
