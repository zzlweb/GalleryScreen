import React, { Component } from 'react';
import * as THREE from 'three/build/three';
const {
  OrbitControls,
} = require('three/examples/jsm/controls/OrbitControls.js');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');
const {
  CSS2DObject,
  CSS2DRenderer,
} = require('three/examples/jsm/renderers/CSS2DRenderer.js');
import CameraControls from 'camera-controls';
import throttle from 'lodash';
import { handleResize, onTransitionMouseXYZ } from '@/utils/ThreeUtils';

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
    this.labelRenderer = null;
    // 一个存储标点实例对象模型的数组（给标点添加事件时有用）
    this.objArr = [];
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
    this.cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
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
    // const object = new THREE.AxesHelper(10);
    // this.scene.add(object);
    // 渲染场景
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(
      this.canvas.offsetWidth,
      this.canvas.offsetHeight,
    );
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.canvas.appendChild(this.labelRenderer.domElement);

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
        that.labelRenderer &&
          that.labelRenderer.render(that.scene, that.camera);
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

  // 添加标点
  addPoints = () => {
    // 利用纹理加载器，加载一个图片，用来做标点的样式
    const map = new THREE.TextureLoader().load('/image/number-one.svg');

    // 利用这个图片创建一个精灵图材质（无论在哪个视角看，精灵图材质的模型都是面向我们的），sizeAttenuation属性是让模型不随视图内容的缩小放大而缩小放大
    const spriteMaterial = new THREE.SpriteMaterial({
      map: map,
      sizeAttenuation: false,
    });

    // 创建第二个精灵图材质，depthTest是让这个模型被其它模型遮挡仍然能被看见（默认被遮住时不能透过模型被看见），opacity设置透明度（为什么要弄两个材质？为了让标点被遮住时有被遮住的效果）
    const spriteMaterial2 = new THREE.SpriteMaterial({
      map: map,
      sizeAttenuation: false,
      depthTest: false,
      opacity: 0.2,
    });

    // 创建精灵图模型实例的函数
    function createMarker(m) {
      return new THREE.Sprite(m);
    }

    const that = this;

    // 创建一个标点的函数
    function createMarkerCon() {
      // 第一个精灵图模型
      let sprite1 = createMarker(spriteMaterial);
      // 第二个精灵图模型
      let sprite2 = createMarker(spriteMaterial2);
      // 第一个精灵图模型 把 第二个精灵图模型 添加为子模型
      sprite1.add(sprite2);
      // 设置精灵图模型的尺寸缩放
      sprite1.scale.set(0.04, 0.04, 0.04);
      // 设置精灵图模型初始位置
      sprite1.position.set(12, 2, 0);
      // 因为场景里不可能只有标点，所以要对精灵图模型添加特异性字段进行区分
      sprite1.isMarker = true;
      // 把第一个精灵图模型添加到场景
      that.scene.add(sprite1);
      // 把标点（第一个精灵图模型）添加到objArr
      that.objArr.push(sprite1);
    }
    // 创建一个标点
    createMarkerCon();
  };
  // https://www.cnblogs.com/lst619247/p/9071233.html
  // 处理标点的点击事件
  handelPointClick = () => {
    // 创建一个射线实例对象
    let raycaster = new THREE.Raycaster();

    // 创建一个二维空间点的对象（x,y），在进行将鼠标位置归一化为设备坐标时（x 和 y 方向的取值范围是 (-1 to +1)）有用
    let mouse = new THREE.Vector2();

    // 存储 鼠标按下时的二维空间点
    let onDownPosition = new THREE.Vector2();

    // 鼠标按键按下时触发的事件
    let onPointerdown = (event) => {
      onDownPosition.x = event.clientX;
      onDownPosition.y = event.clientY;

      onClick(event);
    };

    // 点击事件（在onPointerup函数里调用）
    let onClick = (event) => {
      // 通过 Utils.onTransitionMouseXYZ 函数把将鼠标位置归一化为设备坐标（实现细节请直接看Utils工具类）
      if (!this.canvas) {
        return;
      }

      let mouse = onTransitionMouseXYZ(event, this.canvas);

      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, this.camera);

      // 计算模型和射线的焦点（objArr就是之前存储标点模型的数组）
      let intersects = raycaster.intersectObjects(this.objArr);
      // 如果有相交的标点模型，就做一些事情，比如显示弹窗（这不是threejs的内容，不进行介绍，要在html里面加一个弹窗元素，直接看代码即可）
      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.isMarker) {
          // 弹窗内容
          let InfoDiv = document.createElement('div');
          let InfoLabel = new CSS2DObject(InfoDiv);
          InfoDiv.className = 'info';
          InfoDiv.textContent = '刀尖部位';
          InfoDiv.style.marginTop = '-1em';
          InfoLabel.position.set(13, 3, 0);
          this.scene.add(InfoLabel);
          this.cameraControls.lerpLookAt(
            0,
            0,
            200,
            0,
            0,
            0,
            50,
            0,
            0,
            0,
            0,
            0,
            1,
            true,
          );
        }
      } else {
        // 删除存在的Info
        const Info = document.querySelectorAll('.info');
        if (Info) {
          Info.forEach((item) => {
            item.classList.add('none');
          });
        }
        this.camera.updateProjectionMatrix();
      }
    };
    // 添加事件委托
    window.addEventListener('pointerdown', onPointerdown, false);
  };

  // 挂载
  componentDidMount() {
    const that = this;
    // 初始化场景
    this.initScene();
    // 创建标点
    this.addPoints();
    // 鼠标点击
    this.handelPointClick();

    this.cameraControls.rotate(40 * THREE.MathUtils.DEG2RAD, 0, true);
    this.cameraControls.dolly(150, true);

    window.addEventListener('resize', () => {
      that.scene &&
        throttle(handleResize('.modelParts', that.renderer, that.camera), 100);
    });
  }

  // 卸载
  componentWillUnmount() {
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.canvas = null;
    this.cameraControls.dispose();
    this.labelRenderer = null;
    window.removeEventListener('resize', () => {});
    window.removeEventListener('pointerdown', () => {});
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
