import "./style.css";
import * as THREE from "three";

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneGeometry,
  MeshPhongMaterial,
  Mesh,
} = THREE;

let scene = null;
let renderer = null;
let camera = null;
let geometry = null;
let material = null;
let cube = null;
let light = null;
let pointLight = null;
const width = innerWidth;
const height = innerHeight;
let vec = new THREE.Vector3();
let pos = new THREE.Vector3();

function init() {
  scene = new Scene();
  camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  renderer = new WebGLRenderer();
  geometry = new PlaneGeometry(7, 7, 10, 10);
  material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
  });
  cube = new Mesh(geometry, material);
  pointLight = new THREE.PointLight(0xffffff, 0.7, 2, 2);

  const { array } = geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    let x = array[i];
    let y = array[i + 1];
    let z = array[i + 2];

    array[i] = x + Math.random() * 0.1;
    array[i + 1] = y + Math.random() * 0.1;
    array[i + 2] = z + Math.random() * 0.2;
  }

  pointLight.position.set(0, 0, 0.5);

  scene.add(pointLight);
  scene.add(cube);

  camera.position.z = 5;

  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  animate();
}

function animate() {
  setTimeout(() => requestAnimationFrame(animate), 1000 / 60);
  renderer.render(scene, camera);
}

document.addEventListener("mousemove", ({ x, y }) => {
  if (!pointLight) return;

  vec.set((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  const distance = -camera.position.z / vec.z;
  pos.copy(camera.position).add(vec.multiplyScalar(distance));
  pos.z = 0.5;
  pointLight.position.set(...pos.toArray());
});
onload = init;
