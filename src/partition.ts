/**
 * Partition an array into two arrays using only Array.prototype.reduce.
 * Elements for which predicate(item) is true go into the first array,
 * the rest into the second.
 *
 * @returns [matched[], rest[]]
 */
export function partitionByReduce<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  // TODO: implement using array.reduce only
  return [[], []];
}
