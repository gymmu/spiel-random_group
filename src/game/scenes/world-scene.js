import Phaser from "phaser"
import Cave from "../gameObjects/doors/cave"
import { createPlayer } from "../gameObjects/player/player"
import NPC from "../gameObjects/player/npc"
import { getRegisteredGameObjects } from "../gameObjects/registry"
import { CameraManager } from "../camera"

// Importiere alle Spielobjekte, damit sie sich im Registry registrieren
import "../gameObjects/pickups/mushroom"
import "../gameObjects/pickups/flower"
import "../gameObjects/pickups/stone"
import "../gameObjects/pickups/bush"

/**
 * Erweiterung einer Phaser.Scene mit praktischen Funktionen um Spielobjekte
 * automatisch zu erstellen.
 */
export default class Base2DScene extends Phaser.Scene {
  map = null
  tiles = null
  obstacles = null
  items = null
  doors = null
  npcs = null
  player = null
  text = null
  mapKey = ""
  /**
   * Erstellt eine Instanz einer Phaser.Szene.
   */
  constructor() {
    super({ key: "world" })
    this.cameraManager = new CameraManager(this)
  }

  init(data) {
    this.mapKey = data.map
  }

  /**
   * Hier werden alle Spiel-Objekte erstellt.
   *
   * Diese Methode lädt alle Elemente von der Karte und platziert die Elemente
   * korrekt im Spielfeld. Es wird hier auch festgelegt was passiert wenn eine
   * Kollision von 2 Elementen passiert. Also das einige Elemente blockieren und
   * andere können aufgesammelt werden.
   *
   * Auch die Kamera wird eingestellt.
   *
   * @param {*} mapKey Welche Karte soll für diese Szene verwendet werden. Die
   * Karte muss zuerst in der preload-Methode geladen werden, der Name der dort
   * verwendet wurde, muss auch hier verwendet werden.
   */
  create() {
    this.items = this.add.group()
    this.stones = this.add.group() // Neue Gruppe für Steine
    this.doors = this.add.group()
    this.npcs = this.add.group()
    this.projectilesGroup = this.add.group()

    this.loadMap(this.mapKey)
    this.createPlayerObject()
    this.cameraManager.createCamera()
    this.setupDefaultCollisions()

    // In dieser Scene werden Lebenspunkte und andere Dinge angezeigt.
    this.scene.bringToTop("ui-scene")

    // Wird verwendet um weitere Spielinformationen an den Entwickler zu geben.
    this.scene.bringToTop("debug-scene")
  }

  /**
   * Diese Methode lädt die Spielkarte für eine Szene.
   *
   * Die Methode wird direkt aus der `create`-Methode aufgerufen, da ist bereits
   * beschrieben was alles erstellt wird.
   *
   * @param {*} mapKey Name der Karte die erstellt werden soll. Siehe auch hier
   * die `create`-Methode.
   */
  loadMap(mapKey) {
    // Erstellt die Karte so wie sie in `mapKey` definiert ist.
    this.map = this.make.tilemap({ key: mapKey })

    // Verwendet die Kacheln von "tileset" so wie es in **Tiled** verwendet wird.
    this.tiles = this.map.addTilesetImage("tileset")

    // Erstellt den "Background" Layer
    this.map.createLayer("Background", this.tiles, 0, 0)

    // Erstellt den "Obstacles" Layer. Hier kann der Spieler nicht durchlaufen.
    this.obstacles = this.map.createLayer("Obstacles", this.tiles, 0, 0)

    // Erstelle die einzelnen Objekte auf der Karte
    this.createMapObjects()

    // Erstelle die Türen
    this.createObjects(this.map, "Doors", "Cave", Cave, this.doors)

    // Erstelle die Gegner
    this.createObjects(this.map, "SpawnPoints", "NPC", NPC, this.npcs)
  }

  /**
   * Erstellt den Spieler-Charakter für die Szene.
   *
   * Diese Methode verwendet die importierte createPlayer-Funktion,
   * um den Spieler zu erstellen und in der Szene zu platzieren.
   */
  createPlayerObject() {
    this.player = createPlayer(this, this.map)
  }

  createMapObjects() {
    // Alle registrierten Objekte aus dem Registry erstellen
    const registry = getRegisteredGameObjects()
    registry.forEach((config, objectName) => {
      // Steine in eigene Gruppe, Rest wie gehabt
      if (objectName === "Stone") {
        this.createObjects(
          this.map,
          config.layer,
          objectName,
          config.class,
          this.stones,
        )
      } else {
        this.createObjects(
          this.map,
          config.layer,
          objectName,
          config.class,
          this.items,
        )
      }
    })
  }

  setupDefaultCollisions() {
    this.obstacles.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.player, this.obstacles)
    this.physics.add.collider(this.player, this.stones)
    this.physics.add.collider(this.npcs, this.stones)
    this.physics.add.collider(
      this.npcs,
      this.obstacles,
      this.npcCollideObstacles,
      () => true,
      this,
    )
    this.physics.add.collider(this.npcs, this.doors)
    this.physics.add.overlap(
      this.player,
      this.npcs,
      (player, npc) => npc.onCollide(player),
      () => true,
      this,
    )
    this.physics.add.overlap(
      this.player,
      this.items,
      (player, item) => item.onCollide(player),
      () => true,
      this,
    )

    this.physics.add.collider(
      this.player,
      this.doors,
      this.enterDoor,
      () => true,
      this,
    )

