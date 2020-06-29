import Maze from './Maze.js';
import { randNum } from '../maths/Maths.js';
import BinaryHeap from '../struct/BinaryHeap.js';

export default class MazeGrowingTree extends Maze {
  constructor(nrow, ncol) {
    super(nrow, ncol);
  }

  /**
   * Generate the maze based on the Growing Tree algorithm.
   * The way cells are picked is a 50% random/50% newest chances split.
   */
  process() {
    this.fillWithCross();
    let marked = new Set([]);
    let c = new BinaryHeap(data => data.age);
    let randR = randNum(this.nrow / 2) * 2;
    let randC = randNum(this.ncol / 2) * 2;

    let age = this.nrow * this.ncol;

    let startData = {
      age: age,
      cell: this.grid[randR][randC]
    };

    marked.add(startData.cell);
    c.push(startData);

    while (c.datas.length) {

      let pickedData = this.pick(c);
      let cell = pickedData.cell;
      let neighbors = this.validSurroundings(cell, 2);

      neighbors = neighbors.filter(n => !marked.has(n.cell));

      if (neighbors.length) {
        let randNObject = neighbors[randNum(neighbors.length)];

        let wall = cell.getCellInDirection(randNObject.direction, 1);
        wall.carve();

        age -= 1;

        let neighborData = {
          age: age,
          cell: randNObject.cell
        };

        c.push(pickedData);
        c.push(neighborData);
        marked.add(neighborData.cell);
      }
    }
  }

  /**
   * Pick a Cell using a random option between:
   * - the newest Cell
   * - a random Cell
   *
   * There's 50% chances to take an option or the other.
   *
   * @param {BinaryHeap} heap - The Binary Heap containing the Cells to process.
   */
  pick(heap) {
    const options = ['random', 'newest'];
    let randM = options[randNum(options.length)];

    let data = undefined;

    if (randM === 'random') {
      data = heap.datas[randNum(heap.datas.length)];
      heap.remove(data);
    } else {
      data = heap.pop();
    }

    return data;
  }
}
