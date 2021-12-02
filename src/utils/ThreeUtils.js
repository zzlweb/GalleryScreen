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
