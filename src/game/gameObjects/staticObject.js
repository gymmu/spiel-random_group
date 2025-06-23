import Phaser from "phaser"

export default class StaticObject extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, tileset, frame, properties) {
    super(scene, x, y - 32, tileset, frame)
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
    this.body.setAllowGravity(false)
    this.body.setImmovable(true)

    this.props = {}

    if (properties != null) {
      if (properties instanceof Array) {
        properties.forEach((prop) => {
          this.props[prop.name] = prop.value
        })
      } else {
        this.props = properties
      }
    }
  }

  onCollide(player) {}

  interact(player) {}
}
