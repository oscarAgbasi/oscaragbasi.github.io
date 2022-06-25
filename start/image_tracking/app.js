import * as THREE from '../../libs/three/three.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';
import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";

class App{
	constructor(){
		console.log('const')
		const container = document.createElement( 'div' );
		const light = new THREE.DirectionalLight( 0xffffff );
		document.body.appendChild( container );
		
		this.img = document.createElement("img");
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		//creating camera and seting the postion
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
        this.camera.position.set( 0, 0, 4 );
		
        
        this.scene.add(this.camera);
       
		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

		
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );

		
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
		
		console.log('be4 setupXR');
		this.setupXR();
		container.appendChild( this.renderer.domElement );
        window.addEventListener('resize', this.resize.bind(this) );
	}	
	
	async setupXR(){
		console.log('inside XR');
		this.renderer.xr.enabled = true;
		const self = this;

		// Ensure the image is loaded and ready for use
		self.img.src = './image/070_albumcover.JPG';
		console.log(self.img);
		const imgBitmap = await createImageBitmap(self.img);

		this.renderer.xr.addEventListener( 'sessionstart', async () => {
			const session = this.renderer.xr.getSession();
			console.log('session');
			const scores = await session.getTrackedImageScores();
			let trackableImages = 0;
		
			for ( let index = 0; index < scores.length; ++ index ) {
		
				if ( scores[ index ] == 'untrackable' ) {
		
					MarkImageUntrackable( index );
		
				} else {
		
					++ trackableImages;
		
				}
		
			}
		
			if ( trackableImages == 0 ) {
		
				WarnUser( "No trackable images" );
		
			}
			
		} );

		// const button = ARButton.createButton(this.renderer, {
		// 	requiredFeatures: [ 'image-tracking' ],
		// 	trackedImages: [
		// 		{
		// 			image: imgBitmap,
		// 			widthInMeters: 0.2
		// 		}
		// 	]
		// 	 // notice a new required feature
		// });
        const button = ARButton.createButton(this.renderer, {
			requiredFeatures: ["hit-test"] // notice a new required feature
		  });
		console.log('btn');
		document.body.appendChild(button);
		this.renderer.domElement.style.display = "none";

		this.renderer.xr.addEventListener( 'sessionstart', async () => {

			const session = this.renderer.xr.getSession();
			console.log('session');
			console.dir(session);
		
			const scores = await session.getTrackedImageScores();
		
			let trackableImages = 0;
		
			for ( let index = 0; index < scores.length; ++ index ) {
		
				if ( scores[ index ] == 'untrackable' ) {
		
					MarkImageUntrackable( index );
		
				} else {
		
					++ trackableImages;
		
				}
		
			}
		
			if ( trackableImages == 0 ) {
		
				WarnUser( "No trackable images" );
		
			}
			
		} );
		this.renderer.setAnimationLoop( this.render.bind(this) );
	}

	resize(){
		console.log('resize');
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( timestamp, frame ) {   
		// const dt = this.clock.getDelta();
		if ( frame ) {

			const results = frame.getImageTrackingResults();
			
			for ( const result of results ) {
			
				// The result's index is the image's position in the trackedImages array specified at session creation
				const imageIndex = result.index;
	
				// Get the pose of the image relative to a reference space.
				const pose = frame.getPose( result.imageSpace, referenceSpace );
	
				const state = result.trackingState;
	
				if ( state == "tracked" ) {
				
					HighlightImage( imageIndex, pose );
					
				} else if ( state == "emulated" ) {
				
					FadeImage( imageIndex, pose );
					
				}
				
			}
	
		}
	
		this.renderer.render( this.scene, this.camera );	
		
    }
}

export { App };