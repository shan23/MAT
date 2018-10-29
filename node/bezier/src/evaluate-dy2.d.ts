/**
 * Returns the y value of the once differentiated (with respect to t) quadratic
 * bezier when evaluated at t. This function is curried.
 * @param ps - A quadratic bezier, e.g. [[0,0],[1,1],[2,1]]
 * @param t - The t parameter
  */
declare function evaluateDy2(ps: number[][], t: number): number;
declare function evaluateDy2(ps: number[][]): (t: number) => number;
export { evaluateDy2 };
