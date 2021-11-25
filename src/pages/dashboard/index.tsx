import React, { Component } from 'react';
import * as THREE from 'three';
import { throttle } from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CITY from './cityConfig.js';
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
    let cityScene = new CITY({
      model: '/static/city/shanghai.FBX',
      canvasDom: that.canvas,
    });

    this.cityScene = cityScene;

    function modelAnimate() {
      window.requestAnimationFrame(modelAnimate);
      cityScene.renderer.render(cityScene.scene, cityScene.camera);
    }
    modelAnimate();
  };

  // 挂载
  componentDidMount() {
    const that = this;
    this.DrawModel();
    window.addEventListener('resize', () => {
      that.cityScene.handleResize(that.cityScene.renderer);
    });
  }

  // 卸载
  componentWillUnmount() {
    window.removeEventListener('resize', null);
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
