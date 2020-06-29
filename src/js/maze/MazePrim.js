import Maze from './Maze.js';
import { randNum } from '../maths/Maths.js';

export default class MazePrim extends Maze {
  constructor(nrow, ncol) {
    super(nrow, ncol);
  }

  /**
   * Generate the maze based on Prim's algorithm.
   * Start on a random cell with even coordinates to avoid
   * unexplored rows and columns.
   */
  process() {
    this.fillWithWalls();

    let frontier = new Set([]);

    let r = randNum(this.nrow / 2) * 2;
    let c = randNum(this.ncol / 2) * 2;

    let startCell = this.grid[r][c];

    startCell.carve();

    let frontierNeighbors = this.validSurroundings(startCell, 2);
    frontierNeighbors.forEach(n => {
      n.cell.isWall() && frontier.add(n.cell);
    })

    while (frontier.size) {
      let frontierCells = Array.from(frontier);
      let cell = frontierCells[randNum(frontierCells.length)];

      let neighbors = this.validSurroundings(cell, 2);
      let passageNeighbors = neighbors.filter(
        n => !n.cell.isWall()
      );

      let rIndex = randNum(passageNeighbors.length);
      let pick = passageNeighbors[rIndex];
      let wall = cell.getCellInDirection(pick.direction, 1);

      wall.carve();
      cell.carve();

      neighbors.forEach(n => {
        n.cell.isWall() && frontier.add(n.cell);
      });

      frontier.delete(cell);
    }
  }
}
