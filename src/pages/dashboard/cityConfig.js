import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const base = `
precision mediump float;

float distanceTo(vec2 src, vec2 dst) {
    float dx = src.x - dst.x;
    float dy = src.y - dst.y;
    float dv = dx * dx + dy * dy;
    return sqrt(dv);
} 

float lerp(float x, float y, float t) {
    return (1.0 - t) * x + t * y;
}

#define PI 3.14159265359
#define PI2 6.28318530718

`;
const surroundLine = {
  // 顶点着色器
  vertexShader: `
    #define PI 3.14159265359

    uniform mediump float uStartTime;
    uniform mediump float time;
    uniform mediump float uRange;
    uniform mediump float uSpeed;

    uniform vec3 uColor;
    uniform vec3 uActive;
    uniform vec3 uMin;
    uniform vec3 uMax;

    varying vec3 vColor;

    float lerp(float x, float y, float t) {
        return (1.0 - t) * x + t * y;
    }
    void main() { 
        if (uStartTime >= 0.99) {
            float iTime = mod(time * uSpeed - uStartTime, 1.0);
            float rangeY = lerp(uMin.y, uMax.y, iTime);
            if (rangeY < position.y && rangeY > position.y - uRange) {
                float index = 1.0 - sin((position.y - rangeY) / uRange * PI);
                float r = lerp(uActive.r, uColor.r, index);
                float g = lerp(uActive.g, uColor.g, index);
                float b = lerp(uActive.b, uColor.b, index);

                vColor = vec3(r, g, b);
            } else {
                vColor = uColor;
            }
        }
        vec3 vPosition = vec3(position.x, position.y, position.z * uStartTime);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
    } 
    `,
  // 片元着色器
  fragmentShader: ` 
    ${base} 
    uniform float time;
    uniform float uOpacity;
    uniform float uStartTime;

    varying vec3 vColor; 

    void main() {

        gl_FragColor = vec4(vColor, uOpacity * uStartTime);
    }
    `,
};
class City {
  // 获取到包围的线条
  surroundLineGeometry(object) {
    return new THREE.EdgesGeometry(object.geometry);
  }

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
}

class CityConfig extends City {
  constructor(config) {
    super(config);

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
    this.camera.position.set(1200, 700, 700);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);

    const helper = new THREE.AxesHelper(100);
    this.scene.add(helper);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }
  // 初始化model
  initModel() {
    this.FBXLoader = new FBXLoader();
    // 创建一个总的组
    this.group = new THREE.Group();
    // 创建特效组
    this.effectGroup = new THREE.Group();

    this.group.add(this.effectGroup);

    this.loadFbx(this.model).then((scene) => {
      this.group.add(scene);
    });

    this.scene.add(this.group);
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
  // 自适应
  handleResize(renderer) {
    const canvas = document.querySelector('.city-box');
    this.size = {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
    };

    // Update camera
    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(this.size.width, this.size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

export default CityConfig;
