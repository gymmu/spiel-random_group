import EVENTS from "../events"

export default class UIScene extends Phaser.Scene {
  hpElement = null
  hpValue = 0

  constructor() {
    super({ key: "ui-scene", active: true })
  }

  /**
   * Update the inventory display.
   *
   * This method will be called whenever the inventory update event is triggered.
   * It should update the visual representation of the inventory slots.
   *
   * @param {Array} inventory The current state of the player's inventory.
   */
  updateInventory(inventory) {
    // Clear existing inventory display
    this.children.list.forEach((child) => {
      if (child.isInventorySlot) {
        child.destroy()
      }
    })

    // Recreate inventory slots with updated items
    const slotWidth = 50
    const slotHeight = 50
    const slotSpacing = 10
    const totalWidth =
      inventory.length * slotWidth + (inventory.length - 1) * slotSpacing
    const startX = (this.cameras.main.width - totalWidth) / 2
    const startY = this.cameras.main.height - slotHeight - 10

    inventory.forEach((item, index) => {
      const x = startX + index * (slotWidth + slotSpacing)
      const y = startY

      // Create a rectangle to represent each inventory slot
      const slot = this.add
        .rectangle(x, y, slotWidth, slotHeight, 0x666666)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0xffffff)
        .setData("item", item) // Store item data in the slot
      slot.isInventorySlot = true
      // Add image to display the item's graphics
      if (item && item.frame !== undefined) {
        const itemImage = this.add
          .image(x + slotWidth / 2, y + slotHeight / 2, "pickups", item.name)
          .setOrigin(0.5, 0.5)
          .setDisplaySize(slotWidth - 10, slotHeight - 10) // Adjust size to fit within the slot

        // Associate the image with the slot for easy cleanup
        slot.itemImage = itemImage
      }
    })
  }

  /**
   * Create inventory slots at the bottom of the screen.
   */
  createInventorySlots() {
    const slotCount = 6
    const slotWidth = 50
    const slotHeight = 50
    const slotSpacing = 10
    const totalWidth = slotCount * slotWidth + (slotCount - 1) * slotSpacing
    const startX = (this.cameras.main.width - totalWidth) / 2
    const startY = this.cameras.main.height - slotHeight - 10

    for (let i = 0; i < slotCount; i++) {
      const x = startX + i * (slotWidth + slotSpacing)
      const y = startY

      // Create a rectangle to represent each inventory slot
      this.add
        .rectangle(x, y, slotWidth, slotHeight, 0x666666)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0xffffff)
    }
  }

  create() {
    this.hpElement = this.add.text(this.cameras.main.width, 0, "HP: --", {
      color: "#00ff00",
      align: "right",
    })
    this.hpElement.setOrigin(1, 0)
    this.createInventorySlots()

    // Create an emitter for inventory updates
    const inventoryEmitter = EVENTS.on(
      "update-inventory",
      this.updateInventory,
      this,
    )

    // Hiermit erstellen wir einen `Emitter`, der für die Kommunikation über
    // verschiedene Szenen verwendet werden kann.
    // Wir müssen einen Namen angeben, die Funktion die ausgeführt werden soll,
    // und der Kontext (also auf welchem Objekt der Emitter arbeitet).
    const emitter = EVENTS.on("update-hp", this.updateHp, this)

    // Wir rufen den Emitter hier einmal auf, damit die Lebenspunkte von Anfang
    // an richtig angezeigt werden.
    emitter.emit("update-hp")
  }

  updateHp(value) {
    this.hpValue = value
    this.hpElement.setText(`HP: ${this.hpValue}`)
  }
}
