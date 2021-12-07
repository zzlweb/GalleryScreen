import React, { Component } from 'react';
import * as echarts from 'echarts';
import drawChart from './LineChartsConfig.js';
import { throttle } from 'lodash';

export default class Line extends Component {
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
      case 'LineChartSimple':
        this.option = drawChart.LineChartSimple(this.props.option);
        break;
      case 'StackedLine':
        this.option = drawChart.StackedLine(this.props.option);
        break;
      case 'StackedLineTooltip':
        this.option = drawChart.StackedLineTooltip(this.props.option);
        break;
      default:
        this.option = drawChart.LineChartSimple({
          XData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          YData: [150, 230, 224, 218, 135, 147, 260],
        });
    }
  };

  // 处理resize
  handleResizeChange() {
    this.handleResizeChange = throttle(() => {
      if (this.myChart) {
        this.myChart.resize();
      }
    }, 100);
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
