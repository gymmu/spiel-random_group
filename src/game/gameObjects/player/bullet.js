// bullet.js
import Phaser from "phaser"

export default class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, targetX, targetY, speed = 300) {
    super(scene, x, y, "bullet") // Stelle sicher, dass du eine "bullet"-Textur hast

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const dx = targetX - x
    const dy = targetY - y
    const len = Math.hypot(dx, dy)

    this.body.velocity.x = (dx / len) * speed
    this.body.velocity.y = (dy / len) * speed

    this.setScale(0.5)
    this.setCollideWorldBounds(true)
    this.body.onWorldBounds = true
    this.body.setAllowGravity(false)

    // Selbstzerstörung nach 3 Sekunden
    scene.time.delayedCall(2000, () => {
      this.destroy()
    })
  }
}
