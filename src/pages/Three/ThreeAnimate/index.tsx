import React, { Component } from 'react';
import * as THREE from 'three/build/three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
export default class Three_3D extends Component {
  initThree() {
    threeStart();

    let container, stats, controls;
    let camera, scene, renderer, light;
    let width, height;
    // 坐标系辅助
    let axes;
    // 物体
    let cube;
    // 点光源
    let point, point2;

    // 初始化材质
    let InitPart = {
      chuang: { color: 0xffffff, opacity: 0.9, old_opacity: 1 },
      screen: { color: 0x000000, opacity: 1, old_opacity: 1 },
      ke: { color: 0xffffff, opacity: 1, old_opacity: 1 },
      citi: { color: 0x000000, opacity: 1, old_opacity: 1 },
      estop: { color: 0xff0000, opacity: 1, old_opacity: 1 },
      chuangzuo: { color: 0xcccccc, opacity: 1, old_opacity: 1 },
      he: { color: 0xb1e1ff, opacity: 1, old_opacity: 1 },
    };

    // 获取当前时间
    let t0 = new Date();

    // 材质集合
    let INITIAL_MAP = [];

    // 定时器Timer
    let Timer;

    // 相机辅助
    let cameraHelper;

    // 材质导入
    for (var key in InitPart) {
      INITIAL_MAP.push({
        childID: key,
        mtl: new THREE.MeshPhongMaterial({
          color: InitPart[key].color,
          shininess: 10,
          opacity: InitPart[key].opacity,
          transparent: true,
        }),
      });
    }

    // 流程
    function threeStart() {
      init();
      render();
      loadGLTF('/static/ct/MR08.glb');
      animation();
      animateView();
    }

    // 渲染
    function render() {
      renderer.render(scene, camera);
    }

    // 基本动画
    function animation() {
      //更新控制器
      controls.update();
      render();
      let t1 = new Date(); //本次时间
      let t = t1 - t0; // 时间差
      t0 = t1; //把本次时间赋值给上次时间
      TWEEN.update();
      //更新性能插件
      stats.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animation);
      if (!cube) {
        return;
      }
      // cube.rotateY(0.0002 * t); //旋转角速度0.001弧度每毫秒
    }

    // 切换视角动画
    function animateView() {
      // oldP  相机原来的位置
      // oldT  target原来的位置
      // newP  相机新的位置
      // newT  target新的位置
      // callBack  动画结束时的回调函数
      if (Timer) {
        clearInterval(Timer);
      }

      // 动画执行队列
      const animateFunc = async () => {
        await animateCamera(
          { x: 0, y: 10, z: 50 },
          { x: 0, y: 0, z: 0 },
          { x: 50, y: 0, z: 10 },
          { x: 10, y: 0, z: 5 },
          6000,
        );

        await animateCamera(
          { x: 50, y: 0, z: 10 },
          { x: 10, y: 0, z: 5 },
          { x: 0, y: 10, z: -50 },
          { x: 0, y: 0, z: 0 },
          4000,
        );

        await animateCamera(
          { x: 0, y: 10, z: -50 },
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 1.5, z: -10 },
          { x: 0, y: 0, z: 0 },
          4000,
        );

        await animateCamera(
          { x: 0, y: 1.5, z: -10 },
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 1.2, z: 5 },
          { x: 0, y: 0, z: 1 },
          2500,
        );

        await animateCamera(
          { x: 0, y: 1.2, z: 5 },
          { x: 0, y: 0, z: 1 },
          { x: 0, y: -1, z: 10 },
          { x: -1, y: 0, z: -1 },
          2000,
        );

        await animateCamera(
          { x: 0, y: -1, z: 10 },
          { x: -1, y: 0, z: -1 },
          { x: 0, y: 10, z: 50 },
          { x: 0, y: 0, z: 0 },
          4000,
        );

        await animateCamera(
          { x: 0, y: 10, z: 50 },
          { x: 0, y: 0, z: 0 },
          { x: 15, y: 30, z: -10 },
          { x: 0, y: 0, z: 0 },
          4000,
        );

        await animateCamera(
          { x: 15, y: 30, z: -10 },
          { x: 0, y: 0, z: 0 },
          { x: 15, y: 0, z: -5 },
          { x: 0, y: 0, z: 0 },
          4000,
        );

