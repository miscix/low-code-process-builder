/**
 * Combines two arrays.
 * @param arr1 the first array
 * @signature
 *    R.concat(arr1)(arr2);
 * @example
 *    R.concat(([1, 2, 3]) // [1, 2, 3, 'a']
 * @data_last
 * @category Array
 */
export const concat = <T>(arr1: T[]) => (arr2: T[]): T[] => [...arr1, ...arr2];
