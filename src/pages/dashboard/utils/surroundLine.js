import * as THREE from 'three';
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
const surroundLineDate = {
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
// 获取到包围的线条
function surroundLineGeometry(object) {
  return new THREE.EdgesGeometry(object.geometry);
}

/**
 * 获取包围线条效果
 */
function surroundLine(object, time, StartTime) {
  // 获取线条geometry
  const geometry = surroundLineGeometry(object);
  // 获取物体的世界坐标 旋转等
  const worldPosition = new THREE.Vector3();
  object.getWorldPosition(worldPosition);

  // 传递给shader重要参数
  const { max, min } = object.geometry.boundingBox;

  const size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);

  const material = createSurroundLineMaterial({
    max,
    min,
    time,
    StartTime,
  });

  const line = new THREE.LineSegments(geometry, material);

  line.name = 'surroundLine';

  line.scale.copy(object.scale);
  line.rotation.copy(object.rotation);
  line.position.copy(worldPosition);

  return line;
}

/**
 * 创建包围线条材质
 */
function createSurroundLineMaterial({ max, min, time, StartTime }) {
  if (surroundLineMaterial) return surroundLineMaterial;

  const surroundLineMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uColor: {
        value: new THREE.Color('#4C8BF5'),
      },
      uActive: {
        value: new THREE.Color('#fff'),
      },
      time: time,
      uOpacity: {
        value: 0.6,
      },
      uMax: {
        value: max,
      },
      uMin: {
        value: min,
      },
      uRange: {
        value: 200,
      },
      uSpeed: {
        value: 0.2,
      },
      uStartTime: StartTime,
    },
    vertexShader: surroundLineDate.vertexShader,
    fragmentShader: surroundLineDate.fragmentShader,
  });

  return surroundLineMaterial;
}

export { surroundLine, createSurroundLineMaterial };
