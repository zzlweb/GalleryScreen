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
              option={{
                data: [26, 78, 2, 11, 12, 194, 33, 106],
              }}
            ></Histogram>
          </Col>
          <Col className="gutter-row" xs={24} md={24} lg={12}></Col>
          <Col className="gutter-row" xs={24} md={24} lg={12}></Col>
        </Row>
      </div>
    );
  }
}
