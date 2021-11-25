import * as THREE from 'three/build/three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 着色器 1
const vertexShaderText =
  'varying vec2 vUv;' +
  'varying vec4 pos;' +
  'varying vec3 pos2;' +
  'varying vec3 vNormal;' +
  'void main()' +
  '{' +
  'vUv = uv;' +
  'vNormal = normalize(normalMatrix * normal);' +
  'pos2 = position;' +
  'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );' +
  'gl_Position = projectionMatrix * mvPosition;' +
  'pos=projectionMatrix * mvPosition;' +
  '}';

// 着色器 2
const fragmentShaderText =
  'uniform float time;' +
  'uniform vec3 color;' +
  'uniform float warning;' +
  'uniform float opacity;' +
  'uniform vec3 cuv;' +
  'uniform vec3 light;' +
  'varying vec3 vNormal;' +
  'varying vec2 vUv;' +
  'varying vec3 pos2;' +
  'void main( void ) {' +
  'float diffuse = dot(normalize(light), vNormal);' +
  'diffuse = 1.0 - (1.0 - diffuse) * 0.7 + 0.3;' +
  'vec2 position = - 1.0 + 2.0 * vUv;' +
  'vec3 rgb = color;' +
  'float red = rgb[0] * (1.0 - warning) + (abs( sin( pos2.x/5.0 * cuv[0] + pos2.y/5.0 * cuv[1] + pos2.z/5.0 * cuv[2] + time/ 5.0 ) ) * 0.6 + 0.2) * warning;' + // + time
  'float green = rgb[1] * (1.0 - warning) + (abs( sin( pos2.x/5.0 * cuv[0] + pos2.y/5.0 * cuv[1] + pos2.z/5.0 * cuv[2]  + time/ 4.0 ) ) * 0.6 + 0.2) * warning;' +
  'float blue = rgb[2] * (1.0 - warning) + (abs( sin( pos2.x/5.0 * cuv[0] + pos2.y/5.0 * cuv[1] + pos2.z/5.0 * cuv[2]  + time/ 3.0 ) ) * 0.6 + 0.2) * warning;' +
  'gl_FragColor = vec4( vec3(red, green, blue) * (1.0 - (1.0 - diffuse) * (1.0 - warning) * 0.8), opacity);' + // vec4( vec3(red, green, blue) * (1.0 - (1.0 - diffuse) * (1.0 - warning)), opacity);
  '}';
class D3Function {
  // 颜色值转换，将16进制转为10进制

  hex2ten(num) {
    var b = (num % 0x100) / 255;
    var g = ((num - b) % 0x10000) / 0x100 / 255;
    var r = (num - g * 0x100 - b) / 0x10000 / 255;

    return [r, g, b];
  }

  // 获得补间动画的中间状态

  getTween(val_new, val_old, percentage) {
    return (
      val_old +
      ((val_new - val_old) * (Math.sin((percentage - 0.5) * Math.PI) + 1)) / 2
    );
  }

  // 三维空间位置投射到摄像机上的二维坐标

  coor3to2(vec3, camera) {
    /**
     * 立方体世界坐标转屏幕坐标
     */
    //获取网格模型boxMesh的世界坐标
    var worldVector = new THREE.Vector3(vec3.x, vec3.y, vec3.z);
    var standardVector = worldVector.project(camera); //世界坐标转标准设备坐标
    var a = window.innerWidth / 2;
    var b = window.innerHeight / 2;
    var x = Math.round(standardVector.x * a + a); //标准设备坐标转屏幕坐标
    var y = Math.round(-standardVector.y * b + b); //标准设备坐标转屏幕坐标

    return { x: x, y: y };
  }

  // 绘制三维空间的原点坐标轴，算是一个前期搭建时的视觉辅助功能，并不在交付中显示ß

