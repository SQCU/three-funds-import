import * as THREE from './build/three.module.js';
import {OBJLoader} from './examples/jsm/loaders/OBJLoader.js';	//here goes nothing
console.log("three-funds-next");
//todo: import obj files at all
//todo: implement armcar-scenegraph.jpg

function main()	{
	//canvas block
	const canvas = document.querySelector('#canban');
	const renderer = new THREE.WebGLRenderer({canvas});

	//camera block
	const fov = 75;
	const aspect = 2;	//fuck you fundamentals
	const near = 0.1;
	const far = 1000;	//v v far away
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 35, 0);
	camera.up.set(0, 0, 1);	//no joke, the camera has to be told which direction is "up", instead of the default pos-y axis
	camera.lookAt(0, 0, 0);	//using the look-at func, which uhh, does what you would think it would do I suppose
	
	//scene block
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xAAAABB);
	
	const objectsman = [];	//this is where all of our geometry gets dumped

	//objloader trial
	{
	const objLoader = new OBJLoader();
	objLoader.load('threejs/models/AML/AML-60-trial.obj', (root) =>{
		scene.add(root);
		root.scale.set(5,5,5);
		objectsman.push(root);
	});
	}


	//this is just our basic baby light to give sense of space, offset from center
	const licolor = 0xFFFFFF;
	const liintensity = .7;
	const light = new THREE.DirectionalLight(licolor, liintensity);
	light.position.set(-1,2,5);	//lights default to a target of 0,0,0; moving its position preserves its target
	scene.add(light);
	
	//add an axesHelper to visualize node direction
	objectsman.forEach((node) => {
		const axes = new THREE.AxesHelper();
		axes.material.depthTest = false; //draw regardless of whether 'behind' other object
		axes.renderOrder =1 ; //magic number to have axes drawn after all other objects in scene
		node.add(axes);
		
	});
	
function render(time) {
	time *= 0.001;
	
	//checks if canvas size has changed; if so, update and pass true
	function resizerchecker(renderer) { //returns true if the canvas was resizered
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needresize = canvas.width !== width || canvas.height !== height;
	if (needresize) {
	renderer.setSize(width, height, false);	//sets internal resolution
	}
	return needresize;
	}	
	if(resizerchecker(renderer)){
	//allows for canvas resizey
	const canvas = renderer.domElement;
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();
	}
	
	//debug animation of just making everything spin
	objectsman.forEach((obj) => {
		obj.rotation.z = time;
		obj.rotation.y = time;
	});
	
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
	//render invocation
	requestAnimationFrame(render);
}
main();