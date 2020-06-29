import Maze from './Maze.js';
import { randNum } from '../maths/Maths.js';

export default class MazeBinaryTree extends Maze {
  constructor(nrow, ncol) {
    super(nrow, ncol);
  }

  /**
   * Generate the maze based on the Binary Tree algorithm.
   * Two directions representing the bias are required.
   *
   * @param {string} vDirection - The vertical direction.
   * @param {string} hDirection - The horizontal direction.
   */
  process(vDirection, hDirection) {
    this.fillWithCross();

    for (let r = 0; r < this.nrow; r += 2)
    for (let c = 0; c < this.ncol; c += 2) {
      const constraints = {
        'north': r === 0,
        'south': r === this.nrow - 1,
        'west': c === 0,
        'east': c === this.ncol - 1,
      };

      let direction = undefined;

      if (constraints[vDirection] && constraints[hDirection]) {
        continue;
      }

      if (constraints[vDirection] && !constraints[hDirection]) {
        direction = hDirection;
      } else if (!constraints[vDirection] && constraints[hDirection]) {
        direction = vDirection;
      } else {
        direction = vDirection;

        if (!randNum(2))
          direction = hDirection;
      }

      this.grid[r][c].getCellInDirection(direction, 1).carve();
    }
  }
}
