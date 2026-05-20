/**
 * KOSMOS — SHARED NAVIGATION CATALOG
 * Data-driven flow and planet catalog for state-based navigation.
 * All navigation decisions originate from this catalog, not from file paths or URLs.
 *
 * Paths are computed dynamically based on the current scene's directory depth.
 */

/* ───── Scene Flow Order ───── */
export const SCENE_FLOW = ['LANDING', 'MILKYWAY', 'SOLAR_SYSTEM', 'PLANET_DETAIL'];

/* ───── Planet Keys (shared catalog) ───── */
export const PLANET_KEYS = [
  `sun`,
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'moon'
];

/* ───── Relative path prefixes per scene ───── */
// Each scene lives at a different directory depth from the project root.
// These prefixes compensate so the final path resolves correctly.
const SCENE_UP_PREFIX = {
  LANDING: '../',
  MILKYWAY: '../../',
  SOLAR_SYSTEM: '../',
  PLANET_DETAIL: '../../'
};

/* ───── Target paths relative to project root ───── */
const TARGET_PATHS = {
  LANDING: '1SCENE/index.html',
  MILKYWAY: 'MILKYWAY/shaders/index.html',
  SOLAR_SYSTEM: 'SOLAR_SYSTEM/index.html'
};

/**
 * Resolve the file path for a given scene, relative to the current page.
 * @param {string} scene - Scene key (LANDING, MILKYWAY, SOLAR_SYSTEM)
 * @param {string} fromScene - The current scene (to compute directory depth)
 * @returns {string} Relative path from the current page
 */
export function getScenePath(scene, fromScene) {
  if (!TARGET_PATHS[scene]) return null;
  const prefix = SCENE_UP_PREFIX[fromScene] || '../';
  return prefix + TARGET_PATHS[scene];
}

/**
 * Resolve the file path for a planet detail page, relative to the current page.
 * @param {string} planetKey - Lowercase planet key (e.g. 'earth')
 * @param {string} fromScene - The current scene (to compute directory depth)
 * @returns {string} Relative path from the current page
 */
export function getPlanetPath(planetKey, fromScene) {
  if (!PLANET_KEYS.includes(planetKey)) return null;
  const prefix = SCENE_UP_PREFIX[fromScene] || '../';
  return `${prefix}OBJECTS2/${planetKey}/index.html`;
}

/**
 * Get the index of a scene in the flow.
 * @param {string} scene - Scene key
 * @returns {number} Index in SCENE_FLOW, or -1 if not found
 */
export function getSceneIndex(scene) {
  return SCENE_FLOW.indexOf(scene);
}

/**
 * Get the next scene in the flow.
 * @param {string} currentScene - Current scene key
 * @returns {string|null} Next scene key, or null if at end of flow
 */
export function getNextScene(currentScene) {
  const idx = getSceneIndex(currentScene);
  if (idx === -1 || idx >= SCENE_FLOW.length - 1) return null;
  return SCENE_FLOW[idx + 1];
}

/**
 * Get the previous scene in the flow.
 * @param {string} currentScene - Current scene key
 * @returns {string|null} Previous scene key, or null if at start of flow
 */
export function getPrevScene(currentScene) {
  const idx = getSceneIndex(currentScene);
  if (idx <= 0) return null;
  return SCENE_FLOW[idx - 1];
}

/**
 * Get the next planet key in the catalog sequence.
 * @param {string} currentKey - Current planet key
 * @returns {string|null} Next planet key, or null if at end
 */
export function getNextPlanetKey(currentKey) {
  const idx = PLANET_KEYS.indexOf(currentKey);
  if (idx === -1 || idx >= PLANET_KEYS.length - 1) return null;
  return PLANET_KEYS[idx + 1];
}

/**
 * Get the previous planet key in the catalog sequence.
 * @param {string} currentKey - Current planet key
 * @returns {string|null} Previous planet key, or null if at start
 */
export function getPrevPlanetKey(currentKey) {
  const idx = PLANET_KEYS.indexOf(currentKey);
  if (idx <= 0) return null;
  return PLANET_KEYS[idx - 1];
}