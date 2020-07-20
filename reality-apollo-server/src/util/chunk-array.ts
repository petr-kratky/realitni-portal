/**
 * Returns an array with arrays of the given size.
 *
 * @param arr {Array} Array to split
 * @param chunkSize {Number} size of each chunk
 */

export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const results: T[][] = []

  while (arr.length) {
    results.push(arr.splice(0, chunkSize))
  }

  return results
}
