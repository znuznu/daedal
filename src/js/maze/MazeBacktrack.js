import Maze from './Maze.js';
import { randNum } from '../maths/Maths.js';

export default class MazeBacktrack extends Maze {
  constructor(nrow, ncol) {
    super(nrow, ncol);
  }

  /**
   * Generate the maze based on the Depth-First search algorithm.
   * Use a stack to avoid depth of recursion.
   *
   * @param {number} r - row coordinate of the tile from which to start.
   * @param {number} c - col coordinate of the tile from which to start.
   */
  process(r, c) {
    this.fillWithCross();

    let stack = [], marked = new Set([]);
    marked.add(this.grid[r][c]);
    stack.push(this.grid[r][c]);

    while (stack.length) {
      let current = stack.pop();

      let neighbors = this.validSurroundings(current, 2);

      let notMarked = neighbors.filter(
        n => !marked.has(n.cell)
      );

      if (notMarked.length) {
        stack.push(current);

        let pick = notMarked[randNum(notMarked.length)];

        let wall = current.getCellInDirection(pick.direction, 1);
        wall.carve();

        marked.add(pick.cell);
        stack.push(pick.cell);
      }
    }
  }
}
