import Phaser from "phaser" // Importiert das Phaser-Framework, das für die Erstellung von Spielen verwendet wird.

// Importiere Szenen
import LoadingScene from "./scenes/loading-scene.js" // Importiert die Ladeszene des Spiels.
import UIScene from "./scenes/ui-scene.js" // Importiert die Benutzeroberflächenszene des Spiels.
import DebugScene from "./scenes/debug-scene.js" // Importiert die Debug-Szene des Spiels.
import Base2DScene from "./scenes/world-scene.js"

const config = {
  // Konfigurationsobjekt für das Spiel.
  type: Phaser.AUTO, // Legt den Renderer-Typ fest, der automatisch zwischen WebGL und Canvas wechselt.
  scale: {
    mode: Phaser.Scale.FIT, // Skaliert das Spiel, um in den verfügbaren Raum zu passen.
    autoCenter: Phaser.Scale.CENTER_BOTH, // Zentriert das Spiel horizontal und vertikal.
  },
  width: 640, // Breite des Spielbereichs, sollte ein Vielfaches von 32 sein, da die Tilesets 32x32 Pixel gross sind.
  height: 480, // Höhe des Spielbereichs, ebenfalls ein Vielfaches von 32.
  parent: "game-canvas", // Die ID des HTML-Elements, in das das Spiel gerendert wird.
  scene: [LoadingScene, UIScene, DebugScene, Base2DScene], // Die Szenen, die im Spiel verwendet werden.
  physics: {
    default: "arcade", // Standard-Physiksystem, das verwendet wird.
    arcade: {
      debug: true, // Aktiviert den Debug-Modus für die Physik, um Kollisionen und andere Informationen anzuzeigen.
      gravity: { y: 0 }, // Setzt die Schwerkraft auf 0, damit sich Objekte nicht von selbst bewegen.
    },
  },
}

const game = new Phaser.Game(config) // Erstellt eine neue Instanz des Spiels mit der angegebenen Konfiguration.
