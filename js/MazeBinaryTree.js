import Maze from './Maze.js';
import { randNum } from './Maths.js';

export default class MazeBinaryTree extends Maze {
  constructor(nrow, ncol) {
    super(nrow, ncol);
  }

  /**
   * Generate the maze based on the Binary Tree algorithm.
   * I'm using North/West bias but any others bias can could be
   * easily implemented following the same idea.
   */
  process() {
    this.fillWithCross();

    for (let r = 0; r < this.nrow; r += 2)
    for (let c = 0; c < this.ncol; c += 2) {
      const directions = {
        north: {
          wall: {
            r: r - 1,
            c: c
          },
          passage: {
            r: r - 2,
            c: c
          }
        },
        west: {
          wall: {
            r: r,
            c: c - 1
          },
          passage: {
            r: r,
            c: c - 2
          }
        }
      }

      if (r == 0 && c == 0) {
        continue;
      } else if (r == 0 && c) {
        var next = directions.west;
      } else if (c == 0 && r) {
        var next = directions.north;
      } else {
        var next = directions.north;
        if (randNum(2) === 1) {
          next = directions.west;
        }
      }

      if (this.isWithinBounds(next.passage.r, next.passage.c)) {
        this.carve(next.wall.r, next.wall.c);
      }
    }
  }
}
