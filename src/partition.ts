/**
 * Partition an array into two arrays.
 * Elements for which predicate(item) is true go into the first array,
 * the rest into the second.
 *
 * @returns [matched[], rest[]]
 */
export function partitionByReduce<T>(
  array: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  // TODO: implement
  return [[], []];
}
