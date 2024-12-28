/**
 * Filters the objects based on matching IDs.
 *
 * @param {Array} objects - Array of objects to be filtered.
 * @param {Array} ids - Array of IDs to match.
 * @returns {Array} - Filtered array of matching objects.
 */

export function filterObjectsByIds<T extends { id: string }>(
  objects: Record<string, any>[],
  ids: string[]
): Record<string, any>[] {
  return objects.filter((obj) => ids.includes(obj.id));
}
