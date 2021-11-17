import React, { Component } from 'react';
import * as THREE from 'three/build/three';
import './index.less';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
export default class Three extends Component {
  initThree = () => {
    let container, controls, floor;
    let camera, scene, renderer;
    let width, height;
    // 坐标系辅助
    let axes;
    // 物体
    let model;
    // 设置模型坐标点位置
    // [坐标,巡视角度（时长）, 巡视半径，转场时间（可选），高亮部位，]
    let views = [
      [[-0.2, 0.5, 0], 5, 2.5, 120],
      [[0.1, 0.52, 0], 8, 2.1, 150, ['yehai']],
      [[0, 0.5, 0], 5, 1.2, 120, ['screen']],
      [[0.1, 0.45, 0], 8, 2.2, 240, ['citi']],
      [[-0.2, 0.4, 0.2], 0, 0.8, 90, ['stop']],
    ];

    // 初始化材质
    let part = {
      chuang: {
        title: '床板',
        color: 0xffffff,
        opacity: 1.0,
        old_opacity: 1.0,
        warning: 0,
        old_warning: 0,
        tag: [0, 1.7, 2.5],
        cuv: [0, 0, 0],
        time: 0,
      },
      screen: {
        title: 'DDP',
        color: 0x000000,
        // map: '/static/model/ddp.png',
        opacity: 1.0,
        old_opacity: 1.0,
        warning: 0,
        old_warning: 0,
        tag: [1.6, 2.5, 0.25],
        cuv: [0, 0, 0],
        time: 0,
      },
      ke: {
        title: '机架外壳',
        color: 0xffffff,
        opacity: 1.0,
        old_opacity: 1.0,
        warning: 0,
        old_warning: 0,
        tag: [0, 3, 0],
        cuv: [0, 0, 0],
        time: 0,
      },
      citi: {
        title: '磁体',
        color: 0x000000,
        opacity: 1.0,
        old_opacity: 1.0,
        warning: 0,
        old_warning: 0,
        tag: [0.8, 2.7, -2],
        cuv: [0, 1, 0],
        time: 32,
      },
      stop: {
        title: '急停按钮',
        color: 0xff0000,
        opacity: 1.0,
        old_opacity: 1.0,
        warning: 0,
        old_warning: 0,
        tag: [-0.5, 1.49, 0.3],
        cuv: [0, 1, 0],
        time: 32,
      },
      zuo: {
        title: '床板底座',
        color: 0xffcccc,
        opacity: 1.0,
        old_opacity: 1.0,
        warning: 0,
        old_warning: 0,
        tag: [0, 0.1, 2.5],
        cuv: [0, 0, 0],
        time: 0,
      },
      yehai: {
        title: '液氦',
        color: 0xb1e1ff,
        opacity: 1.0,
        old_opacity: 1.0,
        warning: 0,
        old_warning: 0,
        tag: [0, 3.6, -2],
        cuv: [0, 0, -1],
        time: 10.5,
      },
      zhijia: {
        title: '床板支架',
        color: 0xffffff,
        opacity: 1.0,
        old_opacity: 1.0,
        warning: 0,
        old_warning: 0,
        tag: [0, 0.8, 2.5],
        cuv: [0, 0, 0],
        time: 0,
      },
    };

    // 灯光设置
    let InItLight = {
      // 环境灯光
      hemisphere: [
        [[0, 15, 0], 0.45, false, 0xffffff],
        [[-8, 10, -8], 0.16, false, 0xffffff],
      ],
      // 方向灯光
      directional: [
        [[-8, 10, 8], 0.44, false, 0xffffff],
        [[8, 2, -8], 0.2, true, 0xffffff],
      ],
    };

    // 获取当前时间
    let t0 = new Date();

    // 材质集合
    let INITIAL_MAP = [];

    // 天空颜色
    let sky_color = 0x000000;
    // 地面颜色
    let floor_color = 0x000000;

    // 相机辅助
    let cameraHelper;

    // 设置相机默认旋转角度值和速度值
    let view_tween_default = 40;
    let view_speed = 0.2;
    let view_pointer = 0;
    let view_time = 0;
    let view_sum_time = 0;
    let pre_view_pointer = 0;

    threeStart();

    // 流程
    function threeStart() {
      init();
      render();
      loadGLTF('/static/MR08.glb');
      animation();
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
      // TWEEN.update();
      animateModel();
      renderer.render(scene, camera);
      requestAnimationFrame(animation);
    }

    // 构建
    function init() {
      container = document.getElementById('WebGL-Five');
      width = container.offsetWidth;
      height = container.offsetHeight;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true,
      });
      renderer.shadowMapEnabled = true;
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // renderer.toneMapping = THREE.ACESFilmicToneMapping;
      // renderer.toneMappingExposure = 1;
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);

      //场景
      scene = new THREE.Scene();
      scene.background = new THREE.Color(sky_color);

      //相机
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 5000);
      camera.position.set(8, 8, 14); //设置相机位置
      camera.lookAt(0, 0, 0); //设置相机方向(指向的场景对象)

      //相机控件
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxDistance = Math.PI;
      controls.minPolarAngle = 0;
      controls.enableZoom = false;
      // to disable rotation
      controls.enableRotate = true;
      // to disable pan
      controls.enablePan = true;
      // 拖拽惯性
      controls.enableDamping = true;
      //动态阻尼系数 就是鼠标拖拽旋转灵敏度
      controls.dampingFactor = 0.05;
      controls.autoRotate = false;
      controls.autoRotateSpeed = -0.5;

      // 添加灯光
      lightSet(InItLight);
      // 设置天空
      initFloor();

      // 初始化ddp
      initDDP();

      // 辅助坐标系
      axes = new THREE.AxesHelper(50);

      // scene.add(axes);
    }

    // 灯光设置
    function lightSet(light) {
      for (var key in light.hemisphere) {
        // Add lights
        var hemiLight = new THREE.HemisphereLight(
          light.hemisphere[key][3],
          0xffffff,
          light.hemisphere[key][1],
        );
        hemiLight.position.set(
          light.hemisphere[key][0][0],
          light.hemisphere[key][0][1],
          light.hemisphere[key][0][2],
        );

        if (light.hemisphere[key][2] == true) {
          hemiLight.castShadow = true;
          hemiLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        }

        // Add hemisphere light to scene
        scene.add(hemiLight);
        var hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 0.5);
        // scene.add(hemiLightHelper);
      }

      let directionalLight = [];
      for (var key in light.directional) {
        // Add lights
        var dirLight = new THREE.DirectionalLight(
          light.hemisphere[key][3],
          light.directional[key][1],
        );
        dirLight.position.set(
          light.directional[key][0][0],
          light.directional[key][0][1],
          light.directional[key][0][2],
        );

        if (light.directional[key][2] == true) {
          dirLight.castShadow = true;
          dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        }

        // Add hemisphere light to scene
        // 添加方向光辅助
        var dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 1);
        // scene.add(dirLightHelper);
        scene.add(dirLight);

        directionalLight.push(dirLight);
      }
    }

    // 天空设置
    function initFloor() {
      var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
      var floorMaterial = new THREE.MeshPhongMaterial({
        color: floor_color,
        shininess: 0,
        // side: THREE.DoubleSide,
      });

      floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -0.5 * Math.PI;
      floor.receiveShadow = true;
      floor.position.y = 0;
      scene.add(floor);
    }

    // 模型加载
    function loadGLTF(path) {
      var loader = new GLTFLoader();
      loader.load(
        path,
        function (gltf) {
          model = gltf.scene;

          model.scale.set(0.08, 0.08, 0.08);

          model.rotation.y = Math.PI;

          model.traverse((o) => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });

          // Add the model to the scene
          scene.add(model);
          initMeterial();
        },
        undefined,
        function (error) {
          //console.error(error)
        },
      );
    }

    function initMeterial() {
      // 材质导入
      for (var key in part) {
        INITIAL_MAP.push({
          childID: key,
          mtl: new THREE.MeshPhongMaterial({
            color: part[key].color,
            shininess: 10,
            opacity: part[key].opacity,
            transparent: true,
            // side: THREE.DoubleSide
          }),
        });
      }

      // 设置初始的材质
      for (let object of INITIAL_MAP) {
        initColor(model, object.childID, object.mtl);
      }
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

    // 设置ddp
    function initDDP() {
      var ddp = [
        [0.31, 0.47, 0.005],
        [-0.3, 0.47, 0.005],
      ];
      var DDP = new THREE.BoxGeometry(0.15, 0.07, 0.01); //盒子模型
      for (var i = 0; i < ddp.length; i++) {
        var material = new THREE.MeshPhongMaterial({
          color: 'gray',
          shininess: 10,
          map: THREE.ImageUtils.loadTexture('/static/ddp.png'),
        }); //材料
        var mt = new THREE.Mesh(DDP, material);
        mt.position.x = ddp[i][0];
        mt.position.y = ddp[i][1];
        mt.position.z = ddp[i][2];
        scene.add(mt);
      }
    }

    // 相机巡视
    function animateModel() {
      //   旋转的总角度
      var abso_degree = view_speed * view_sum_time;
      //   模型旋转的角度
      var rela_degree = view_speed * view_time;

      var radius = views[view_pointer][2]; //16 半径
      var angle = views[view_pointer][1]; //10 角度
      var x = views[view_pointer][0][0]; // 0
      var y = views[view_pointer][0][1]; // 3
      var z = views[view_pointer][0][2]; // 0
      var view_tween =
        views[view_pointer].length > 5
          ? views[view_pointer][5]
          : view_tween_default; //旋转角度
      view_time++;
      view_sum_time++;

      if (rela_degree < view_tween) {
        // console.log(rela_degree,view_tween);
        var pct = rela_degree / view_tween;
        //转场
        radius = getTween(
          views[view_pointer][2],
          views[pre_view_pointer][2],
          pct,
        );
        x = getTween(
          views[view_pointer][0][0],
          views[pre_view_pointer][0][0],
          pct,
        );
        y = getTween(
          views[view_pointer][0][1],
          views[pre_view_pointer][0][1],
          pct,
        );
        z = getTween(
          views[view_pointer][0][2],
          views[pre_view_pointer][0][2],
          pct,
        );
        angle = getTween(
          views[view_pointer][1],
          views[pre_view_pointer][1],
          pct,
        );
      }

      // model.position.x = x
      // model.position.y = y
      // model.position.z = z

      camera.position.x = x + radius * Math.sin((abso_degree / 180) * Math.PI);
      camera.position.y = y + radius * Math.tan((angle / 180) * Math.PI);
      camera.position.z = z + radius * Math.cos((abso_degree / 180) * Math.PI);
      camera.lookAt(new THREE.Vector3(x, y, z));

      if (views[view_pointer][3] < rela_degree) {
        pre_view_pointer = view_pointer;
        view_pointer++;
        view_pointer = view_pointer % views.length;
        view_time = 0;

        if (
          views[view_pointer][4] === undefined ||
          views[view_pointer][4] == 'all'
        ) {
          for (var key in part) {
            part[key].old_opacity = part[key].opacity = 1.0;
          }
        } else {
          for (let key in part) {
            part[key].old_opacity = part[key].opacity = 0.2;
          }
          for (let key in views[view_pointer][key]) {
            part[views[view_pointer][4][key]].opacity = part[
              views[view_pointer][4][key]
            ].old_opacity = 1.0;
          }
        }
        // initMeterial()
      }
    }

    // 功能函数
    // 16 进制转rgb
    function hex2ten(num) {
      var b = (num % 0x100) / 255;
      var g = ((num - b) % 0x10000) / 0x100 / 255;
      var r = (num - g * 0x100 - b) / 0x10000 / 255;
      return [r, g, b];
    }

    // 获取两个点之间的值
    function getTween(val_new, val_old, percentage) {
      return (
        val_old +
        ((val_new - val_old) * (Math.sin((percentage - 0.5) * Math.PI) + 1)) / 2
      );
    }

    // 立方体世界坐标转屏幕坐标
    function coor3to2(vec3, camera) {
      //获取网格模型boxMesh的世界坐标
      var worldVector = new THREE.Vector3(vec3.x, vec3.y, vec3.z);
      var standardVector = worldVector.project(camera); //世界坐标转标准设备坐标
      var a = window.innerWidth / 2;
      var b = window.innerHeight / 2;
      var x = Math.round(standardVector.x * a + a); //标准设备坐标转屏幕坐标
      var y = Math.round(-standardVector.y * b + b); //标准设备坐标转屏幕坐标
      return { x: x, y: y };
    }
  };

  /**
   * 开始Three
   */
  componentDidMount() {
    this.initThree();
  }

  render() {
    return <div id="WebGL-Five" className="chart"></div>;
  }
}
