import GLTFLoader from "./GLTFLoader.js";
import { OrbitControls } from "./OrbitControls.js";
import * as THREE from "./three.module.js";

(function () {
  var container, stats, mixer;

  var camera, scene, renderer, controls, animations, action, path;

  var myOBJ = null;

  var mouseX = 0,
    mouseY = 0;

  var animationBtnField = document.getElementById("animationBtnField");

  var windowHalfX = document.getElementById("container").offsetWidth / 2;

  var windowHalfY = (window.innerHeight - document.getElementById("top").offsetHeight) / 2;

  var isUpward = true;

  var FLUFF_OBJ_NUM = 100;

  var clock = new THREE.Clock();

  // set model path
  var path = "";
  var animalBtn = document.getElementsByClassName("animalBtn");
  
  for (var i = 0; i < animalBtn.length; i++) {
    animalBtn[i].addEventListener("click", function() {
      path = this.id;

      removeElement();
      init(path);
      animate();
    });
 }

  function init(path) {
    const container = document.getElementById("container");

    let containerDimensions = container.getBoundingClientRect();

    camera = new THREE.PerspectiveCamera(
      45,
      document.getElementById("container").offsetWidth / (window.innerHeight - document.getElementById("top").offsetHeight),
      1,
      2000
    );

    //camera
    camera.position.z = 120;
    camera.position.y = 100;
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //renderer
    renderer = new THREE.WebGLRenderer({ antialias: true , canvas: modelCanvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(document.getElementById("container").offsetWidth, (window.innerHeight - document.getElementById("top").offsetHeight));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    // controls
    controls = new OrbitControls(camera, renderer.domElement);

    // scene
    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0xd0caca);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // instantiate a loader
    var loader = new GLTFLoader.GLTFLoader();

    // Load a glTF resource
    loader.load(
      // resource URL
      path,
      // called when the resource is loaded
      function (gltf) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        animations = gltf.animations;
        if (animations.length != 0)
        {
          action = mixer.clipAction(animations[0]);

          console.log(action);
  
          action.play();
        }
        
        scene.add(gltf.scene);

        // add animation button
        createAnimationButton();

        gltf.animations; // Array<THREE.AnimationClip>
        myOBJ = gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

        myOBJ.rotation.x = 15;

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
  
  // remove animation button for creating new one
  function removeElement()
  {
    if ( $('#animationBtnField').children().length > 0 ) 
    {
      var node = document.getElementById("animationBtnField");
      var node_length = $('#animationBtnField').children().length;
      for(var i = 0; i < node_length; i++)
      {
        node.removeChild(node.childNodes[0]); 
      }
    }
  } 

})();