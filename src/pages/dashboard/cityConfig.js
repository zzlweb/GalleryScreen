import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Radar from './radar.js';
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
  {
    position: {
      x: -666,
      y: 25,
      z: 202,
    },
    radius: 150,
    color: '#efad35',
    opacity: 0.6,
    speed: 1,
  },
];
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
      material.opacity = 0.95;
      material.transparent = true;
      material.color.setStyle('#1B3045');

      // material.onBeforeCompile = (shader) => {
      //   shader.uniforms.time = this.time;
      //   shader.uniforms.uStartTime = this.StartTime;

      //   // 中心点
      //   shader.uniforms.uCenter = {
      //     value: center,
      //   };

      //   // geometry大小
      //   shader.uniforms.uSize = {
      //     value: size,
      //   };

      //   shader.uniforms.uMax = {
      //     value: max,
      //   };

      //   shader.uniforms.uMin = {
      //     value: min,
      //   };
      //   shader.uniforms.uTopColor = {
      //     value: new THREE.Color('#F40'),
      //   };

      //   // 效果开关
      //   shader.uniforms.uSwitch = {
      //     value: new THREE.Vector3(
      //       0, // 扩散
      //       0, // 左右横扫
      //       0, // 向上扫描
      //     ),
      //   };
      //   // 扩散
      //   shader.uniforms.uDiffusion = {
      //     value: new THREE.Vector3(
      //       1, // 0 1开关
      //       120, // 范围
      //       600, // 速度
      //     ),
      //   };
      //   // 扩散中心点
      //   shader.uniforms.uDiffusionCenter = {
      //     value: new THREE.Vector3(0, 0, 0),
      //   };

      //   // 扩散中心点
      //   shader.uniforms.uFlow = {
      //     value: new THREE.Vector3(
      //       1, // 0 1开关
      //       10, // 范围
      //       20, // 速度
      //     ),
      //   };

      //   // 效果颜色
      //   shader.uniforms.uColor = {
      //     value: new THREE.Color('#5588aa'),
      //   };
      //   // 效果颜色
      //   shader.uniforms.uFlowColor = {
      //     value: new THREE.Color('#5588AA'),
      //   };

      //   // 效果透明度
      //   shader.uniforms.uOpacity = {
      //     value: 1,
      //   };

      //   // 效果透明度
      //   shader.uniforms.uRadius = {
      //     value: radius,
      //   };

      //   /**
      //    * 对片元着色器进行修改
      //    */
      //   const fragment = `
      //     float distanceTo(vec2 src, vec2 dst) {
      //         float dx = src.x - dst.x;
      //         float dy = src.y - dst.y;
      //         float dv = dx * dx + dy * dy;
      //         return sqrt(dv);
      //     }

      //     float lerp(float x, float y, float t) {
      //         return (1.0 - t) * x + t * y;
      //     }

      //     vec3 getGradientColor(vec3 color1, vec3 color2, float index) {
      //         float r = lerp(color1.r, color2.r, index);
      //         float g = lerp(color1.g, color2.g, index);
      //         float b = lerp(color1.b, color2.b, index);
      //         return vec3(r, g, b);
      //     }

      //     varying vec4 vPositionMatrix;
      //     varying vec3 vPosition;

      //     uniform float time;
      //     // 扩散参数
      //     uniform float uRadius;
      //     uniform float uOpacity;
      //     // 初始动画参数
      //     uniform float uStartTime;

      //     uniform vec3 uMin;
      //     uniform vec3 uMax;
      //     uniform vec3 uSize;
      //     uniform vec3 uFlow;
      //     uniform vec3 uColor;
      //     uniform vec3 uCenter;
      //     uniform vec3 uSwitch;
      //     uniform vec3 uTopColor;
      //     uniform vec3 uFlowColor;
      //     uniform vec3 uDiffusion;
      //     uniform vec3 uDiffusionCenter;

      //     void main() {
      //     `;
      //   const fragmentColor = `
      //   vec3 distColor = outgoingLight;
      //   float dstOpacity = diffuseColor.a;

      //   float indexMix = vPosition.z / (uSize.z * 0.6);
      //   distColor = mix(distColor, uTopColor, indexMix);

      //   // 开启扩散波
      //   vec2 position2D = vec2(vPosition.x, vPosition.y);
      //   if (uDiffusion.x > 0.5) {
      //       // 扩散速度
      //       float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
      //       // 当前的离中心点距离
      //       float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));

      //       // 扩散范围
      //       if (uLen < dTime && uLen > dTime - uDiffusion.y) {
      //           // 颜色渐变
      //           float dIndex = sin((dTime - uLen) / uDiffusion.y * PI);
      //           distColor = mix(uColor, distColor, 1.0 - dIndex);
      //       }
      //   }

      //   // 流动效果
      //   if (uFlow.x > 0.5) {
      //       // 扩散速度
      //       float dTime = mod(time * uFlow.z, uSize.z);
      //       // 流动范围
      //       float topY = vPosition.z + uFlow.y;
      //       if (dTime > vPosition.z && dTime < topY) {
      //           // 颜色渐变
      //           float dIndex = sin((topY - dTime) / uFlow.y * PI);

      //           distColor = mix(distColor, uFlowColor,  dIndex);
      //       }
      //   }

      //   gl_FragColor = vec4(distColor, dstOpacity * uStartTime);
      //       `;
      //   shader.fragmentShader = shader.fragmentShader.replace(
      //     'void main() {',
      //     fragment,
      //   );
      //   shader.fragmentShader = shader.fragmentShader.replace(
      //     'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      //     fragmentColor,
      //   );

      //   /**
      //   * 对顶点着色器进行修改
      //   */
      //   const vertex = `
      //   varying vec4 vPositionMatrix;
      //   varying vec3 vPosition;
      //   uniform float uStartTime;
      //   void main() {
      //   vPositionMatrix = projectionMatrix * vec4(position, 1.0);
      //   vPosition = position;
      //   `;
      //   const vertexPosition = `
      //   vec3 transformed = vec3(position.x, position.y, position.z * uStartTime);
      //           `;

      //   shader.vertexShader = shader.vertexShader.replace(
      //     'void main() {',
      //     vertex,
      //   );
      //   shader.vertexShader = shader.vertexShader.replace(
      //     '#include <begin_vertex>',
      //     vertexPosition,
      //   );
      // };
    });
  }

  // 设置地板
  setFloor(object) {
    this.forMaterial(object.material, (material) => {
      material.color.setStyle('#040912');
      material.side = THREE.DoubleSide;
    });
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
    // setTimeout(() => {
    //   this.loadRadar()
    // }, 1000)
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
    // 添加进group的children
    this.group.add(this.effectGroup);
    // 城市效果mesh
    const cityArray = ['CITY_UNTRIANGULATED'];
    // 地板效果mesh
    const floorArray = ['LANDMASS'];

    this.loadFbx(this.model).then((cube) => {
      this.group.add(cube);

      cube.traverse((child) => {
        if (cityArray.includes(child.name)) {
          // 建筑
          this.setCityMaterial(child);
          // 添加包围线条效
          // this.surroundLine(child);
        }
        if (floorArray.includes(child.name)) {
          this.setFloor(child);
        }
      });
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

  // 加载扫描效果
  loadRadar() {
    // 加载扫描效果
    radarData.forEach((data) => {
      const mesh = Radar(data);
      mesh.material.uniforms.time = this.time;
      this.effectGroup.add(mesh);
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
