import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Radar from './utils/radar.js';
import { surroundLine } from './utils/surroundLine.js';
const radarData = [
  {
    position: {
      x: 666,
      y: 22,
      z: 0,
    },
    radius: 150,
    color: '#efad35',
    opacity: 0.5,
    speed: 2,
  },
];

class City {
  // 遍历模型
  forMaterial(materials, callback) {
    if (!callback || !materials) return false;
    if (Array.isArray(materials)) {
      materials.forEach((mat) => {
        callback(mat);
      });
    } else {
      callback(materials);
    }
  }

  generateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    const context = canvas.getContext('2d');
    const image = context.getImageData(0, 0, 256, 256);

    let x = 0,
      y = 0;

    for (let i = 0, j = 0, l = image.data.length; i < l; i += 4, j++) {
      x = j % 256;
      y = x === 0 ? y + 1 : y;

      image.data[i] = 255;
      image.data[i + 1] = 255;
      image.data[i + 2] = 255;
      image.data[i + 3] = Math.floor(x ^ y);
    }

    context.putImageData(image, 0, 0);

    return canvas;
  }
}

class CityConfig extends City {
  constructor(config) {
    super(config);
    this.time = {
      value: 0,
    };
    this.StartTime = {
      value: 0,
    };
    this.isStart = false; // 是否启动

    this.canvas =
      config.canvasDom != undefined
        ? config.canvasDom
        : document.querySelector('#city');

    this.size = {
      width: this.canvas.offsetWidth,
      height: this.canvas.offsetHeight,
    };

    this.model = config.model;

    this.initScene();
    this.initModel();
    setTimeout(() => {
      this.isStart = true;
      if (this.isStart) {
        this.loadRadar();
      }
    }, 300);
  }

