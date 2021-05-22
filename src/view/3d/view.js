import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class View3D {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    //Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(15, 8, 0);

    // Lights
    this.mainLight = new THREE.DirectionalLight(0xffffff);
    this.mainLight.position.set(0, 15, 0);
    this.mainLight.castShadow = true;

    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
  }

  init() {
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 0;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.render();
    this.animate();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  renderMaze({ maze, color }) {
    this.scene.clear();

    this.scene.add(this.mainLight);

    const rowOffset = maze.grid.length / 2;
    const colOffset = maze.grid[0].length / 2;

    // Non-efficient way to deal with the Meshes
    for (let i = 0; i < maze.grid.length; i++) {
      for (let j = 0; j < maze.grid[i].length; j++) {
        if (!maze.grid[i][j].type) {
          continue;
        }

        const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
        geometry.translate(
          0.5 * j - colOffset * 0.5 + 0.25,
          0.5,
          0.5 * i - rowOffset * 0.5 + 0.25
        );
        const material = new THREE.MeshPhongMaterial({
          color: `${color}`,
          emissive: 0x080808
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
