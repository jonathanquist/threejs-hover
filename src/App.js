import { useEffect } from "react";
import "./App.css";

import img0 from "./img/img0.png";
import img1 from "./img/img1.png";
import img2 from "./img/img2.png";
import img3 from "./img/img3.png";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import gsap from "gsap";

function App() {
  useEffect(() => {
    //Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // Debug
    const gui = new dat.GUI();

    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    // Scene

    let scene = null;
    if (!scene) {
      scene = new THREE.Scene();
    }
    console.log(scene);

    const geometry = new THREE.PlaneGeometry(2, 1);

    const imgArr = [img0, img1, img2, img3];

    for (let i = 0; i < 4; i++) {
      const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(imgArr[i]),
      });
      const img = new THREE.Mesh(geometry, material);
      // console.log(img.position);
      img.position.set(Math.random() + 0.9, -i * 1.3);

      scene.add(img);
    }

    let objs = [];

    scene.traverse((object) => {
      if (object.isMesh) {
        objs.push(object);
      }
    });

    // Lights

    const pointLight = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2;
    scene.add(camera);

    gui.add(camera.position, "y").min(-1).max(1);

    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Mouse
    window.addEventListener("wheel", onMouseWheel);

    let y = 0;
    let position = 0;

    function onMouseWheel(event) {
      y = event.deltaY * 0.0007;
    }

    const mouse = new THREE.Vector2();

    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / sizes.width) * 2 - 1;
      mouse.y = -(event.clientY / sizes.height) * 2 + 1;
    });

    /**
     * Animate
     */
    const raycaster = new THREE.Raycaster();

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update objects
      position -= y;
      y *= 0.9;

      //Raycaster

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(objs);

      for (const intersect of intersects) {
        //console.log("intersected");
        gsap.to(intersect.object.scale, { x: 1.3, y: 1.3 });
        gsap.to(intersect.object.rotation, { y: -0.5 });
        gsap.to(intersect.object.position, { z: -0.9 });
      }

      for (const object of objs) {
        if (!intersects.find((intersect) => intersect.object === object)) {
          //console.log("test");
          object.scale.set(1, 1);
          gsap.to(object.scale, { x: 1, y: 1 });
          gsap.to(object.rotation, { y: 0 });
          gsap.to(object.position, { z: 0 });
        }
      }

      camera.position.y = position;

      // Update Orbital Controls
      // controls.update()

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return (
    <div className="content">
      <h1>My Steam Library</h1>
      <canvas className="webgl"></canvas>
    </div>
  );
}

export default App;