  // 初始化场景
  initScene() {
    // 场景
    this.scene = new THREE.Scene();
    // 环境灯光
    this.light = new THREE.AmbientLight(0xadadad);
    // 方向灯光
    this.directionLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionLight.position.set(100, 100, 0);
    // 添加灯光
    this.scene.add(this.light);
    this.scene.add(this.directionLight);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(new THREE.Color('#32373E'), 1);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.size.width / this.size.height,
      1,
      10000,
    );
    this.camera.position.set(1200, 550, -700);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
    const helper = new THREE.AxesHelper(100);
    this.scene.add(helper);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    const clock = new THREE.Clock();
    const tick = () => {
      const dt = clock.getDelta();

      this.animate(dt);
      // Update controls
      this.controls.update();

      // Render
      this.renderer.render(this.scene, this.camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }
  // 初始化model
  initModel() {
    this.FBXLoader = new FBXLoader();
    // 创建一个总的组
    this.group = new THREE.Group();
    // 创建特效组
    this.effectGroup = new THREE.Group();
    // 添加进group的children
    this.group.add(this.effectGroup);
    // 城市效果mesh
    const cityArray = ['CITY_UNTRIANGULATED'];
    // 地板效果mesh
    const floorArray = ['LANDMASS'];
    // 道路
    const roadArray = ['ROADS'];

    this.loadFbx(this.model).then((cube) => {
      this.group.add(cube);

      cube.traverse((child) => {
        if (cityArray.includes(child.name)) {
          // 建筑
          this.setCityMaterial(child);
          // 添加包围线条效
          const line = surroundLine(child, this.time, this.StartTime);
          this.effectGroup.add(line);
        }
        if (floorArray.includes(child.name)) {
          this.setFloor(child);
        }

        if (roadArray.includes(child.name)) {
          this.setRoads(child);
        }
      });
    });

    this.scene.add(this.group);
  }

  // 设置地板
  setFloor(object) {
    this.forMaterial(object.material, (material) => {
      material.color.setStyle('#040912');
      material.side = THREE.DoubleSide;
    });
  }

  // 异步加载模型
  loadFbx(url) {
    return new Promise((resolve, reject) => {
      try {
        this.FBXLoader.load(url, (obj) => {
          resolve(obj);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // 加载扫描效果
  loadRadar() {
    // 加载扫描效果
    radarData.forEach((data) => {
      const mesh = Radar(data);
      mesh.material.uniforms.time = this.time;
      this.effectGroup.add(mesh);
    });
  }

  // 设置道路
  setRoads(object) {
    const texture = new THREE.Texture(this.generateTexture());
    texture.needsUpdate = true;
    object.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
  }

  // 设置城市材质
  setCityMaterial(object) {
    // 确定oject的geometry的box size
    object.geometry.computeBoundingBox();
    object.geometry.computeBoundingSphere();

    const { geometry } = object;

    // 获取geometry的长宽高 中心点
    const { center, radius } = geometry.boundingSphere;

    const { max, min } = geometry.boundingBox;

    const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
    this.forMaterial(object.material, (material) => {
      material.opacity = 1;
      material.transparent = true;
      material.color.setStyle('#1B3045');

      material.onBeforeCompile = (shader) => {
        shader.uniforms.time = this.time.value;
        shader.uniforms.uStartTime = this.StartTime.value;

        // 中心点
        shader.uniforms.uCenter = {
          value: center,
        };

        // geometry大小
        shader.uniforms.uSize = {
          value: size,
        };

        shader.uniforms.uMax = {
          value: max,
        };

        shader.uniforms.uMin = {
          value: min,
        };
        shader.uniforms.uTopColor = {
          value: new THREE.Color('#FFFFDC'),
        };

        // 效果开关
        shader.uniforms.uSwitch = {
          value: new THREE.Vector3(
            0, // 扩散
            0, // 左右横扫
            0, // 向上扫描
          ),
        };
        // 扩散
        shader.uniforms.uDiffusion = {
          value: new THREE.Vector3(
            1, // 0 1开关
            120, // 范围
            600, // 速度
          ),
        };
        // 扩散中心点
        shader.uniforms.uDiffusionCenter = {
          value: new THREE.Vector3(0, 0, 0),
        };

        // 扩散中心点
        shader.uniforms.uFlow = {
          value: new THREE.Vector3(
            0, // 0 1开关
            10, // 范围
            20, // 速度
          ),
        };

        // 效果颜色
        shader.uniforms.uColor = {
          value: new THREE.Color('#5588aa'),
        };
        // 效果颜色
        shader.uniforms.uFlowColor = {
          value: new THREE.Color('#5588AA'),
        };

        // 效果透明度
        shader.uniforms.uOpacity = {
          value: 1,
        };

        // 效果透明度
        shader.uniforms.uRadius = {
          value: radius,
        };

        /**
         * 对片元着色器进行修改
         */
        const fragment = `
      float distanceTo(vec2 src, vec2 dst) {
          float dx = src.x - dst.x;
          float dy = src.y - dst.y;
          float dv = dx * dx + dy * dy;
          return sqrt(dv);
      }
      float lerp(float x, float y, float t) {
          return (1.0 - t) * x + t * y;
      }
      vec3 getGradientColor(vec3 color1, vec3 color2, float index) {
          float r = lerp(color1.r, color2.r, index);
          float g = lerp(color1.g, color2.g, index);
          float b = lerp(color1.b, color2.b, index);
          return vec3(r, g, b);
      }
      varying vec4 vPositionMatrix;
      varying vec3 vPosition;
      uniform float time;
      // 扩散参数
      uniform float uRadius;
      uniform float uOpacity;
      // 初始动画参数
      uniform float uStartTime;
      uniform vec3 uMin;
      uniform vec3 uMax;
      uniform vec3 uSize;
      uniform vec3 uFlow;
      uniform vec3 uColor;
      uniform vec3 uCenter;
      uniform vec3 uSwitch;
      uniform vec3 uTopColor;
      uniform vec3 uFlowColor;
      uniform vec3 uDiffusion;
      uniform vec3 uDiffusionCenter;
      void main() {
          `;
        const fragmentColor = `
      vec3 distColor = outgoingLight;
      float dstOpacity = diffuseColor.a;

      float indexMix = vPosition.z / (uSize.z * 0.6);
      distColor = mix(distColor, uTopColor, indexMix);

      // 开启扩散波
      vec2 position2D = vec2(vPosition.x, vPosition.y);
      if (uDiffusion.x > 0.5) {
          // 扩散速度
          float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
          // 当前的离中心点距离
          float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));
          // 扩散范围
          if (uLen < dTime && uLen > dTime - uDiffusion.y) {
              // 颜色渐变
              float dIndex = sin((dTime - uLen) / uDiffusion.y * PI);
              distColor = mix(uColor, distColor, 1.0 - dIndex);
          }
      }
      // 流动效果
      if (uFlow.x > 0.5) {
          // 扩散速度
          float dTime = mod(time * uFlow.z, uSize.z);
          // 流动范围
          float topY = vPosition.z + uFlow.y;
          if (dTime > vPosition.z && dTime < topY) {
              // 颜色渐变
              float dIndex = sin((topY - dTime) / uFlow.y * PI);
              distColor = mix(distColor, uFlowColor,  dIndex);
          }
      }

      gl_FragColor = vec4(distColor, dstOpacity * uStartTime);
          `;
        shader.fragmentShader = shader.fragmentShader.replace(
          'void main() {',
          fragment,
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
          fragmentColor,
        );

        /**
         * 对顶点着色器进行修改
         */
        const vertex = `
              varying vec4 vPositionMatrix;
              varying vec3 vPosition;
              uniform float uStartTime;
              void main() {
              vPositionMatrix = projectionMatrix * vec4(position, 1.0);
              vPosition = position;
              `;
        const vertexPosition = `
      vec3 transformed = vec3(position.x, position.y, position.z * uStartTime);
              `;

        // shader.vertexShader = shader.vertexShader.replace(
        //   'void main() {',
        //   vertex,
        // );
        // shader.vertexShader = shader.vertexShader.replace(
        //   '#include <begin_vertex>',
        //   vertexPosition,
        // );
      };
    });
  }

  animate = (dt) => {
    if (dt > 1) return false;
    this.time.value += dt;

    // 启动
    if (this.isStart) {
      this.StartTime.value += dt * 2;
      if (this.StartTime.value >= 1) {
        this.StartTime.value = 1;
        this.isStart = false;
      }
    }
  };
}

export default CityConfig;
