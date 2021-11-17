import React, { Component } from 'react';
import { ConfigProvider, Menu } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <p>Data Not Found</p>
  </div>
);
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ConfigProvider locale={zhCN} renderEmpty={customizeRenderEmpty}>
        <>{this.props.children}</>
      </ConfigProvider>
    );
  }
}
export default BasicLayout;
