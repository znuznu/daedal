import Maze from './Maze.js';
import { randNum } from '../rng/Rng.js';

export default class MazeHuntAndKill extends Maze {
  constructor(nrow, ncol) {
    super(nrow, ncol);
  }

  /**
   * Generate the maze based on the Hunt-and-Kill algorithm.
   * Take some time for large grids, could be improved by hunting
   * the neighbors from cells within the maze for example.
   */
  process() {
    this.fillWithCross();

    let r = randNum(this.nrow / 2) * 2;
    let c = randNum(this.ncol / 2) * 2;

    let marked = new Set([]);
    let totalTiles = this.nrow * this.ncol;
    let processedTiles = 0;

    let cell = this.grid[r][c];

    while (processedTiles < totalTiles) {
      marked.add(cell);
      let neighbors = this.validSurroundings(cell, 2);

      let notMarked = neighbors.filter((n) => !marked.has(n.cell));

      if (notMarked.length) {
        let pick = notMarked[randNum(notMarked.length)];
        let wall = cell.getCellInDirection(pick.direction, 1);
        wall.carve();
        cell = pick.cell;
      } else {
        let h = this.hunt(marked);
        if (h != undefined) cell = h;
      }

      processedTiles += 1;
    }
  }

  /**
   * Scan the grid looking for an unvisited Cell with a visited neighbor.
   *
   * @param {Set} marked - The visited Cells.
   */
  hunt(marked) {
    for (let r = 0; r < this.nrow; r++)
      for (let c = 0; c < this.ncol; c++) {
        let cell = this.grid[r][c];

        if (cell.isWall() || marked.has(cell)) continue;

        let neighbors = this.validSurroundings(cell, 2);

        for (let n of neighbors) {
          if (!marked.has(n.cell)) continue;

          let wall = cell.getCellInDirection(n.direction, 1);
          wall.carve();

          return cell;
        }
      }
  }
}
