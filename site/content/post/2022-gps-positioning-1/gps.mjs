const domNode = document.querySelector("#satellites");
const domStyle = window.getComputedStyle(domNode, null);
const w = domStyle.width.substring(0, domStyle.width.length - 2);
const h = w * 0.625;
const ratio = w / h;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
domNode.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0x666666);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
scene.add(directionalLight);

const loader = new THREE.TextureLoader();
const texture = loader.load('earth.jpg');
const geometry = new THREE.SphereGeometry(0.8, 16, 16);
const material = new THREE.MeshLambertMaterial({ map: texture});
const earth = new THREE.Mesh(geometry, material);

scene.add(earth);

const lineMat = new THREE.LineBasicMaterial({ color: 0x665555, opacity: 1 });
const ellipseCurve = new THREE.EllipseCurve(0, 0, 2.8, 2.8, 0, 2.0 * Math.PI, false, 0);
const lineGeom = new THREE.BufferGeometry().setFromPoints(ellipseCurve.getPoints(100));

console.log(lineGeom);

const orbit1 = new THREE.Line(lineGeom, lineMat);
orbit1.rotation.x = Math.PI / 4;
scene.add(orbit1);

const orbit2 = new THREE.Line(lineGeom, lineMat);
orbit2.rotation.x = -Math.PI / 4;
scene.add(orbit2);

const orbit3 = new THREE.Line(lineGeom, lineMat);
orbit3.rotation.y = Math.PI / 4;
scene.add(orbit3);


const orbit4 = new THREE.Line(lineGeom, lineMat);
orbit4.rotation.y = -Math.PI / 4;
scene.add(orbit4);

camera.position.z = 5;

function animate() {
	requestAnimationFrame(animate);
  earth.rotation.y -= 0.0025;
	renderer.render(scene, camera);
};

animate();