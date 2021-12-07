import React, { Component } from 'react';
import * as THREE from 'three/build/three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CameraControls from 'camera-controls';
import './index.less';

export default class modelParts extends Component {
  constructor(props) {
    super(props);
    // renderer
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.canvas = null;
    this.cameraControls = null;
  }

  // 初始化
  initScene = () => {
    // 相机
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.canvas.offsetWidth / this.canvas.offsetHeight,
      0.01,
      10000,
    );

    this.camera.position.set(0, 0, 200);
    CameraControls.install({ THREE: THREE });

    this.cameraControls = new CameraControls(this.camera, this.canvas);
    // 禁用鼠标滚轮缩放

    this.cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;
    this.cameraControls.maxZoom = 0;
    // 场景
    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('/static/knife/img/');
    //六张图片分别是朝前的（posz）、朝后的（negz）、朝上的（posy）、朝下的（negy）、朝右的（posx）和朝左的（negx）。
    var cubeTexture = cubeTextureLoader.load([
      'px.jpg',
      'nx.jpg',
      'py.jpg',
      'ny.jpg',
      'pz.jpg',
      'nz.jpg',
    ]);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0x6e6c6c));
    this.scene.background = cubeTexture;

    // 灯光
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(20, -20, 30);
    this.scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff); //括号内传入指定颜色
    ambientLight.position.set(0, 0, 10);
    this.scene.add(ambientLight);
    // 辅助线
    //X轴是红色. Y轴是绿色. Z轴是蓝色
    const object = new THREE.AxesHelper(10);
    this.scene.add(object);
    // 渲染场景
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.canvas.appendChild(this.renderer.domElement);
    // 加载模型
    this.loadModel().then((cube) => {
      this.scene.add(cube.scene);
    });

    const that = this;
    const clock = new THREE.Clock();
    function animate() {
      const delta = clock.getDelta();
      const hasControlsUpdated = that.cameraControls.update(delta);
      requestAnimationFrame(animate);
      if (hasControlsUpdated) {
        that.renderer && that.renderer.render(that.scene, that.camera);
      }
    }
    animate();
  };

  // 加载模型
  loadModel = () => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      try {
        loader.load('/static/knife/scene.gltf', (obj) => {
          resolve(obj);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // 挂载
  componentDidMount() {
    this.initScene();
    this.cameraControls.rotate(40 * THREE.MathUtils.DEG2RAD, 0, true);
    this.cameraControls.dolly(150, true);
  }

  // 卸载
  componentWillUnmount() {
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.canvas = null;
    this.cameraControls.dispose();
  }

  render() {
    return (
      <>
        <div
          className="modelParts"
          id="modelParts"
          ref={(c) => (this.canvas = c)}
        ></div>
      </>
    );
  }
}