  showCoor(scene) {
    var coor = [
      [[10, 0, 0], 0xff0000],
      [[0, 10, 0], 0x00ff00],
      [[0, 0, 10], 0x0000ff],
    ];

    for (var key in coor) {
      var material = new THREE.LineBasicMaterial({
        color: coor[key][1],
      });

      var geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(coor[key][0][0], coor[key][0][1], coor[key][0][2]),
      );

      var line = new THREE.Line(geometry, material);
      scene.add(line);
    }
  }

  // 为模型赋予材质

  setMaterial(model, part, key, value, delta) {
    //console.log(type)
    if (model == undefined) return;
    model.traverse((o) => {
      if (o.isMesh && o.nameID != null) {
        if (o.nameID == part) {
          o.material.uniforms[key].value = value;
        }
      }
    });
  }

  // 移动模型中的部件的位置。如果vec3不为空，则直接移动到vec3的位置，如果vec3为空，则按照delta的三个坐标值进行偏移

  movePoly(model, part, vec3, delta) {
    //console.log(type)
    if (model == undefined) return;
    model.traverse((o) => {
      if (o.isMesh && o.nameID != null) {
        if (o.nameID == part) {
          if (vec3 == '') {
            o.position.x = vec3[0];
            o.position.y = vec3[1];
            o.position.z = vec3[2];
          } else {
            o.position.x += delta[0];
            o.position.y += delta[1];
            o.position.z += delta[2];
          }
        }
      }
    });
  }
}

class Scene3d extends D3Function {
  constructor(config) {
    super(config);

    this.views =
      config.views != undefined ? config.views : [[[0, 0, 0], 20, 360]]; // [[坐标，巡视半径， 巡视角度（时长），高亮部位，转场时间（可选）], ...]
    this.part = config.part != undefined ? config.part : {}; // {title: '床板', color: 0xffffff, opacity: 1.0, old_opacity: 1.0, warning: 0, old_warning: 0, tag: [0, 1.7, 2.5], cuv: [0, 0, 0], time: 0}

    this.light =
      config.light != undefined
        ? config.light
        : {
            hemisphere: [[[0, 15, 0], 0.61, false, 0xffffff]],
            directional: [],
          };
    config.light.hemisphere == undefined
      ? (config.light.hemisphere = [])
      : true;
    config.light.directional == undefined
      ? (config.light.directional = [])
      : true;

    this.sky_color =
      config.sky_color != undefined ? config.sky_color : 0xf1f1f1;
    this.floor_color =
      config.floor_color != undefined ? config.floor_color : 0xe8e8e8;

    this.view_tween_default =
      config.view_tween_default != undefined ? config.view_tween_default : 40;
    this.view_speed = config.view_speed != undefined ? config.view_speed : 0.2;

    this.view_pointer = 0;
    this.view_time = 0;
    this.view_sum_time = 0;
    this.pre_view_pointer = 0;

    this.theModel;
    this.MODEL_PATH =
      config.model != undefined ? config.model : '/static/MR08.glb';
    this.canvas =
      config.canvasDom != undefined
        ? config.canvasDom
        : document.querySelector('#c');

    this.initScene();

    this.initModel();
  }

  // 场景构建

  initScene() {
    // Init the scene，定义场景
    this.scene = new THREE.Scene();

    // Set background，定义背景（可作为天空）和雾
    // this.scene.background = new THREE.Color(this.sky_color);
    this.scene.fog = new THREE.Fog(this.sky_color, 20, 2000);

    // Init the renderer，配置渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0); // the default
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Add a camerra， 添加摄像头
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1800,
    );
    this.camera.position.x = 14;
    this.camera.position.y = 10;
    this.camera.position.z = 14;
    this.camera.lookAt(0, 0, 0);

    //Add light，添加灯光
    this.addLight(this.light);

    //add floor，添加地面
    // this.initFloor();

    //add control，添加鼠标互动的控制器
    this.initControl();

    //tag
    this.tag = [];