        await animateCamera(
          { x: 15, y: 0, z: -5 },
          { x: 0, y: 0, z: 0 },
          { x: -15, y: 15, z: -20 },
          { x: 0, y: 0, z: 0 },
          4000,
        );
      };

      animateFunc();

      var Timer = setInterval(animateFunc, 40000);
    }

    // 构建
    function init() {
      container = document.getElementById('canvas-frame');
      width = container.offsetWidth;
      height = container.offsetHeight;

      //性能插件
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px'; // (0,0)px,左上角
      stats.domElement.style.top = '0px';
      stats.domElement.style.ZIndex = '1';
      container.appendChild(stats.domElement);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      renderer.shadowMapEnabled = true;
      renderer.setSize(width, height);
      renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
      renderer.setPixelRatio(window.devicePixelRatio);
      // renderer.shadowMap.enabled = true;
      // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);

      //场景
      scene = new THREE.Scene();

      //相机
      camera = new THREE.PerspectiveCamera(50, width / height, 1, 5000);
      camera.position.set(0, 10, 50); //设置相机位置
      // cameraHelper = new THREE.CameraHelper( camera );
      // scene.add( cameraHelper );
      camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
      //环境光源
      light = new THREE.HemisphereLight(0xffffff, 0.6);
      light.position.set(20, 20, 0);
      scene.add(light);
      const hemiLightHelper = new THREE.HemisphereLightHelper(light, 10);

      var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
      dirLight.position.set(0, 50, 0);
      dirLight.castShadow = true;
      dirLight.position.multiplyScalar(30);
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.left = -5;
      dirLight.shadow.camera.right = 5;
      dirLight.shadow.camera.top = 5;
      dirLight.shadow.camera.bottom = -5;
      dirLight.shadow.camera.far = 500;
      dirLight.shadow.near = 0.5;

      scene.add(dirLight);
      const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
      // scene.add(dirLightHelper);

      //创建一个平面几何体作为投影面
      var floorGeometry = new THREE.PlaneGeometry(500, 500, 1, 1);
      var floorMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 0.3,
        transparent: true,
      });

      // 平面网格模型作为投影面
      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -0.5 * Math.PI;
      floor.receiveShadow = true;
      floor.position.y = -60;
      scene.add(floor);

      //相机控件
      controls = new OrbitControls(camera, renderer.domElement);
      // controls.addEventListener("change", render);
      // controls.minDistance = 2;
      // controls.maxDistance = 10;
      // controls.update();
      controls.enableZoom = false;

      // to disable rotation
      controls.enableRotate = true;

      // to disable pan
      controls.enablePan = false;

      // 拖拽惯性
      controls.enableDamping = true;

      //动态阻尼系数 就是鼠标拖拽旋转灵敏度
      controls.dampingFactor = 0.25;

      // controls.autoRotate = true;

      // 辅助坐标系
      axes = new THREE.AxesHelper(50);

      scene.add(axes);
    }

    // 模型加载
    function loadGLTF(path) {
      var loader = new GLTFLoader();
      loader.load(path, function (gltf) {
        cube = gltf.scene;
        // 设置需要产生阴影的mesh
        cube.castShadow = true;
        cube.receiveShadow = true;

        cube.scale.set(1, 1, 1);

        // 设置初始的材质
        for (let object of INITIAL_MAP) {
          initColor(cube, object.childID, object.mtl);
        }

        // 设置物体居中
        // setModelPosition(cube);
        scene.add(cube);
        render();
      });
    }

    // ==================== 功能函数 ==============================
    // 设置模型居中展示
    function setModelPosition(object) {
      object.updateMatrixWorld();
      // 获得包围盒得min和max
      const box = new THREE.Box3().setFromObject(object);
      // 返回包围盒的宽度，高度，和深度
      const boxSize = box.getSize();
      // 返回包围盒的中心点
      const center = box.getCenter(new THREE.Vector3());
      object.position.x += object.position.x - center.x;
      object.position.y += object.position.y - center.y;
      object.position.z += object.position.z - center.z;
    }

    // 给模型添加材质
    function initColor(parent, type, mtl) {
      parent.traverse((o) => {
        if (o.isMesh) {
          // console.log(o.name)
          if (o.name.includes(type)) {
            // console.log(111111, o, o.name, type)
            o.material = mtl;
            o.nameID = type; // Set a new property to identify this object
          }
        }
      });
    }

    // 页面自适应函数
    function onWindowResize() {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      render();
    }

    // 巡场
    // oldP  相机原来的位置
    // oldT  target原来的位置
    // newP  相机新的位置
    // newT  target新的位置
    // time  巡航时间
    // callBack  动画结束时的回调函数
    function animateCamera(oldP, oldT, newP, newT, time, callBack?) {
      return new Promise((resolve, reject) => {
        var tween = new TWEEN.Tween({
          x1: oldP.x, // 相机x
          y1: oldP.y, // 相机y
          z1: oldP.z, // 相机z
          x2: oldT.x, // 控制点的中心点x
          y2: oldT.y, // 控制点的中心点y
          z2: oldT.z, // 控制点的中心点z
        });
        tween.to(
          {
            x1: newP.x,
            y1: newP.y,
            z1: newP.z,
            x2: newT.x,
            y2: newT.y,
            z2: newT.z,
          },
          time,
        );
        tween.onUpdate(function (object) {
          camera.position.x = object.x1;
          camera.position.y = object.y1;
          camera.position.z = object.z1;
          controls.target.x = object.x2;
          controls.target.y = object.y2;
          controls.target.z = object.z2;
          controls.update();
        });
        tween.onComplete(function () {
          controls.enabled = true;
          callBack && callBack();
          resolve();
        });
        tween.easing(TWEEN.Easing.Cubic.InOut);
        tween.start();
      });
    }

    // 设置材质
    function setMaterial(model, type, mtl) {
      model.traverse((o) => {
        if (o.isMesh && o.nameID != null) {
          if (o.nameID == type) {
            o.material.opacity = mtl;
          }
        }
      });
    }
  }

  /**
   * 开始Three
   */
  componentDidMount() {
    this.initThree();
  }
  render() {
    return <div id="canvas-frame"></div>;
  }
}
