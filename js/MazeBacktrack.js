import Maze from './Maze.js';
import { randNum } from './Maths.js';

export default class MazeBacktrack extends Maze {
  constructor(nrow, ncol) {
    super(nrow, ncol);
  }

  /**
   * Generate the maze based on the Depth-First search algorithm.
   * Use a stack to avoid depth of recursion.
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

      let neighbors = this.validSurroundings(
        current.r,
        current.c,
        2
      );

      let notMarked = neighbors.filter(n => {
        if (!marked.has(n.cell)) {
          return n;
        }
      });

      if (notMarked.length) {
        stack.push(current);

        let rCell = notMarked[randNum(notMarked.length)];
        let rRow = rCell.cell.r, rCol = rCell.cell.c;

        let wall = current.getCellInDirection(rCell.direction, 1);
        this.carve(wall.r, wall.c);
        
        marked.add(rCell.cell);
        stack.push(rCell.cell);
      }
    }
  }
}
