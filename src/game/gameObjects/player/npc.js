import Phaser from "phaser"
import { getRandomDirection } from "./utils.js"
import Player from "./player.js"
import Bullet from "./bullet.js"

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  hp = 9
  maxHp = 10
  #speed = 100
  stepsLeft = 60
  move = "left"
  attackPower = 2
  isInvulnerable = false
  skin = "npc"

  constructor(scene, x, y, properties) {
    let skin = "npc"
    if (Array.isArray(properties)) {
      const found = properties.find((prop) => prop.name === "skin")
      if (found && found.value) skin = found.value
    }
    super(scene, x, y, skin)
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this, false)
    this.body.collideWorldBounds = true
    this.setOrigin(0.5, 0.5)
    this.setSize(24, 24, false)
    this.setOffset(4, 8)

    this.skin = skin
    this.lastShotTime = this.scene.time.now + Phaser.Math.Between(0, 3000)
    this.shootCooldown = Phaser.Math.Between(5000, 10000) // alle 6-10 Sekunden
  }

  set speed(value) {
    this.#speed = Math.min(Math.max(0, value), 960)
  }

  get speed() {
    return this.#speed
  }

  update() {
    const { body } = this
    let isIdle = true

    this.stepsLeft--
    if (this.stepsLeft <= 0) {
      this.move = getRandomDirection()
      this.stepsLeft = 60 + Math.floor(Math.random() * 60)
    }

    body.setVelocity(0)

    if (this.move === "left") {
      body.setVelocityX(-this.speed)
      this.anims.play(`${this.skin}_left`, true)
      isIdle = false
    } else if (this.move === "right") {
      body.setVelocityX(this.speed)
      this.anims.play(`${this.skin}_right`, true)
      isIdle = false
    } else if (this.move === "up") {
      body.setVelocityY(-this.speed)
      this.anims.play(`${this.skin}_up`, true)
      isIdle = false
    } else if (this.move === "down") {
      body.setVelocityY(this.speed)
      this.anims.play(`${this.skin}_down`, true)
      isIdle = false
    }

    if (isIdle) {
      this.anims.play(`${this.skin}_idle`, true)
    }

    this.setTint(this.isInvulnerable ? 0xff0000 : 0xffffff)

    const player = this.scene.player

    if (
      player &&
      this.scene.time.now > this.lastShotTime + this.shootCooldown
    ) {
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        player.x,
        player.y,
      )
      if (distance < 300) {
        const bullet = new Bullet(
          this.scene,
          this.x,
          this.y,
          player.x,
          player.y,
        )
        this.scene.bulletGroup.add(bullet)

        this.lastShotTime = this.scene.time.now
        this.shootCooldown = Phaser.Math.Between(6000, 10000)
      }
    }
  }

  heal(value) {
    this.hp += value ?? 0
    if (this.hp > this.maxHp) this.hp = this.maxHp
  }

  damage(value) {
    if (this.isInvulnerable) return

    this.isInvulnerable = true
    this.scene.time.delayedCall(1000, () => {
      this.isInvulnerable = false
    })

    this.hp -= value ?? 0
    if (this.hp <= 0) this.destroy()
  }

  onCollide(actor) {
    if (actor instanceof Player) {
      actor.damage(this.attackPower)

      // Knockback
      const dx = actor.x - this.x
      const dy = actor.y - this.y
      const length = Math.hypot(dx, dy)
      const knockbackPower = 200

      if (length > 0) {
        actor.body.velocity.x += (dx / length) * knockbackPower
        actor.body.velocity.y += (dy / length) * knockbackPower
      }
    }
  }
}
