'use strict';

class Maze {
  /**
   * Represent a maze. Because we're on a tile-based version,
   * we need to add more cells for the walls. The grid is filled
   * later depending on the algorithm.
   * @constructor
   * @param {number} x - x coordinate of the tile from which to start.
   * @param {number} y - y coordinate of the tile from which to start.
   */
  constructor(nrow, ncol) {
    this.nrow = Number(nrow * 2 - 1);
    this.ncol = Number(ncol * 2 - 1);
    this.grid = [];
  }

  /**
   * Fill the grid in with an alternation of walls and passages.
   */
  fillWithCross() {
    for (let r = 0; r < this.nrow; r++) {
      let row = [];
      if (r % 2 === 0) {
        for (let c = 0; c < this.ncol; c++) {
          c%2 === 0 ? row.push(new Cell(r, c, 0)) : row.push(new Cell(r, c, 1));
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
   * Return a row filled with the given type.
   * @param {number} rowIndex - Index of the row.
   * @param {number} type - Type of the cells.
   */
  fillRow(rowIndex, type) {
    let row = [];
    for (let c = 0; c < this.ncol; c++) {
      row.push(new Cell(rowIndex, c, type));
    }

    return row;
  }

  /**
   * Generate the maze based on the Depth-First search algorithm.
   * Use a stack to avoid depth of recursion.
   * @param {number} x - x coordinate of the tile from which to start.
   * @param {number} y - y coordinate of the tile from which to start.
   */
  processBacktrack(x, y) {
    this.fillWithCross();
    let stack = [], marked = new Set([]);
    marked.add(this.grid[x][y]);
    stack.push([x, y]);

    while (stack.length) {
      let current = stack.pop();
      let [cx, cy] = current;
      let neighbors = this.surroundings(cx, cy, 2);

      let validNeighbors = neighbors.filter(n => {
        if (!marked.has(this.grid[n[1][0]][n[1][1]])) {
          return n;
        }
      });

      if (validNeighbors.length) {
        const d = this.surroundingsNotCheck(cx, cy, 1);
        stack.push(current);
        let rIndex = randNum(validNeighbors.length);
        let [rDir, rCell] = validNeighbors[rIndex];
        this.grid[d[rDir][0]][d[rDir][1]].type = 0;
        marked.add(this.grid[rCell[0]][rCell[1]]);
        stack.push(rCell);
      }
    }
  }

  /**
   * Generate the maze based on Prim's algorithm.
   * Start on a random cell with even coordinates to avoid
   * unexplored rows and columns.
   */
  processPrim() {
    this.fillWithWalls();

    let r = randNum(this.grid.length/2) * 2;
    let c = randNum(this.grid[0].length/2) * 2;

    this.grid[r][c].type = 0;

    let frontier = new Set([]);
    let fNeighb = this.surroundings(r, c, 2);

    for (let cell of fNeighb) {
      let gridCell = this.grid[cell[1][0]][cell[1][1]];
      if (gridCell.type == 1) {
        frontier.add(gridCell);
      }
    }

    while (frontier.size) {
      let frontierCells = Array.from(frontier);
      let frontierCell = frontierCells[randNum(frontierCells.length)];
      let fRow = frontierCell.x, fCol = frontierCell.y;

      let neighbors = this.surroundings(fRow, fCol, 2);
      let validNeighbors = neighbors.filter(
        n => this.grid[n[1][0]][n[1][1]].type == 0
      );

      const d = this.surroundingsNotCheck(fRow, fCol, 1);
      let rIndex = randNum(validNeighbors.length);
      let rNeighbor = validNeighbors[rIndex];
      this.grid[d[rNeighbor[0]][0]][d[rNeighbor[0]][1]].type = 0;
      this.grid[fRow][fCol].type = 0;

      neighbors.forEach(n => {
        let gridCell = this.grid[n[1][0]][n[1][1]];
        if (gridCell.type == 1) {
          frontier.add(gridCell);
        }
      });

      frontier.delete(frontierCell);
    }
  }

  /**
   * Generate the maze based on the Hunt-and-Kill algorithm.
   */
  processHuntAndKill() {
    this.fillWithCross();
    let x = randNum(this.grid.length/2) * 2;
    let y = randNum(this.grid[0].length/2) * 2;
    let marked = new Set([]);
    let totalTiles = 0;

    while (totalTiles < this.nrow * this.ncol) {
      marked.add(this.grid[x][y]);
      let neighbors = this.surroundings(x, y, 2);

      let validNeighbors = neighbors.filter(
        n => !marked.has(this.grid[n[1][0]][n[1][1]])
      );

      if (validNeighbors.length) {
        const d = this.surroundingsNotCheck(x, y, 1);
        let rIndex = randNum(validNeighbors.length);
        let [rDir, rCell] = validNeighbors[rIndex];
        this.grid[d[rDir][0]][d[rDir][1]].type = 0;
        [x, y] = rCell;
      } else {
        let h = this.hunt(marked);
        if (h != undefined) [x, y] = h;
      }

      totalTiles += 1;
    }
  }

  /**
   * Take some time for large grids, could be improved by hunting
   * the neighbors from cells within the maze for example.
   */
  hunt(marked) {
    for (let r = 0; r < this.nrow; r++)
    for (let c = 0; c < this.ncol; c++) {
      if (this.grid[r][c].type != 0) continue;
      if (marked.has(this.grid[r][c])) continue;

      let neighbors = this.surroundings(r, c, 2);
      for (let n of neighbors) {
        if (!marked.has(this.grid[n[1][0]][n[1][1]]))
          continue;
        const d = this.surroundingsNotCheck(r, c, 1);
        this.grid[d[n[0]][0]][d[n[0]][1]].type = 0;
        return [r, c];
      }
    }
  }

  /**
   * Generate the maze based on the Binary Tree algorithm.
   * I'm using North/West bias but any others bias can could be
   * easily implemented following the same idea.
   * @param {number} x - x coordinate of the tile from which to start.
   * @param {number} y - y coordinate of the tile from which to start.
   */
  processBinaryTree(x, y) {
    this.fillWithCross();

    for (let r = 0; r < this.nrow; r += 2)
    for (let c = 0; c < this.ncol; c += 2) {
      const d = [
        ['N', [r - 1, c], [r - 2, c]],
        ['W', [r, c - 1], [r, c - 2]]
      ];

      if (r == 0 && c == 0) {
        continue;
      } else if (r == 0 && c) {
        var nextIndex = d[1];
      } else if (c == 0 && r) {
        var nextIndex = d[0];
      } else {
        var nextIndex = d[randNum(d.length)];
      }

      if (this.isWithinBounds(nextIndex[2][0], nextIndex[2][1])) {
        this.grid[nextIndex[1][0]][nextIndex[1][1]].type = 0;
      }
    }
  }

  /**
   * Return all cells coordinates at a distance of `n` cells around (x, y).
   * "Around" means vertically and horizontally.
   * @param {number} x - x coordinate of the tile.
   * @param {number} y - y coordinate of the tile.
   * @param {number} n - Distance from the tile.
   */
  surroundings(x, y, n) {
    let neighbors = [];
    const directions = [['N', [x, y - n]], ['S', [x, y + n]],
                      ['W', [x - n, y]], ['E', [x + n, y]]];

    directions.forEach(d => {
      let c = d[1][0], r = d[1][1];
      this.isWithinBounds(c, r) && neighbors.push(d);
    });

    return neighbors;
  }

  /**
   * Return all cells coordinates at a distance of `n` cells around (x, y).
   * Around means vertically and horizontally.
   * Return both valid and invalid cells.
   * @param {number} x - x coordinate of the tile.
   * @param {number} y - y coordinate of the tile.
   * @param {number} n - Distance from the tile.
   */
  surroundingsNotCheck(x, y , n) {
    return {
      'N': [x, y - n], 'S': [x, y + n],
      'W': [x - n, y], 'E': [x + n, y]
    };
  }

  /**
   * Return `true` if (x, y) lies within the limit of the maze.
   * @param {number} x - x coordinate of the tile.
   * @param {number} y - y coordinate of the tile.
   */
  isWithinBounds(x, y) {
    return x >= 0 && x < this.nrow && y >= 0 && y < this.ncol;
  }

  /**
   * Add border around the maze (with wrong coordinates for the sides).
   */
  addBorder() {
    this.nrow += 2;
    this.ncol += 2;

    for (let r of this.grid) {
      r.unshift(new Cell(0, 0, 1));
      r.push(new Cell(0, 0, 1));
    }

    this.grid.unshift(this.fillRow(0, 1));
    this.grid.push(this.fillRow(this.nrow - 1, 1));
  }

  /**
   * Main displaying function of the maze.
   */
  show() {
    let canvas = document.getElementById('canvasMaze');
    let divCanvas = document.getElementById('mazeSection');
    let grid = document.getElementById('grid').checked;
    const size = Number(document.getElementById('size').value);
    mazeSection.hidden = false;

    let ctx = canvas.getContext('2d');
    ctx.canvas.height = this.nrow * size;
    ctx.canvas.width = this.ncol * size;

    grid && this.drawGrid(ctx, size);
    this.printRaw(size);
    this.drawMaze(ctx, size);
  }

  /**
   * Fill a textarea with the raw version of the maze.
   * Basically, 0 & 1.
   * @param {number} size - The tile size.
   */
  printRaw(size) {
    let textRaw = document.getElementById('textRaw');
    let raw = '';
    for (let r = 0; r < this.nrow; r++) {
      for (let c = 0; c < this.ncol; c++) {
        raw += this.grid[r][c].type;
      }
      raw += '\n';
    }
    textRaw.innerHTML = raw;
  }

  /**
   * Draw an helpful grid on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} size - The tile size.
   */
  drawGrid(ctx, size) {
    ctx.strokeStyle = 'lightgrey';
    ctx.beginPath();

    let x = 0, y = 0;

    for (let c = 0; c < this.ncol; c++) {
      x += size;
      ctx.moveTo(x, y);
      ctx.lineTo(x, this.nrow * size);
    }

    x = 0;

    for (let r = 0; r < this.nrow; r++) {
      y += size;
      ctx.moveTo(x, y);
      ctx.lineTo(this.ncol * size, y);
    }

    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Draw the maze on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} size - The tile size.
   */
  drawMaze(ctx, size) {
    let color = document.getElementById('color').value;
    let x = 0, y = 0;
    ctx.fillStyle = color;

    for (let r of this.grid) {
      for (let c of r) {
        if (c.type == 1)
          ctx.fillRect(x, y, size, size);
        x += size;
      }
      x = 0;
      y += size;
    }
  }
}

class Cell {
  /**
   * Represent a cell of the maze (or a tile).
   * @constructor
   * @param {number} x - x coordinate of the Cell.
   * @param {number} y - y coordinate of the Cell.
   * @param {number} type - Can be 1 (wall) or 0 (passage).
   */
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

/**
 * Generate the maze according to the user inputs.
 */
function generate() {
  let selectAlgorithm = document.getElementById('algorithms');
  let algorithm = selectAlgorithm.options[selectAlgorithm.selectedIndex].value;
  let width = document.getElementById('width').value;
  let height = document.getElementById('height').value;
  let maze = new Maze(height, width);

  switch(algorithm) {
    case 'backtrack':
      maze.processBacktrack(0, 0);
      break;
    case 'prim':
      maze.processPrim();
      break;
    case 'huntandkill':
      maze.processHuntAndKill();
      break;
    case 'binarytree':
      maze.processBinaryTree(0, 0);
      break;
  }

  maze.addBorder();
  maze.show();
}

/**
 * Write the maze generated to the clipboard.
 * A wall is represented as a 1 and a passage as a 0.
 */
function writeClipboard() {
  let raw = document.getElementById('textRaw');
  navigator.clipboard.writeText(raw.innerHTML).then(function() {
    alert('Saved!');
  }, function() {
    alert('Cannot save...');
  });
}

/**
 * Return a number in [0;upperBound[
 * @param {number} upperBound - The upper limit (exclude).
 */
function randNum(upperBound) {
  return ~~(Math.random() * upperBound);
}
