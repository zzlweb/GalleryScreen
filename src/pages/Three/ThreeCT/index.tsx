import React, { Component } from 'react';
import './index.less';
import { debounce } from 'lodash';
import drawChart from '../../services/drawChart.js';
import { liquidHeliumDataObj } from './config';
import { SceneAnima } from './SceneAnimate.js.js';

class MachineModel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvas = null;
    this.sceneAnima = null;
    this.liquidHeliumChartOption = null;
    this.timer = null;
    this.timeOuter = null;
  }

  // 将要挂载设置数据
  // 挂载后设置动画
  componentDidMount() {
    const that = this;
    // this.timeOuter = setTimeout(() => {
    that.drawMachineModel();
    // }, 10);
    // this.timer = setInterval(() => {
    //   that.changeLiquidHeliumData();
    // }, 1500);
  }

  drawMachineModel() {
    const that = this;
    let sceneAnima = new SceneAnima({
      views: [
        [[0, 3, 0], 10, 16, 20],
        // [[1.6, 2.5, 0.25], 4, 40, ["screen"]],
        [[0, 2.5, -2], 0, 12, 100, ['yehai']],
        [[0, 2.5, -2], 0, 10, 140, ['citi'], 10],
        [[-0.5, 1.5, 0.1], 0, 4, 40, ['stop']],
        [[0, 3, 0], 10, 16, 60],
      ], // [坐标，俯视角度，巡视半径， 巡视角度（时长），高亮部位，转场时间（可选）]
      part: {
        chuang: {
          title: '床板',
          color: 0xf2f2f2,
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
          color: 0xf2f2f2,
          map: '/static/ddp.png',
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
          color: 0xf2f2f2,
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
          color: 0x1a1a1a,
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
          color: 0xf2f2f2,
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
          color: 0xf2f2f2,
          opacity: 1.0,
          old_opacity: 1.0,
          warning: 0,
          old_warning: 0,
          tag: [0, 0.8, 2.5],
          cuv: [0, 0, 0],
          time: 0,
        },
      },
      light: {
        hemisphere: [
          [[0, 15, 0], 0.61, false, 0xf1f1f1],
          [[-8, 10, -8], 0.06, false, 0xf1f1f1],
        ],
        directional: [
          [[-8, 10, 8], 0.54, true, 0xf1f1f1],
          [[8, 2, -8], 0.08, false, 0xf1f1f1],
        ],
      },
      sky_color: 0x141414,
      floor_color: 0x141414,
      view_tween_default: 40,
      view_speed: 0.2,
      model: '/static/MR08.glb',
      canvasDom: that.canvas,
    });

    function animate() {
      window.requestAnimationFrame(animate);

      if (sceneAnima.resizeRendererToDisplaySize(sceneAnima.renderer)) {
        const canvas = sceneAnima.renderer.domElement;
        sceneAnima.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        sceneAnima.camera.updateProjectionMatrix();
      }

      sceneAnima.update();

      sceneAnima.renderer.render(sceneAnima.scene, sceneAnima.camera);
    }

    animate();
  }

  // 组件销毁
  componentWillUnmount() {
    if (this.timer || this.timeOuter) {
      clearInterval(this.timer);
      clearTimeout(this.timeOuter);
    }
    window.addEventListener('resize', () => {});
  }

  handleResizeChange() {
    this.handleResizeChange = debounce(() => {
      if (this.liquidHeliumChart) {
        this.liquidHeliumChart.resize();
      }
    }, 80);
  }

  render() {
    return (
      <div className="vertical-bar-chart">
        <canvas
          className="model-canvas"
          id="c"
          ref={(c) => (this.canvas = c)}
        ></canvas>
      </div>
    );
  }
}
export default MachineModel;
