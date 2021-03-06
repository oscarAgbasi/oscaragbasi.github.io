import * as THREE from '../../libs/three/three.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';
import { ARButton } from '../../libs/three/jsm/ARButton.js';
import { GLTFLoader } from '../../libs/three/jsm/GLTFLoader.js';

class App{
	constructor(){
        const container = document.createElement( 'div' );
        document.body.appendChild( container );

        //creating a scene
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        //this.scene.background = new THREE.Color('#050505');

        //creating camera and seting the postion
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
        this.camera.position.set( 0, 0, 4 );
        
        //creating a renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.xr.enabled = true;
        container.appendChild( this.renderer.domElement );

        //ceate a light 
        const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        ambient.position.set( 0.5, 1, 0.25 );
        //adding light to the scene
        this.scene.add(ambient);        

        //creating a geometry
        // const geometry = new THREE.BoxGeometry(0.3,0.3,0.3);
        // const material = new THREE.MeshStandardMaterial( { color: 0xFF0000 });
        // this.mesh = new THREE.Mesh( geometry, material );
        // //this.scene.add(this.mesh);
        // this.mesh.position.z = -1;
        this.loadGlft(this);
        // Controller
        //this.controller = this.renderer.xr.getController(0);

        document.body.appendChild( ARButton.createButton (this.renderer) );
        this.renderer.setAnimationLoop(this.render.bind(this));
        window.addEventListener('resize', this.resize.bind(this),false );
    }	

    setupXR() {

    }
    
    loadGlft() {
        console.log('Inside function');
        //Load maxiamo object
        const loader = new GLTFLoader();
        const self = this;
        loader.load('models/070_shake.glb', function ( gltf ) {
            let model = gltf.scene;
            let mixer = new THREE.AnimationMixer(model);
            const animations = gltf.animations;
            // Play a specific animation
            const clip = THREE.AnimationClip.findByName( animations, "CubeAction" );
            const action = mixer.clipAction( clip );
            action.play();
            model.position.z = -4;
            self.scene.add( model );
        }, undefined, function (err) {
           console.dir(err);
        });
    }
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render() {
        this.clock.getDelta();
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };