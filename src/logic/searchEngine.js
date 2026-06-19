/**
 * Filters the flower database array across spiritual name, botanical name, and common names.
 * Returns an empty array if the search query is empty or only whitespace.
 *
 * @param {string} searchQuery - The text query to filter by.
 * @param {Array} database - The database containing flower objects.
 * @returns {Array} List of matching flower entries.
 */
export function filterFlowers(searchQuery, database) {
  if (!searchQuery || !searchQuery.trim() || !Array.isArray(database)) {
    return [];
  }

  const query = searchQuery.trim().toLowerCase();

  return database.filter((flower) => {
    const spiritual = flower?.mothers_name || flower?.spiritual_name || flower?.spiritualName || '';
    const botanical = flower?.botanical_name || flower?.botanicalName || '';
    const commons = flower?.common_name || flower?.common_names || flower?.commonName || '';
    const commonsStr = Array.isArray(commons) ? commons.join(' ') : String(commons);

    return (
      spiritual.toLowerCase().includes(query) ||
      botanical.toLowerCase().includes(query) ||
      commonsStr.toLowerCase().includes(query)
    );
  });
}
