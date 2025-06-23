import Phaser from "phaser"
/**
 * Spiellogik für das Level02.
 */
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: "loading" })
  }

  /**
   * Mit dieser Methode werden alle Resourcen geladen die vom Spiel gebraucht
   * werden. Hier werden alle Grafiken und auch Töne geladen. Diese können
   * danach im ganzen Spiel verwendet werden.
   */
  preload() {
    this.load.pack("pack", "./assets/data/pack.json")
  }

  init() {
    // Wir möchten auf das Drücken der Leertaste reagieren können, daher müssen
    // wir das hier registrieren.
    this.SPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    )
  }

  create() {
    this.add
      .text(320, 240, "Press SPACE to start the Game.")
      .setOrigin(0.5, 0.5)
  }

  update() {
    if (this.SPACE.isDown) {
      this.scene.start("world", { map: "map-level-01" })
    }
  }
}
