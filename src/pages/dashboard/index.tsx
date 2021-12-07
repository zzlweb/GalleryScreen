import React, { Component } from 'react';
import * as THREE from 'three';
import { throttle } from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CITY from './cityConfig.js';
import { handleResize } from '@/utils/ThreeUtils';
import './index.less';
class Dashboard extends Component {
  constructor(props) {
    // 执行父类的构造函数
    super(props);
    this.canvas = null;
    this.cityScene = null;
  }

  DrawModel = () => {
    const that = this;
    this.cityScene = new CITY({
      model: '/static/city/shanghai.FBX',
      canvasDom: that.canvas,
    });

    function modelAnimate() {
      window.requestAnimationFrame(modelAnimate);
      that.cityScene.renderer.render(
        that.cityScene.scene,
        that.cityScene.camera,
      );
    }
    modelAnimate();
  };

  // 挂载
  componentDidMount() {
    const that = this;
    this.DrawModel();
    window.addEventListener('resize', () => {
      that.cityScene &&
        handleResize(
          '.city-box',
          that.cityScene.renderer,
          that.cityScene.camera,
        );
    });
  }

  // 卸载
  componentWillUnmount() {
    window.removeEventListener('resize', () => {});
  }

  render() {
    return (
      <div className="city-box">
        <canvas id="city" ref={(city) => (this.canvas = city)}></canvas>
      </div>
    );
  }
}

export default Dashboard;
