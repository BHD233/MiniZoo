import GLTFLoader from "./GLTFLoader.js";
import { OrbitControls } from "./OrbitControls.js";
import * as THREE from "./three.module.js";

(function () {
  var mixer;

  var camera, scene, renderer, controls, animations, action, path;

  var myOBJ = null;

  var animationBtnField = document.getElementById("animationBtnField");
  var top = document.getElementById("top");

  var FLUFF_OBJ_NUM = 100;

  var clock = new THREE.Clock();

  // set model path
  var path = "";
  var animalBtn = document.getElementsByClassName("animalBtn");
  
  for (var i = 0; i < animalBtn.length; i++) {
    animalBtn[i].addEventListener("click", function() {
      path = this.id;

      removeElement();

      // create model name
      var div_model = document.createElement("div");
      div_model.id = "div_model";
      div_model.innerHTML = "Viewing: " + path.slice(8,-4);
      top.appendChild(div_model);

      init(path);
      animate();
    });
 }

  function init(path) {
    const container = document.getElementById("container");

    //renderer
    renderer = new THREE.WebGLRenderer({ antialias: true , canvas: modelCanvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(document.getElementById("container").offsetWidth, (window.innerHeight - document.getElementById("top").offsetHeight));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    //camera
    camera = new THREE.PerspectiveCamera(
      45,
      document.getElementById("container").offsetWidth / (window.innerHeight - document.getElementById("top").offsetHeight),
      1,
      2000
    );

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x666666);

    //camera
    if (path == "./model/bee.glb") {
        camera.position.z = 120;
        camera.position.y = 90
    } else {
        camera.position.z = 4;
        camera.position.y = 3;
    }
    camera.up = new THREE.Vector3(0, 0, -1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // controls
    controls = new OrbitControls(camera, renderer.domElement);

    //light
    var ambient = new THREE.AmbientLight(0xd0caca);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(150, 50, 100);

    //set shadow
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 1500;
    directionalLight.shadow.camera.left = 15 * -1;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = 15 * -1;

    scene.add(directionalLight);

    // instantiate a loader
    var loader = new GLTFLoader.GLTFLoader();

    // Load a glTF resource
    loader.load(
      // resource URL
      path,
      // called when the resource is loaded
      function (gltf) {
        //load animation
        mixer = new THREE.AnimationMixer(gltf.scene);
        animations = gltf.animations;
        if (animations.length != 0)
        {
          action = mixer.clipAction(animations[0]);

          action.play();
        }
        
        //get object and make it cast shadow
        gltf.scene.traverse(function(child) {
            if(child instanceof THREE.Mesh)
            {
               //child.material.wireframe = true;
               child.castShadow = true;
               child.receiveShadow = true;
               child.position.y = 0;
               //child.flatShading = THREE.SmoothShading;
            }
        });

        scene.add(gltf.scene);

        // add animation button
        createAnimationButton();

        //all atribute of gltf
        gltf.animations; // Array<THREE.AnimationClip>
        myOBJ = gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

        render();
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log(error);
      }
    );

    //create floor to receive shadow

    let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    let floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        shininess: 0,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = 0;
    scene.add(floor);

  }

  var render = function () {
    renderer.render(scene, camera);
  };

  function animate() {
    if (mixer) mixer.update(clock.getDelta());
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  }

// create animation button
  function createAnimationButton() {
    if (animations.length == 0)
    {
      var div = document.createElement("div");
      div.innerHTML = "This model has no Animation.";
      div.id = "div_tip";

      animationBtnField.appendChild(div);
    }
   for (var i = 0; i < animations.length; i++) {
     var button = document.createElement("button");
     button.innerHTML = "Animation " + (i + 1);
     button.id = i;
     button.className = "animationBtn";

     button.addEventListener("click", function () {
       console.log(this.id);
       mixer = new THREE.AnimationMixer(scene);
       action = mixer.clipAction(animations[this.id]);
       action.play();
     });

     animationBtnField.appendChild(button);
   }
 }

  // responsive canvas
  $(window).resize(function() {
    removeElement();
    init(path);
  });
  
  // remove animation button and div_model
  function removeElement()
  {
    // remove animation button
    var node = document.getElementById("animationBtnField");
    var node_length = $('#animationBtnField').children().length;
    if ( node_length > 0 ) 
    {
      for(var i = 0; i < node_length; i++)
      {
        node.removeChild(node.childNodes[0]); 
      }
    }

    // remove div_model
    var div = document.getElementById("div_model");
    var div_length = $('#top').children().length;
    if ( div_length > 1 )
    {
        div.parentNode.removeChild(div);
    }
  } 

})();