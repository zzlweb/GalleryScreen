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
    if (this.state.assertID > 11) {
      this.setState({
        assertID: 1,
        YData1: [4, 8],
        YData2: [3, 2],
      });
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
          <Col className="gutter-row" xs={24} md={24} lg={12}>
            <Line
              type="LineChartSimple"
              option={{
                XData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                YData: [150, 230, 260, 218, 100, 200, 260],
              }}
            ></Line>
          </Col>
          <Col className="gutter-row" xs={24} md={24} lg={12}>
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
          <Col className="gutter-row" xs={24} md={24} lg={12}>
            <Line
              type="StackedLineTooltip"
              option={{
                XData: [
                  '2020/7/6 2:00',
                  '2020/7/6 8:00',
                  '2020/7/6 14:00',
                  '2020/7/6 20:00',
                  '2020/7/7 2:00',
                  '2020/7/7 8:00',
                  '2020/7/7 14:00',
                  '2020/7/7 20:00',
                  '2020/7/8 2:00',
                  '2020/7/8 8:00',
                  '2020/7/8 14:00',
                  '2020/7/9 2:00',
                  '2020/7/9 8:00',
                  '2020/7/9 14:00',
                ],
                WTData: [
                  15, 13.4, 11.5, 13.3, 12.3, 12.9, 11.9, 13.4, 14.7, 14.6,
                  13.3, 13.4, 14.9, 15,
                ],
                PWRTData: [
                  16.4, 14.9, 12.9, 14.4, 13.4, 13.9, 13.4, 14.9, 15.9, 15.9,
                  14.4, 14.9, 16.4, 16.4,
                ],
                CFCTData: [
                  14.7, 14.8, 14.8, 14.7, 14.7, 14.7, 14.8, 14.8, 14.6, 14.6,
                  14.8, 14.9, 14.5, 14.6,
                ],
                RFPAWRTData: [
                  20.6, 20.6, 20.6, 15.6, 20.6, 20.6, 18.6, 20.6, 20.6, 20.6,
                  20.6, 20.6, 20.4, 20.3,
                ],
                GPATData: [
                  22.6, 22.6, 22.6, 22.4, 22.6, 22.4, 22.6, 22.6, 22.6, 22.6,
                  22.4, 22.4, 22.4, 22.3,
                ],
              }}
            ></Line>
          </Col>
        </Row>
      </div>
    );
  }
}
