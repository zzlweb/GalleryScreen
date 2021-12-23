import React, { Component } from 'react';
import * as echarts from 'echarts';
import drawChart from './pieChartConfig.js';
import { throttle } from 'lodash';

export default class Pie extends Component {
  constructor(props) {
    super(props);
    this.Ref = React.createRef();
    this.myChart = null;
    this.option = null;
  }
  componentDidMount() {
    // 初始化图表
    this.myChart = echarts.init(this.Ref.current);
    this.handleChartOption();

    // 监听resize
    if (this.myChart) {
      this.myChart.setOption(this.option);
      window.addEventListener('resize', () => this.handleResizeChange());
    }
  }

  // 初始化获取option
  handleChartOption = () => {
    switch (this.props.type) {
      case 'base':
        this.option = drawChart.PieConfig(this.props.option);
        break;
        return;
    }
  };

  // 处理resize
  handleResizeChange() {
    if (this.props.type === 'base') {
      this.handleChartOption();
      this.myChart.setOption(this.option);
    }

    this.myChart.resize();
  }

  componentDidUpdate(pre) {
    if (this.props.type === 'StackedLine') {
      // 更新option
      this.handleChartOption();
      this.myChart.setOption(this.option);
    }
  }

  componentWillUnmount() {
    // 销毁图表
    this.myChart.dispose();
    // 清除resize
    window.addEventListener('resize', () => {});
  }

  render() {
    return <div ref={this.Ref} className="ChartDom"></div>;
  }
}
