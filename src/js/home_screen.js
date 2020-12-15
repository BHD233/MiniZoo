import GLTFLoader from "./GLTFLoader.js";
import { OrbitControls } from "./OrbitControls.js";
import * as THREE from "./three.module.js";

(function () {
  var container, stats, mixer;
  var buttonField = document.getElementById("button_field");

  var camera, scene, renderer, controls, animations, curAnimation, action;

  var myOBJ = null;

  var mouseX = 0,
    mouseY = 0;

  var windowHalfX = window.innerWidth / 2;

  var windowHalfY = window.innerHeight / 2;

  var isUpward = true;

  var FLUFF_OBJ_NUM = 100;

  var clock = new THREE.Clock();
  init();

  animate();

  function init() {
    // const container = document.getElementById("-container-canvas");
    const container = document.getElementById("container");

    let containerDimensions = container.getBoundingClientRect();

    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );

    //camera
    camera.position.z = 120;
    camera.position.y = 100;
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(containerDimensions.width, containerDimensions.height);
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
      "./model/bee.glb",
      // called when the resource is loaded
      function (gltf) {
        //load animation
        mixer = new THREE.AnimationMixer(gltf.scene);
        animations = gltf.animations;
        action = mixer.clipAction(animations[0]);

        console.log(action);

        action.play();
        scene.add(gltf.scene);

        //add animation option
        addAnimationButton();

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

  function addAnimationButton() {
    for (var i = 0; i < animations.length; i++) {
      var button = document.createElement("button");
      button.innerHTML = "animation " + i;
      button.id = i;

      button.addEventListener("click", function () {
        console.log(this.id);
        mixer = new THREE.AnimationMixer(scene);
        action = mixer.clipAction(animations[this.id]);
        action.play();
      });

      buttonField.appendChild(button);
    }
  }
})();