    // Set up projectile collisions after map and objects are loaded
    this.physics.add.collider(
      this.projectilesGroup,
      this.obstacles,
      (projectile, obstacle) => {
        if (projectile && projectile.destroy) {
          projectile.destroy()
          obstacle.destroy()
        }
      },
    )
    this.physics.add.collider(
      this.projectilesGroup,
      this.npcs,
      (projectile, npc) => {
        if (projectile && projectile.destroy) {
          projectile.destroy()
          npc.damage(projectile.attackPower)
        }
      },
    )
    const mergedGroup = this.add.group()
    mergedGroup.addMultiple(this.doors.getChildren())
    mergedGroup.addMultiple(this.items.getChildren())
    mergedGroup.addMultiple(this.stones.getChildren())
    this.physics.add.collider(
      this.projectilesGroup,
      mergedGroup,
      (projectile) => {
        if (projectile && projectile.destroy) projectile.destroy()
      },
    )
  }

  collideWithNPC(player, npc) {
    if (player == null) return
    if (player.gotHit) return
    player.gotHit = true
    // Nach 1 sekunden wieder normal
    this.time.delayedCall(1000, () => {
      player.gotHit = false
    })

    this.player.damage(10)
  }

  npcCollideObstacles(npc, obstacle) {
    if (npc == null) return
    npc.move = "idle"
  }

  /**
   * Diese Methode wird immer dann aufgerufen, wenn ein Spieler mit einer Türe
   * kollidiert. Die Methode funktioniert sehr ähnlich wie `pickUp`.
   *
   * Standartmässig sollte eine Türe den Spieler in eine andere Szene bringen.
   * Die Szene zu der ein Spieler gebracht wird, ist auf der Türe selber
   * definiert und wird in **Tiled** gesetzt.
   */
  enterDoor(actor, door) {
    if (!door) return
    door.onEnter(actor)
  }

  update() {
    // Updates for the game loop
    if (this.player) this.player.update()
    if (this.npcs) {
      this.npcs.children.entries.forEach((npc) => {
        npc.update()
      })
    }
  }

  /**
   * Set up colliders for a temporary interaction object with all relevant groups/layers.
   * @param {Phaser.Physics.Arcade.Sprite} obj
   */
  setupInteractionObjectColliders(obj) {
    if (!obj || !obj.body) return
    // Collide with items
    if (this.items) {
      this.physics.add.collider(obj, this.items)
      // Overlap: pick up stone
      this.physics.add.overlap(
        obj,
        this.stones,
        (interactionObj, item) => item.interact(this.player),
        null,
        this,
      )
    }
    // Collide with npcs
    if (this.npcs) {
      this.physics.add.collider(obj, this.npcs)
    }
    // Collide with doors
    if (this.doors) {
      this.physics.add.collider(obj, this.doors)
    }
    // Collide with player
    if (this.player) {
      this.physics.add.collider(obj, this.player)
    }
    // Collide with projectiles
    if (this.projectilesGroup) {
      this.physics.add.collider(obj, this.projectilesGroup)
    }
  }

  /**
   * Erstelle ein Spielobjekt an der Stelle des SpawnPoints auf der Karte.
   *
   * Diese Funktion wird verwendet um einzelne Objekte zu erstellen, wie zum
   * Beispiel den Spieler, oder einen Endgegner, sowie Spielobjekte die nur
   * einmal vorkommen.
   *
   * @param {*} map Die Karte in der das Spielobjekt definiert wurde.
   * @param {String} objectLayer Der Name des Layers in dem das Spielobjekt definiert wurde.
   * @param {String} objectName Der Name des Objekts, so wie es in der Karte
   * erstellt wurde (z.B. "SpawnPlayer").
   * @param {*} objectClass Die Klasse mit dem das neue Objekt erstellt werden
   * soll (z.B. Player).
   */
  createSingleObject(map, objectLayer, objectName, objectClass) {
    const spawnPoint = map.findObject(
      objectLayer,
      (obj) => obj.name === objectName,
    )
    return new objectClass(this, spawnPoint.x, spawnPoint.y)
  }

  /**
   * Erstelle alle Objekte aus einem Layer der Karte, mit einem bestimmten Typ.
   * Diese Funktion wird benötigt um Spielobjekte zu erstellen, mit denen ein
   * Spieler interagieren kann. Also Gegenstände die man aufsammeln kann, oder
   * auch Türen durch die man läuft.
   *
   * Diese Objekte bekommen noch die `Custom Properties` aus Tiled übergeben. So
   * können verschiedene Eigenschaften auf den Objekten gestezt werden. So
   * können zum Beispiel die Pilze verschieden viel Schaden anrichten. Man kann
   * auf Türen auch einstellen in welche Welt man gehen möchte.
   *
   * @param {*} map Die Karte in der das Spielobjekt definiert wurde.
   * @param {String} objectLayer Der Name des Layers in dem das Spielobjekt definiert wurde.
   * @param {String} objectName Der Name des Objekts, so wie es in der Karte
   * erstellt wurde (z.B. "Mushroom").
   * @param {*} objectClass Die Klasse mit dem das neue Objekt erstellt werden
   * soll (z.B. Mushroom).
   * @param {*} targetGroup Die Gruppe zu der ein Objekt hinzugefügt wird. Die
   * Gruppe wird gebraucht um auf kollision mit einem weiteren Objekt zu prüfen.
   */
  createObjects(map, objectLayer, objectName, objectClass, targetGroup) {
    const objects = map.filterObjects(
      objectLayer,
      (obj) => obj.name === objectName,
    )
    if (objects != null) {
      objects.forEach((obj) => {
        targetGroup.add(new objectClass(this, obj.x, obj.y, obj.properties))
      })
    }
  }
}
