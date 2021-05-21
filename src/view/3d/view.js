import * as THREE from 'three';

class View3D {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 10;
    this.camera.position.x = 8;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
  }

  render({ id }) {
    document.getElementById(`${id}`).appendChild(this.renderer.domElement);
    this.renderer.setSize(this.width, this.height);
    this.renderer.render(this.scene, this.camera);
  }

  loadScene({ maze }) {
    this.scene.clear();

    for (const row of maze.grid) {
      for (const cell of row) {
        if (!cell.type) {
          break;
        }

        const geometry = new THREE.BoxGeometry(1, 1, 0.5).translate(
          10 * cell.r,
          10 * cell.c,
          1
        );
        const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const cube = new THREE.Mesh(geometry, material);

        this.scene.add(cube);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

export default View3D;
