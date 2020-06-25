import MazeBinaryTree from './MazeBinaryTree.js';
import MazeBacktrack from './MazeBacktrack.js';
import MazePrim from './MazePrim.js';
import MazeHuntAndKill from './MazeHuntAndKill.js';
import { show } from './Draw.js';

/**
 * Generate the maze according to the user inputs.
 */
window.generate = function generate() {
  let selectAlgorithm = document.getElementById('algorithms');
  let algorithm = selectAlgorithm.options[selectAlgorithm.selectedIndex].value;
  let width = document.getElementById('width').value;
  let height = document.getElementById('height').value;
  let maze = undefined;

  switch(algorithm) {
    case 'backtrack':
      maze = new MazeBacktrack(height, width);
      maze.process(0, 0);
      break;
    case 'prim':
      maze = new MazePrim(height, width);
      maze.process();
      break;
    case 'huntandkill':
      maze = new MazeHuntAndKill(height, width);
      maze.process();
      break;
    case 'binarytree':
      maze = new MazeBinaryTree(height, width);
      maze.process();
      break;
  }

  maze.addBorder();
  show(maze);
}

/**
 * Write the maze generated to the clipboard.
 * A wall is represented as a 1 and a passage as a 0.
 */
window.writeClipboard = function writeClipboard() {
  let raw = document.getElementById('textRaw');
  navigator.clipboard.writeText(raw.innerHTML).then(function() {
    alert('Saved!');
  }, function() {
    alert('Cannot save...');
  });
}
