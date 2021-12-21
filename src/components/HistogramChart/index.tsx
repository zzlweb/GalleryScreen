import React, { Component } from 'react';
import * as echarts from 'echarts';
import drawChart from './HistogramChart';
import { throttle } from 'lodash';
export default class Line extends Component {
  constructor(props) {
    super(props);
    this.Ref = React.createRef();
    this.myChart = null;
    this.option = null;
    this.timer = null;
    this.len = 0;
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

    if (this.props.type === 'HistogramChartStack') {
      this.Interval();
    }
  }

  Interval = () => {
    this.timer = setInterval(() => {
      if (this.len === 6) {
        this.len = 0;
      }
      this.myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: this.len,
      });
      this.len++;
    }, 2000);
  };

  // 初始化获取option
  handleChartOption = () => {
    switch (this.props.type) {
      case 'LineChartSimple':
        this.option = drawChart.HistogramChartBase(this.props.option);
        break;
      case 'HistogramChartGradient':
        this.option = drawChart.HistogramChartGradient(this.props.option);
        break;
      case 'HistogramChartStack':
        this.option = drawChart.HistogramChartStack(this.props.option);
        break;
      default:
        return;
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

  componentDidUpdate() {
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
    // 清除
    clearInterval(this.timer);
  }

  render() {
    return <div ref={this.Ref} className="ChartDom"></div>;
  }
}
