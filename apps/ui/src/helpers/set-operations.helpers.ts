/**
 * Set difference operation.
 *
 * @param set1
 * @param set2
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations
 */
export const difference = <T>(set1: Set<T>, set2: Set<T>) => {
  const _difference = new Set(set1);
  for (const elem of set2) {
    _difference.delete(elem);
  }
  return _difference;
};

/**
 * Set union operator.
 *
 * @param set1
 * @param sets
 */
export const union = <T>(set1: Set<T>, ...sets: Set<T>[]) => {
  const _union = new Set(set1);
  for (const _set of sets) {
    for (const elem of _set) {
      _union.add(elem);
    }
  }
  return _union;
};
