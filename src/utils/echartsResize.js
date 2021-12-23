/**
 * desc: resize 图表文字
 * @param {*} size 默认字体 font-size
 * @param {*} defalteWidth 设计稿默认宽度
 * @returns 字体 font-size
 */

export const fitChartSize = (size, defalteWidth = 1920) => {
  const clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (!clientWidth) return size;
  const scale = clientWidth / defalteWidth;
  return Number((size * scale).toFixed(3));
};
