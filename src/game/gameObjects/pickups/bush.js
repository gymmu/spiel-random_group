import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"

export default class Bush extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "bush", properties)

    this.setOrigin(0, 0)
    this.setSize(16, 16)
    this.setOffset(16, 16)

    this.name = "bush"
  }
}

// Registriere das Bush-Objekt automatisch beim Import
registerGameObject("Bush", Bush)
