import * as THREE from 'three';
/**
 * # three 页面 resize
 * @param {*} DOM canvas 外部标签
 * @param {*} renderer 渲染器
 * @param {*} Camera 相机
 */

export function handleResize(DOM, renderer, Camera) {
  const canvas = document.querySelector(DOM);
  if (canvas) {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    // Update camera
    Camera.aspect = width / height;
    Camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

// Utils.onTransitionMouseXYZ 实现细节
// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
export function onTransitionMouseXYZ(event, domElement) {
  let mouse = new THREE.Vector2();
  if (domElement) {
    let domElementLeft = domElement.offsetLeft;
    let domElementTop = domElement.offsetTop;
    mouse.x =
      ((event.clientX - domElementLeft) / domElement.clientWidth) * 2 - 1;
    mouse.y =
      -((event.clientY - domElementTop) / domElement.clientHeight) * 2 + 1;
  }
  return mouse;
}
