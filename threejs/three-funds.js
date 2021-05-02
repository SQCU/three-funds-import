import * as THREE from './build/three.module.js';
import {GLTFLoader}	from './examples/jsm/loaders/GLTFLoader.js';
console.log("three-funds-import");
//todo: import obj files at all
//UH OH OBJ FILES ARE JUNK
//todo: import serialized data format
//done
//todo: scenegraph model into a sensible data structure

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
	camera.position.set(0, 5, 0);
	camera.up.set(0, 0, 1);	//no joke, the camera has to be told which direction is "up", instead of the default pos-y axis
	camera.lookAt(0, 0, 0);	//using the look-at func, which uhh, does what you would think it would do I suppose
	
	//scene block
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xAAAABB);
	
	const objectsman = [];	//this is where all of our geometry gets dumped

	//	🤢,🤮	traverses a scene graph and pukes the last entry in each level of a heirarchy
	function dumper(obj, lines = [], isLast = true, prefix = '' ){
		const localPrefixer = isLast ? '🤮' : '🤢'; 		
		lines.push(`${prefix}${prefix ? localPrefixer : ''}${obj.name || 'the-nameless-error'} ->${obj.type}<-`);
		const newPrefix = prefix + (isLast ? ' ' : '| ');
		const lastindex = obj.children.length -1;
		obj.children.forEach((child, ndx) => {
			const isLast = ndx === lastindex;	//honestly who can say what this comparison really does
			dumper(child, lines, isLast, newPrefix);
		});
		return lines;
	}
	
	
	{	//GLTFLoader trial
		const gltfLoader = new GLTFLoader();
		const url = 'threejs/models/AML/AML-60.glb';
		gltfLoader.load(url, (gltf) => {
		const root = gltf.scene;
		scene.add(root);	
		objectsman.push(root);
		console.log(`name of ${root.name} and ${root.children.length} unexplored depth`);
		console.log(dumper(root).join('\n'));
		});
		
	}
	
		
	//this is just our basic baby light to give sense of space, offset from center
	const licolor = 0xFFFFFF;
	const liintensity = .7;
	const light = new THREE.DirectionalLight(licolor, liintensity);
	light.position.set(-1,2,5);	//lights default to a target of 0,0,0; moving its position preserves its target
	scene.add(light);
	
	
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
		obj.rotation.x = time/3;
		obj.rotation.y = time/2;
	});
	
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
	//render invocation
	requestAnimationFrame(render);
}
main();