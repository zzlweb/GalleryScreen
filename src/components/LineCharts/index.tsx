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
    this.myChart = echarts.init(this.Ref.current);
    switch (this.props.type) {
      case 'LineChartSimple':
        this.option =
          drawChart.LineChartSimple(this.props.option) ||
          drawChart.LineChartSimple({
            XData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            YData: [150, 230, 224, 218, 135, 147, 260],
          });
        break;
      case 'StackedLine':
        this.option =
          drawChart.StackedLine(this.props.option) ||
          drawChart.StackedLine({
            XData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            YData1: [4, 8, 6, 3, 5, 3, 5, 6, 3, 8, 6, 3],
            YData2: [3, 2, 2, 4, 1, 3, 5, 6, 0, 2, 5, 2],
          });
        break;
      default:
        this.option = drawChart.LineChartSimple({
          XData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          YData: [150, 230, 224, 218, 135, 147, 260],
        });
    }
    this.myChart.setOption(this.option);
    if (this.myChart) {
      window.addEventListener('resize', () => this.handleResizeChange());
    }
  }

  handleResizeChange() {
    this.handleResizeChange = throttle(() => {
      if (this.myChart) {
        this.myChart.resize();
      }
    }, 100);
  }

  componentDidUpdate() {
    if (this.props.type === 'StackedLine') {
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
