import * as THREE from './build/three.module.js';
import {GLTFLoader}	from './examples/jsm/loaders/GLTFLoader.js';
console.log("three-funds-import");
//todo: import obj files at all
//UH OH OBJ FILES ARE JUNK
//todo: import serialized data format
//done
//todo: scenegraph model into a sensible data structure
//parsed, done
//	todo: ingest aml-60, correctly parent each model to each other
//tweaked aml-60, switching to aml-60-mkII
//oh no the tires have no interior face
//"patched" that particular issue, aren't I a card
//switching to aml-60-mkIII


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
	camera.position.set(0, 3, -4);
	camera.up.set(0, 0, 1);	//no joke, the camera has to be told which direction is "up", instead of the default pos-y axis
	camera.lookAt(0, 0, 0);	//using the look-at func, which uhh, does what you would think it would do I suppose
	
	//scene block
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xAAAABB);
	
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

/*	output:
	Scene ->Group<-
 🤮sus ->Object3D<-
  🤢wheels ->Object3D<-
  | 🤢wheel-F-L ->Mesh<-
  | 🤢wheel-F-R ->Mesh<-
  | 🤢wheel-R-L ->Mesh<-
  | 🤮wheel-R-R ->Mesh<-
  🤮body ->Mesh<-
   🤮turrent ->Mesh<-
    🤮manlet ->Mesh<-
 */
	let armcarposition = new THREE.Vector3();
	const armcars = [];
	const wheels = [];
	const turrents = [];
	const manlets = [];
	
	{	//GLTFLoader trial, deprecated
		const gltfLoader = new GLTFLoader();
		const url = 'threejs/models/AML/AML-60-mkIII.glb';
		gltfLoader.load(url, (gltf) => {
		const root = gltf.scene;
		scene.add(root);	
		armcars.push(root);
		console.log(`name of ${root.name} and ${root.children.length} unexplored depth`);
		console.log(dumper(root).join('\n'));
		
		wheels.push(root.getObjectByName('wheels'));
		turrents.push(root.getObjectByName('turrent'));
		manlets.push(root.getObjectByName('manlet'));
		});
		
	}
	
		
	//this is just our basic baby light to give sense of space, offset from center
	const licolor = 0xFFFFFF;
	const liintensity = .7;
	const light = new THREE.DirectionalLight(licolor, liintensity);
	light.position.set(1,2,-5);	//lights default to a target of 0,0,0; moving its position preserves its target
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
	armcars.forEach((obj) => {
		obj.position.x = Math.sin(time);
		obj.position.z = Math.cos(time);
		
		//armcarposition.x = obj.position.x;		//produces weird tilt
		//armcarposition.y = obj.position.x;		//horizontal tracking
		armcarposition.z = obj.position.z;			//tracks object up/down but seems to also zoome a bitte

	});
	
	turrents.forEach((obj)	=>	{	//y governs traverse
		obj.rotation.y = time/3;	
		
	});
	
	manlets.forEach((obj) => {
		obj.rotation.y = Math.sin(time);

	});
	
	wheels.forEach((obj)	=> {
		obj.children.forEach((wheel) => {
			wheel.rotation.z=-time;
		});

	});
		
	camera.lookAt(armcarposition);
	
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
	//render invocation
	requestAnimationFrame(render);
}
main();