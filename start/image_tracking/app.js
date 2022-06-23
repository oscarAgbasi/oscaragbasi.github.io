import * as THREE from '../../libs/three/three.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';
import { ARButton } from '../../libs/ARButton.js';

class App{
	constructor(){
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
		
		this.setupXR();
		container.appendChild( this.renderer.domElement );
        window.addEventListener('resize', this.resize.bind(this) );
	}	
	
	async setupXR(){
		this.renderer.xr.enabled = true;
		const self = this;

		// Ensure the image is loaded and ready for use
		self.img.src = './image/070_albumcover.jpg';
		console.log(self.img);
		const imgBitmap = await createImageBitmap(self.img);

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

		const btn = new ARButton( this.renderer , { 
			requiredFeatures: [ 'image-tracking' ],
				trackedImages: [
					{
						image: imgBitmap,
						widthInMeters: 0.2
					}
				]
		});

		console.log('btn');
		alert(btn)

		this.renderer.setAnimationLoop( this.render.bind(this) );
	}

	resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
		const dt = this.clock.getDelta();
		
    }
}

export { App };