    // 显示设备部件的名称标签
    this.showTip();
  }

  showTip() {
    // 摄像机焦点的标记，主要是用作debug

    var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1); //盒子模型
    var material = new THREE.MeshBasicMaterial({ color: 'red' }); //材料
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = 0;
    this.mesh.position.y = 0;
    this.mesh.position.z = 0;
    // this.scene.add(this.mesh);

    // 每个零部件

    var geometry2 = new THREE.BoxGeometry(0.05, 0.05, 0.05); //盒子模型
    for (var i = 0; i < this.views.length; i++) {
      var material = new THREE.MeshBasicMaterial({ color: 'gray' }); //材料
      var mt = new THREE.Mesh(geometry2, material);
      mt.position.x = this.views[i][0][0];
      mt.position.y = this.views[i][0][1];
      mt.position.z = this.views[i][0][2];
      // this.scene.add(mt);
    }

    // ddp，ddp是直接创建了一个模型给他又付了一个材质，并不是模型中提供的材质

    var ddp = [
      [1.56, 2.34, 0.05],
      [-1.56, 2.34, 0.05],
    ];
    var DDP = new THREE.BoxGeometry(0.64, 0.36, 0.01); //盒子模型
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
      this.scene.add(mt);
    }
  }

  // 纠正渲染出图的尺寸，无需纠结

  // Function - New resizing method
  resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // 每帧刷新的函数

  update() {
    // this.updateTag();
  }

  //light

  addLight(light) {
    // 设置大气天光

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
      this.scene.add(hemiLight);
    }

    // 设置定向的透射光

    this.directionalLight = [];

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
      this.scene.add(dirLight);

      this.directionalLight.push(dirLight);
    }
  }

  //model

  initModel() {
    // 载入模型

    // Init the object loader
    var loader = new GLTFLoader();

    var that = this;

    loader.load(
      this.MODEL_PATH,
      function (gltf) {
        //   console.log("d");

        that.theModel = gltf.scene;

        that.theModel.scale.set(0.4, 0.4, 0.4);

        that.theModel.rotation.y = Math.PI;

        that.theModel.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });

        // Add the model to the scene
        that.scene.add(that.theModel);

        that.initMeterial();
      },
      undefined,
      function (error) {
        //console.error(error)
      },
    );
  }

  // 载入控制器

  //control
  initControl() {
    // Add controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minPolarAngle = 0;
    this.controls.enableDamping = true;
    this.controls.enablePan = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    this.controls.autoRotateSpeed = -0.5; // 30
  }

  // 生成地面

  initFloor() {
    // Floor
    var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    var floorMaterial = new THREE.MeshPhongMaterial({
      color: this.floor_color,
      shininess: 0,
    });

    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -0.5 * Math.PI;
    this.floor.receiveShadow = true;
    this.floor.position.y = 0;
    this.scene.add(this.floor);
  }

  //meterial

  initMeterial() {
    // Initial material

    this.INITIAL_MAP = [];

    //   console.log("a", this.INITIAL_MAP, this.part);

    for (var key in this.part) {
      // 配置颜色

      /*var conf = {
                color: part[key].color,
                shininess: 10,
                opacity: part[key].opacity,
                transparent: true
            }*/
      var conf = {
        uniforms: {
          time: { value: this.part[key].time },
          color: { value: this.hex2ten(this.part[key].color) },
          light: { type: 'v3', value: this.directionalLight[0].position },
          opacity: { value: this.part[key].opacity },
          warning: { value: 0.0 },
          cuv: { value: this.part[key].cuv },
        },
        vertexShader: vertexShaderText,
        fragmentShader: fragmentShaderText,
        transparent: true,
      };

      this.INITIAL_MAP.push({
        childID: key,
        mtl: new THREE.ShaderMaterial(conf),
      });

      // 顺道初始化一下tag，其实吧，不应该写在这里

      // this.newTag({ x: this.part[key].tag[0], y: this.part[key].tag[1], z: this.part[key].tag[2] }, key, this.part[key].title);
    }

    // 得到所有的材质配置文件 this.INITIAL_MAP，接下来依次分配给相应的模型
    // Set initial textures
    this.updateMaterial();
  }

  // 给模型匹配材质

  // Function - Add the textures to the models
  updateMaterial() {
    for (let object of this.INITIAL_MAP) {
      this.theModel.traverse((o) => {
        if (o.isMesh) {
          // console.log();
          if (o.name.includes(object.childID)) {
            // //console.log(111111, o, o.name, type)
            o.material = object.mtl;
            o.nameID = object.childID; // Set a new property to identify this object
          }
        }
      });
    }
  }

  //tag

  newTag(position, tag, title) {
    var div = document.createElement('div');
    div.className = 'tag';
    div.innerHTML = title == undefined ? tag : title;
    div.setAttribute('data-part', tag);
    document.body.appendChild(div);

    this.tag.push({ div: div, position: position, xy: { x: 0, y: 0 } });
  }

  updateTag() {
    for (var key in this.tag) {
      //position
      var xy = this.coor3to2(this.tag[key].position, this.camera);
      //抗抖动

      this.tag[key].div.style.left = (xy.x + this.tag[key].xy.x) / 2 + 'px';
      this.tag[key].div.style.top = (xy.y + this.tag[key].xy.y) / 2 + 'px';
      this.tag[key].xy = xy;
    }
  }
}

export class SceneAnima extends Scene3d {
  constructor(config) {
    super(config);
  }

