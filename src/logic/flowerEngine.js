import bundledDatabase from '../data/flowers_database.json' with { type: 'json' };

/**
 * Initializes the local-first database cache.
 * Checks persistent storage for cached database; if not found, stores the bundled asset.
 * @param {Object} storage - Persistent storage interface (e.g. AsyncStorage, LocalStorage, etc.)
 * @param {string} cacheKey - The key to store the database under
 * @returns {Promise<Array>} The loaded database array
 */
export async function initializeDatabase(storage, cacheKey = 'flowers_database_cache') {
  try {
    const cachedData = await storage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    // Cache does not exist, save the immutable local bundle
    await storage.setItem(cacheKey, JSON.stringify(bundledDatabase));
    return bundledDatabase;
  } catch (error) {
    console.warn('Failed to load database from cache, falling back to bundle:', error);
    return bundledDatabase;
  }
}

/**
 * Indexes the flower entries by their botanical name for quick lookups.
 * @param {Array} database - The flower database array
 * @returns {Object} A mapping of botanical_name to array of flower entries
 */
export function indexByBotanicalName(database) {
  const index = {};
  for (const entry of database) {
    const name = entry.botanical_name || 'unknown';
    if (!index[name]) {
      index[name] = [];
    }
    index[name].push(entry);
  }
  return index;
}

/**
 * Filters the flower entries by a visual marker such as primary_color.
 * @param {Array} database - The flower database array
 * @param {string} color - The primary color to filter by
 * @returns {Array} Filtered list of flower entries
 */
export function filterByPrimaryColor(database, color) {
  if (!color) return database;
  const target = color.toLowerCase();
  return database.filter(entry => 
    (entry.primary_color && entry.primary_color.toLowerCase() === target) ||
    (entry.all_colors && entry.all_colors.some(c => c.toLowerCase() === target))
  );
}

/**
 * Searches flower entries by a text query in names or significance.
 * @param {Array} database - The flower database array
 * @param {string} query - Search term
 * @returns {Array} Matching flower entries
 */
export function searchFlowers(database, query) {
  if (!query) return database;
  const term = query.toLowerCase();
  return database.filter(entry => 
    (entry.spiritual_name && entry.spiritual_name.toLowerCase().includes(term)) ||
    (entry.botanical_name && entry.botanical_name.toLowerCase().includes(term)) ||
    (entry.significance && entry.significance.toLowerCase().includes(term)) ||
    (entry.common_names && entry.common_names.some(c => c.toLowerCase().includes(term)))
  );
}
