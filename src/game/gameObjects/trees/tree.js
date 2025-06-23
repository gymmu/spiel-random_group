import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"

export default class Tree extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "trees", "tree", properties)

    this.setOrigin(0, 0)
    this.setSize(32, 48) // Beispielgrösse für einen Baum
    this.setOffset(0, 0)

    this.name = "tree"
  }
}

// Registriere das Tree-Objekt automatisch beim Import
registerGameObject("Tree", Tree)
