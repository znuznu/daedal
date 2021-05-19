import Cell from './Cell.js';

export default class Maze {
  /**
   * An "abstract" class representing a maze. Because we're on a
   * tile-based version, we need to add more cells for the walls.
   * The grid is filled later depending on the algorithm.
   *
   * @constructor
   * @param {number} nrow - number of rows.
   * @param {number} ncol - number of cols.
   */
  constructor(nrow, ncol) {
    this.nrow = Number(nrow * 2 - 1);
    this.ncol = Number(ncol * 2 - 1);
    this.grid = [];
  }

  /**
   * Process the algorithm.
   */
  process() {}

  /**
   * Fill the grid in with an alternation of walls and passages.
   */
  fillWithCross() {
    for (let r = 0; r < this.nrow; r++) {
      let row = [];
      if (r % 2 === 0) {
        for (let c = 0; c < this.ncol; c++) {
          let cell = new Cell(r, c, 1, this);

          if (c % 2 === 0) cell = new Cell(r, c, 0, this);

          row.push(cell);
        }
      } else {
        row = this.fillRow(r, 1);
      }
      this.grid.push(row);
    }
  }

  /**
   * Fill the grid in with walls.
   */
  fillWithWalls() {
    for (let r = 0; r < this.nrow; r++) {
      let row = this.fillRow(r, 1);
      this.grid.push(row);
    }
  }

  /**
   * Fill the grid in with passages.
   */
  fillWithPassages() {
    for (let r = 0; r < this.nrow; r++) {
      let row = this.fillRow(r, 0);
      this.grid.push(row);
    }
  }

  /**
   * Return a row filled with the given type.
   *
   * @param {number} rowIndex - Index of the row.
   * @param {number} type - Type of the cells.
   * @returns {Array} - A row of Cell.
   */
  fillRow(rowIndex, type) {
    let row = [];
    for (let c = 0; c < this.ncol; c++) {
      row.push(new Cell(rowIndex, c, type, this));
    }

    return row;
  }

  /**
   * Get all existing cells at a distance of `n` cells around Cell.
   * "Around" means vertically and horizontally.
   *
   * @param {number} r - x coordinate of the tile.
   * @param {Cell} cell - The Cell to process.
   * @returns {Array} - Return an array containing objects with the direction and the Cell.
   */
  validSurroundings(cell, n) {
    let validNeighbors = [];
    const directions = ['north', 'south', 'west', 'east'];

    directions.forEach((direction) => {
      let cellInDirection = cell.getCellInDirection(direction, n);
      if (cellInDirection) {
        validNeighbors.push({
          direction: direction,
          cell: cellInDirection
        });
      }
    });

    return validNeighbors;
  }

  /**
   * Return `true` if (r, c) lies within the limit of the maze.
   *
   * @param {number} r - row coordinate of the tile.
   * @param {number} c - col coordinate of the tile.
   * @returns {boolean} - If the maze contains such coordinates.
   */
  isWithinBounds(r, c) {
    return r >= 0 && r < this.nrow && c >= 0 && c < this.ncol;
  }

  /**
   * Add border around the maze (with wrong coordinates for the sides).
   */
  addBorder() {
    this.nrow += 2;
    this.ncol += 2;

    for (let r of this.grid) {
      r.unshift(new Cell(0, 0, 1, this));
      r.push(new Cell(0, 0, 1, this));
    }

    this.grid.unshift(this.fillRow(0, 1));
    this.grid.push(this.fillRow(this.nrow - 1, 1));
  }
}
