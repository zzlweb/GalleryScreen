import React, { Component } from 'react';
import Histogram from '@/components/HistogramChart';
import { Row, Col } from 'antd';
import './index.less';
export default class HistogramChart extends Component {
  state = {};

  render() {
    return (
      <div>
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" xs={24} md={24} lg={12}>
            <Histogram
              type={'LineChartSimple'}
              option={{
                data: [26, 78, 2, 11, 12, 194, 33, 106],
              }}
            ></Histogram>
          </Col>
          <Col className="gutter-row" xs={24} md={24} lg={12}>
            <Histogram
              type={'HistogramChartGradient'}
              option={{
                data: [20, 80, 100, 40, 34, 90, 60],
                xLabel: ['A', 'B', 'C', 'D', 'E'],
              }}
            ></Histogram>
          </Col>
          <Col className="gutter-row" xs={24} md={24} lg={12}>
            <Histogram
              type={'HistogramChartStack'}
              option={{
                data1: [40, 60, 20, 85, 50, 30],
                data2: [50, 40, 15, 50, 40, 30],
                xLabel: ['1月', '2月', '3月', '4月', '5月', '6月'],
              }}
            ></Histogram>
          </Col>
        </Row>
      </div>
    );
  }
}
