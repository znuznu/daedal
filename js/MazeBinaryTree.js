import Maze from './Maze.js';
import { randNum } from './Maths.js';

export default class MazeBinaryTree extends Maze {
  constructor(nrow, ncol) {
    super(nrow, ncol);
  }

  /**
   * Generate the maze based on the Binary Tree algorithm.
   * I'm using North/West bias but any others bias can could be
   * easily implemented following the same generic idea.
   */
  process() {
    this.fillWithCross();

    for (let r = 0; r < this.nrow; r += 2)
    for (let c = 0; c < this.ncol; c += 2) {
      let direction = undefined;

      if (r === 0 && c === 0)
        continue;

      if (r === 0 && c) {
        direction = 'west';
      } else if (c === 0 && r) {
        direction = 'north';
      } else {
        direction = 'north';

        if (!randNum(2))
          direction = 'west';
      }

      this.grid[r][c].getCellInDirection(direction, 1).carve();
    }
  }
}
