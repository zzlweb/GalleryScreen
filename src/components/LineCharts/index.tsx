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

    if (this.myChart) {
      this.myChart.setOption(this.option);
      window.addEventListener('resize', () => this.handleResizeChange());
    }
  }

  handleChartOption = () => {
    switch (this.props.type) {
      case 'LineChartSimple':
        this.option = drawChart.LineChartSimple(this.props.option);
        break;
      case 'StackedLine':
        this.option = drawChart.StackedLine(this.props.option);
        break;
      default:
        this.option = drawChart.LineChartSimple({
          XData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          YData: [150, 230, 224, 218, 135, 147, 260],
        });
    }
  };

  handleResizeChange() {
    this.handleResizeChange = throttle(() => {
      if (this.myChart) {
        this.myChart.resize();
      }
    }, 100);
  }

  componentDidUpdate(pre) {
    if (this.props.type === 'StackedLine') {
      this.handleChartOption();
      this.myChart.setOption(this.option);
    }
  }

  componentWillUnmount() {
    this.myChart.dispose();
    window.addEventListener('resize', () => {});
  }

  render() {
    return <div ref={this.Ref} className="ChartDom"></div>;
  }
}
