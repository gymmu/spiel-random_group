import Phaser from "phaser"

/**
 * A temporary interaction object that collides with everything and destroys itself in the next frame.
 */
export default class InteractionObject extends Phaser.Physics.Arcade.Sprite {
  /**
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(scene, x, y, width = 24, height = 24) {
    super(scene, x, y, null)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Set size and make visible (optional: use a debug color)
    this.setDisplaySize(width, height)
    this.setSize(width, height, false)

    // Optionally, set a debug fill (remove/comment for production)
    const graphics = scene.add.graphics()
    graphics.fillStyle(0x00ff00, 0.5)
    graphics.fillRect(this.x - width / 2, this.y - height / 2, width, height)
    this.debugGraphics = graphics

    // Remove after the next frame
    scene.time.addEvent({
      delay: 100, // Next frame
      callback: () => {
        if (this.debugGraphics) this.debugGraphics.destroy()
        this.destroy()
      },
    })
  }
}
