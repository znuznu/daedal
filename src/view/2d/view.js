/**
 * Main displaying function of the maze.
 *
 * @param {Maze} maze - The maze.
 */
export function show(maze) {
  let canvas = document.getElementById('canvas');
  const size = 10;
  view.hidden = false;

  let ctx = canvas.getContext('2d');
  ctx.canvas.height = maze.nrow * size;
  ctx.canvas.width = maze.ncol * size;

  grid && drawGrid(ctx, size, maze);
  drawMaze(ctx, size, maze);
}

/**
 * NOTE: deadcode
 * Draw an helpful grid on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} size - The tile size.
 * @param {Maze} maze - The maze.
 */
function drawGrid(ctx, size, maze) {
  ctx.strokeStyle = 'lightgrey';
  ctx.beginPath();

  let x = 0,
    y = 0;

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
export function drawMaze(ctx, size, maze) {
  let color = document.getElementById('color').value;
  let x = 0,
    y = 0;

  ctx.fillStyle = color;

  for (let r of maze.grid) {
    for (let c of r) {
      if (c.type == 1) ctx.fillRect(x, y, size, size);
      x += size;
    }
    x = 0;
    y += size;
  }
}
