import React, { Component } from 'react';
import Line from '@/components/LineCharts';
import { Row, Col } from 'antd';
import './index.less';
export default class LineChart extends Component {
  state = {
    YData1: [4, 8],
    YData2: [3, 2],
    assertID: 1,
  };

  updateStackedLineDate = () => {
    // 一些假数据
    const Data1 = [4, 8, 6, 3, 5, 3, 5, 6, 3, 8, 6, 3, 4, 8];
    const Data2 = [3, 2, 2, 4, 1, 3, 5, 6, 0, 2, 5, 2, 5, 7];
    if (this.state.assertID > 10) {
      clearInterval(this.timer);
    } else {
      this.setState(
        {
          assertID: this.state.assertID + 1,
        },
        () => {
          this.state.YData1.push(Data1[this.state.assertID]);
          this.state.YData2.push(Data2[this.state.assertID]);
        },
      );
    }
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.updateStackedLineDate();
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

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
          <Col className="gutter-row" xs={24} md={24} lg={8}>
            <Line
              type="StackedLine"
              option={{
                XData: [
                  '1月',
                  '2月',
                  '3月',
                  '4月',
                  '5月',
                  '6月',
                  '7月',
                  '8月',
                  '9月',
                  '10月',
                  '11月',
                  '12月',
                ],
                YData1: this.state.YData1,
                YData2: this.state.YData2,
              }}
            ></Line>
          </Col>
          <Col className="gutter-row" xs={24} md={24} lg={8}></Col>
        </Row>
      </div>
    );
  }
}
