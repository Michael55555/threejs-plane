import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneGeometry,
  PointLight,
  DirectionalLight,
  MeshPhongMaterial,
  Mesh,
} = THREE;

let vec,
  pos,
  scene,
  camera,
  renderer,
  geometry,
  material,
  cube,
  pointLight,
  ambientLight,
  light,
  width,
  height;
function init() {
  width = innerWidth;
  height = innerHeight;

  vec = new THREE.Vector3();
  pos = new THREE.Vector3();
  scene = new Scene();
  camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  renderer = new WebGLRenderer();
  geometry = new PlaneGeometry(16, 9, 27, 20);
  material = new MeshPhongMaterial({
    color: 0xffffff,
    flatShading: THREE.FlatShading,
  });
  cube = new Mesh(geometry, material);
  pointLight = new PointLight("#ffffff", 3, 0.7, 2);

  ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);
  light = new THREE.SpotLight(0xffffff, 0.3, 25, 2, 0, 1);

  scene.add(ambientLight);

  const { array } = geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    let x = array[i];
    let y = array[i + 1];
    let z = array[i + 2];

    array[i] = x + Math.random() * 0.1;
    array[i + 1] = y + Math.random() * 0.1;
    array[i + 2] = z + Math.random() * 0.1;
  }

  pointLight.position.set(0, 0, 0.5);
  light.position.set(0, 0, 5);
  light.lookAt(0, 0, 0);

  scene.add(light);
  scene.add(pointLight);
  scene.add(cube);

  camera.position.z = innerWidth / innerHeight < 1.5 ? 5 : 3;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  animate();
  initControls();
}

function initControls() {
  const gui = new dat.GUI({ name: "lightGUI" });
  const pointLightGUI = gui.addFolder("Point Light");
  const spotLightGUI = gui.addFolder("Spot Light");
  const ambientLightGUI = gui.addFolder("Ambient Light");

  const colorController = { pointLight: "#0000ff" };
  ambientLightGUI.add(ambientLight, "intensity", 0, 5, 0.1);

  pointLightGUI.add(pointLight.position, "x", -5, 5, 0.1);
  pointLightGUI.add(pointLight.position, "y", -5, 5, 0.1);
  pointLightGUI.add(pointLight.position, "z", -5, 5, 0.1);
  pointLightGUI.addColor(colorController, "pointLight").onChange((newValue) => {
    pointLight.color = new THREE.Color(newValue);
  });
  pointLightGUI.add(pointLight, "intensity", 0, 1000, 1);
  pointLightGUI.add(pointLight, "distance", 0, 3, 0.1);
  pointLightGUI.add(pointLight, "decay", 0, 1, 0.01);

  spotLightGUI.add(light.position, "x", -10, 10, 0.1);
  spotLightGUI.add(light.position, "y", -10, 10, 0.1);
  spotLightGUI.add(light.position, "z", 0, 5, 0.1);
  spotLightGUI.add(light, "intensity", 0, 1, 0.1);
  spotLightGUI.add(light, "distance", 0, 100, 1);
  spotLightGUI.add(light, "angle", 0, 5, 0.1);
  spotLightGUI.add(light, "penumbra", 0, 1, 0.1);
  spotLightGUI.add(light, "decay", 0, 5, 0.1);
}

function animate() {
  setTimeout(() => requestAnimationFrame(animate), 1000 / 60);
  renderer.render(scene, camera);
}

document.addEventListener("mousemove", ({ x, y }) => {
  y = y + window.scrollY;
  if (!pointLight) return;

  vec.set((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  const distance = -camera.position.z / vec.z;
  pos.copy(camera.position).add(vec.multiplyScalar(distance));
  pos.z = 0.5;
  pointLight.position.set(...pos.toArray());
});

function calculateHeight() {
  const tiles = Array.from(document.querySelectorAll("#tiles > div"));
  const firstY = tiles[0].getBoundingClientRect().top;
  const secondY = tiles[2].getBoundingClientRect().top;
  console.log(firstY, secondY);
  return (secondY + firstY) / 2;
}

if (document.readyState != "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

window.addEventListener("resize", () => {
  height = innerHeight;
  width = innerWidth;

  camera.position.z = innerWidth / innerHeight < 1.5 ? 5 : 3;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
});
