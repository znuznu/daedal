export default class Cell {
  /**
   * Represent a cell of the maze (or a tile).
   *
   * @constructor
   * @param {number} r - row coordinate of the Cell.
   * @param {number} c - col coordinate of the Cell.
   * @param {number} type - Can be 1 (wall) or 0 (passage).
   * @param {Maze} maze - The maze that contains this Cell.
   */
  constructor(r, c, type, maze) {
    this.r = r;
    this.c = c;
    this.type = type;
    this.maze = maze;
  }

  /**
   * Get the Cell at n cells in the given direction or undefined if there isn't any.
   *
   * @param {string} direction - The direction the cell to check is.
   * @param {number} n - The gap between this and the Cell.
   * @returns {Cell} - The Cell if it exists, otherwise undefined.
   */
  getCellInDirection(direction, n) {
    let cell = undefined, c = -1, r = -1;

    switch (direction) {
      case 'north':
        r = this.r - n, c = this.c;
        break;
      case 'south':
        r = this.r + n, c = this.c;
        break;
      case 'west':
        r = this.r, c = this.c - n;
        break;
      case 'east':
        r = this.r, c = this.c + n;
        break;
    }

    if (this.maze.isWithinBounds(r, c)) {
      cell = this.maze.grid[r][c];
    }

    return cell;
  }

  /**
   * Is this Cell a wall ?
   */
  isWall() {
    return this.type === 1;
  }

  /**
   * This Cell becomes a passage.
   */
  carve() {
    this.type = 0;
  }
}
