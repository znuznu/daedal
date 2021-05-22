import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class View3D {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 30, 0);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  init({ id }) {
    document.getElementById(`${id}`).appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 0;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.render();
    this.animate();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  loadMaze({ maze }) {
    this.scene.clear();

    const rowOffset = maze.grid.length / 2;
    const colOffset = maze.grid.length / 2;

    for (let i = 0; i < maze.grid.length; i++) {
      for (let j = 0; j < maze.grid[i].length; j++) {
        if (!maze.grid[i][j].type) {
          continue;
        }

        const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
        geometry.translate(0.5 * j - colOffset * 0.5, 0.5, 0.5 * i - rowOffset * 0.5);
        const material = new THREE.MeshBasicMaterial({
          color: `#${Math.floor(100000 + Math.random() * 800000)}`
        });
        const cube = new THREE.Mesh(geometry, material);

        this.scene.add(cube);
      }
    }

    this.render();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.render();
  }
}

export default View3D;
