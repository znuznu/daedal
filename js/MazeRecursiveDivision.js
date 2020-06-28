import Maze from './Maze.js';
import { randNum } from './Maths.js';

export default class MazeRecursiveDivision extends Maze {
  constructor(nrow, ncol) {
    super(nrow, ncol);
  }

  /**
   * Generate the maze based on the Recursive Division algorithm.
   */
  process() {
    this.fillWithPassages();
    this.divide(0, 0, this.nrow, this.ncol);
  }

  /**
   * Pick a row or a col index in the given area, build a wall with one passage
   * at this index, then recursively call this function at the left/right or
   * top/down area of the row/col generated.
   *
   * @param {number} r - row coordinate of the tile from which to start.
   * @param {number} c - col coordinate of the tile from which to start.
   * @param {number} rows - The height (tiles) of the area to use.
   * @param {number} cols - The width (tiles) of the area to use.
   */
  divide(r, c, rows, cols) {
    if (rows < 2 || cols < 2)
      return;

    const orientations = [
      {
        type: 'VERTICAL',
        index: c + randNum(~~(cols / 2)) * 2 + 1,
        wall: r + randNum(~~(rows / 2)) * 2
      },
      {
        type: 'HORIZONTAL',
        index: r + randNum(~~(rows / 2)) * 2 + 1,
        wall: c + randNum(~~(cols / 2)) * 2
      }
    ];

    let orientation = orientations[randNum(2)];

    if (cols > rows) {
      orientation = orientations[0];

    } else if (rows > cols) {
      orientation = orientations[1];
    }

    if (orientation.type === 'HORIZONTAL') {
      for (let col = c; col < c + cols; col++) {
        if (col !== orientation.wall)
          this.grid[orientation.index][col].buildWall();
      }

      this.divide(r, c, orientation.index - r, cols);
      this.divide(
        orientation.index + 1, c,
        rows - 1 - orientation.index + r, cols
      );
    } else {
      for (let row = r; row < r + rows; row++) {
        if (row !== orientation.wall)
          this.grid[row][orientation.index].buildWall();
      }

      this.divide(r, c, rows, orientation.index - c);
      this.divide(
        r, orientation.index + 1,
        rows, cols - 1 - orientation.index + c
      );
    }
  }
}
