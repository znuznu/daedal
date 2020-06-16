/**
 * Return a number in [0;upperBound[
 * @param {number} upperBound - The upper limit (exclude).
 */
export function randNum(upperBound) {
  return ~~(Math.random() * upperBound);
}
