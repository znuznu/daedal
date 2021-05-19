import '../style/stylesheet.css';

import { show, drawMaze } from './draw/Draw.js';
import MazeBacktrack from './maze/MazeBacktrack.js';
import MazeRecursiveDivision from './maze/MazeRecursiveDivision.js';
import MazePrim from './maze/MazePrim.js';
import MazeHuntAndKill from './maze/MazeHuntAndKill.js';
import MazeBinaryTree from './maze/MazeBinaryTree.js';
import MazeGrowingTree from './maze/MazeGrowingTree.js';

/**
 * Generate a pretty random maze as icon.
 */
window.onload = function generateIcon() {
  const canvas = document.getElementById('icon');
  let ctx = canvas.getContext('2d');

  let maze = new MazeGrowingTree(16, 16);
  maze.process();
  maze.addBorder();

  const size = 2;
  ctx.canvas.height = maze.nrow * size;
  ctx.canvas.width = maze.ncol * size;

  drawMaze(ctx, size, maze);
};

/**
 * Generate the maze according to the user inputs.
 */
window.generate = function generate() {
  let selectAlgorithm = document.getElementById('algorithms');
  let algorithm = selectAlgorithm.options[selectAlgorithm.selectedIndex].value;
  let width = document.getElementById('width').value;
  let height = document.getElementById('height').value;
  let maze = null;

  switch (algorithm) {
    case 'backtrack':
      maze = new MazeBacktrack(height, width);
      maze.process(0, 0);
      break;
    case 'recursiveDivision':
      maze = new MazeRecursiveDivision(height, width);
      maze.process();
      break;
    case 'prim':
      maze = new MazePrim(height, width);
      maze.process();
      break;
    case 'huntandkill':
      maze = new MazeHuntAndKill(height, width);
      maze.process();
      break;
    case 'btnw':
      maze = new MazeBinaryTree(height, width);
      maze.process('north', 'west');
      break;
    case 'btne':
      maze = new MazeBinaryTree(height, width);
      maze.process('north', 'east');
      break;
    case 'btsw':
      maze = new MazeBinaryTree(height, width);
      maze.process('south', 'west');
      break;
    case 'btse':
      maze = new MazeBinaryTree(height, width);
      maze.process('south', 'east');
      break;
    case 'growingTree':
      maze = new MazeGrowingTree(height, width);
      maze.process();
      break;
  }

  maze.addBorder();
  show(maze);
};
