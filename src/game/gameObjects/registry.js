/**
 * Registry für Spielobjekte.
 *
 * Dieses Modul ermöglicht es, neue Spielobjekte zu registrieren,
 * ohne die base-2d-scene.js Datei zu ändern.
 */

// Map zur Speicherung aller registrierten Spielobjekte
const gameObjectRegistry = new Map()

/**
 * Registriert ein neues Spielobjekt im Registry.
 *
 * @param {string} objectName Der Name des Objekts, wie er in der Tiled-Karte verwendet wird
 * @param {class} objectClass Die Klasse des Spielobjekts
 * @param {string} layerName Der Name des Layers, in dem das Objekt in Tiled platziert wird (Standard: "Items")
 */
export function registerGameObject(
  objectName,
  objectClass,
  layerName = "Items",
) {
  gameObjectRegistry.set(objectName, {
    class: objectClass,
    layer: layerName,
  })
}

/**
 * Gibt alle registrierten Spielobjekte zurück.
 *
 * @returns {Map} Eine Map mit allen registrierten Spielobjekten
 */
export function getRegisteredGameObjects() {
  return gameObjectRegistry
}
