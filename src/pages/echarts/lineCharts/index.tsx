import React, { Component } from 'react';
import Line from '@/components/LineCharts';
import { Row, Col } from 'antd';
import './index.less';
export default class LineChart extends Component {
  render() {
    return (
      <div>
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" xs={24} md={24} lg={8}>
            <Line
              type="LineChartSimple"
              option={{
                XData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                YData: [150, 230, 260, 218, 100, 200, 260],
              }}
            ></Line>
          </Col>
          <Col className="gutter-row" xs={24} md={24} lg={8}></Col>
          <Col className="gutter-row" xs={24} md={24} lg={8}></Col>
        </Row>
      </div>
    );
  }
}
