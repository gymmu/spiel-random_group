// bullet.js
import Phaser from "phaser"

export default class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, targetX, targetY, speed = 300) {
    super(scene, x, y, "bullet")

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

    this.setBounce(1)

    // Optional: Max. Anzahl an Bounces
    this.bounceCount = 0
    this.maxBounces = 10
  }
}
