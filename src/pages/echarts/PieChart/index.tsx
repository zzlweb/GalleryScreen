import React, { Component } from 'react';
import Pie from '@/components/pieChart';
import { Row, Col } from 'antd';
import './index.less';
export default class LineChart extends Component {
  state = {};

  render() {
    return (
      <div>
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" xs={24} md={24} lg={12}>
            <Pie
              type="base"
              option={{
                val: 87,
                pieColor: '#6287ff',
                bgColor: '#e7e7e7',
              }}
            ></Pie>
          </Col>
        </Row>
      </div>
    );
  }
}
