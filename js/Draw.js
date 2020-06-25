/**
 * Main displaying function of the maze.
 *
 * @param {Maze} maze - The maze.
 */
export function show(maze) {
  let canvas = document.getElementById('canvasMaze');
  let grid = document.getElementById('grid').checked;
  const size = Number(document.getElementById('size').value);
  mazeSection.hidden = false;
  rawSection.hidden = false;

  let ctx = canvas.getContext('2d');
  ctx.canvas.height = maze.nrow * size;
  ctx.canvas.width = maze.ncol * size;

  grid && drawGrid(ctx, size, maze);
  printRaw(size, maze);
  drawMaze(ctx, size, maze);
}

/**
 * Fill a textarea with the raw version of the maze.
 * Basically, 0 & 1.
 *
 * @param {number} size - The tile size.
 * @param {Maze} maze - The maze.
 */
function printRaw(size, maze) {
  let textRaw = document.getElementById('textRaw');
  let raw = '';

  for (let r = 0; r < maze.nrow; r++) {
    for (let c = 0; c < maze.ncol; c++) {
      raw += maze.grid[r][c].type;
    }
    raw += '\n';
  }

  textRaw.innerHTML = raw;
}

/**
 * Draw an helpful grid on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} size - The tile size.
 * @param {Maze} maze - The maze.
 */
function drawGrid(ctx, size, maze) {
  ctx.strokeStyle = 'lightgrey';
  ctx.beginPath();

  let x = 0, y = 0;

  for (let c = 0; c < maze.ncol; c++) {
    x += size;
    ctx.moveTo(x, y);
    ctx.lineTo(x, maze.nrow * size);
  }

  x = 0;

  for (let r = 0; r < maze.nrow; r++) {
    y += size;
    ctx.moveTo(x, y);
    ctx.lineTo(maze.ncol * size, y);
  }

  ctx.stroke();
  ctx.closePath();
}

/**
 * Draw the maze on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} size - The tile size.
 * @param {Maze} maze - The maze.
 */
function drawMaze(ctx, size, maze) {
  let color = document.getElementById('color').value;
  let x = 0, y = 0;

  ctx.fillStyle = color;

  for (let r of maze.grid) {
    for (let c of r) {
      if (c.type == 1)
        ctx.fillRect(x, y, size, size);
      x += size;
    }
    x = 0;
    y += size;
  }
}