  update() {
    super.update();
    /* 思路：
     * 1. 根据预定脚本在转场时，获得摄像机的转场焦点位置，在非转场时，读取焦点位置
     *
     */

    // 脚本格式：[0:坐标，1:俯视角度， 2:巡视半径（摄像机到焦点的位置）， 3:巡视角度（时长），4:高亮部位，5:转场时间（可选）]

    //  views: [
    //     [[0, 3, 0], 10, 16, 20],
    //     [[1.6, 2.5, 0.25], 0, 4, 40, ['screen']],
    //     [[0, 2.5, -2], 0, 12, 100, ['yehai']],
    //     [[0, 2.5, -2], 0, 10, 140, ['citi'], 10],
    //     [[-0.5, 1.5, 0.1], 0, 4, 40, ['stop']],
    //     [[0, 3, 0], 10, 16, 60]
    // ],

    var abso_degree = this.view_speed * this.view_sum_time; // 总的角度
    var rela_degree = this.view_speed * this.view_time; // 每个环节转过的角度
    var radius = this.views[this.view_pointer][2]; // 巡视半径（摄像机到焦点的位置）
    var angle = this.views[this.view_pointer][1]; // 俯视角度

    // 获得摄像机焦点的位置
    var x = this.views[this.view_pointer][0][0];
    var y = this.views[this.view_pointer][0][1];
    var z = this.views[this.view_pointer][0][2];

    var view_tween =
      this.views[this.view_pointer].length > 5
        ? this.views[this.view_pointer][5]
        : this.view_tween_default; // 转场时间

    if (rela_degree < view_tween) {
      var pct = rela_degree / view_tween;
      //转场
      radius = this.getTween(
        this.views[this.view_pointer][2],
        this.views[this.pre_view_pointer][2],
        pct,
      );
      x = this.getTween(
        this.views[this.view_pointer][0][0],
        this.views[this.pre_view_pointer][0][0],
        pct,
      );
      y = this.getTween(
        this.views[this.view_pointer][0][1],
        this.views[this.pre_view_pointer][0][1],
        pct,
      );
      z = this.getTween(
        this.views[this.view_pointer][0][2],
        this.views[this.pre_view_pointer][0][2],
        pct,
      );
      angle = this.getTween(
        this.views[this.view_pointer][1],
        this.views[this.pre_view_pointer][1],
        pct,
      );

      //材质
      for (var pt in this.part) {
        var op = this.getTween(
          this.part[pt].opacity,
          this.part[pt].old_opacity,
          rela_degree / view_tween,
        );
        this.setMaterial(this.theModel, pt, 'opacity', op);
        var warning = this.getTween(
          this.part[pt].warning,
          this.part[pt].old_warning,
          rela_degree / view_tween,
        );
        this.setMaterial(this.theModel, pt, 'warning', warning);
      }
    }

    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;

    //巡视
    this.camera.position.x =
      x + radius * Math.sin((abso_degree / 180) * Math.PI);
    this.camera.position.y = y + radius * Math.tan((angle / 180) * Math.PI);
    this.camera.position.z =
      z + radius * Math.cos((abso_degree / 180) * Math.PI);
    this.camera.lookAt(new THREE.Vector3(x, y, z));

    this.view_time++; // 每次转场的时间
    this.view_sum_time++; // 总的运行时间

    // 判断当前场景是否结束，若结束，则切换到下一个场景

    if (this.views[this.view_pointer][3] < rela_degree) {
      this.pre_view_pointer = this.view_pointer;
      this.view_pointer++;
      this.view_pointer = this.view_pointer % this.views.length;

      this.view_time = 0;

      // Set initial textures
      //for (let object of INITIAL_MAP) {
      //    initColor(theModel, object.childID, object.mtl);
      //}

      if (
        this.views[this.view_pointer][4] == undefined ||
        this.views[this.view_pointer][4] == 'all'
      ) {
        for (var key in this.part) {
          this.part[key].old_opacity = this.part[key].opacity;
          this.part[key].opacity = 1.0;

          this.part[key].old_warning = this.part[key].warning;
          this.part[key].warning = 0.0;
        }

        // $('.tag').removeClass('active');
      } else {
        for (var key in this.part) {
          this.part[key].old_opacity = this.part[key].opacity;
          this.part[key].opacity = 0.1;

          this.part[key].old_warning = this.part[key].warning;
          this.part[key].warning = 0.0;
        }

        // $('.tag').removeClass('active');

        for (var key in this.views[this.view_pointer][4]) {
          this.part[this.views[this.view_pointer][4][key]].opacity = 1.0;

          this.part[this.views[this.view_pointer][4][key]].warning = 1.0;

          // $(
          //   '.tag[data-part="' + this.views[this.view_pointer][4][key] + '"]',
          // ).addClass('active');
        }
      }
    }
  }
}
