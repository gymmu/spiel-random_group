import Phaser from "phaser"

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  /**
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {Phaser.Math.Vector2} direction - normalized direction vector
   * @param {number} speed
   */
  constructor(scene, x, y, direction, speed = 300) {
    super(scene, x, y, "pickups", "stone")
    this.scene = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setOrigin(0.5, 0.5)
    this.setSize(24, 24)
    this.setOffset(4, 6)
    this.setScale(0.5)
    this.body.setAllowGravity(false)
    this.body.setVelocity(direction.x * speed, direction.y * speed)

    // Play stone sound effect when shot
    if (scene.sound) {
      scene.sound.play("stone")
    }

    // Destroy projectile if it leaves the world bounds
    this.setCollideWorldBounds(true)
    this.body.onWorldBounds = true
    scene.physics.world.on("worldbounds", (body) => {
      if (body.gameObject === this) {
        this.destroy()
      }
    })

    // Add collision with world layer or other objects in the scene as needed
    // This should be set up in the scene after creation
    // Optionally, add to a group for collision management
    if (this.scene.projectilesGroup) {
      this.scene.projectilesGroup.add(this)
    }
  }
}
