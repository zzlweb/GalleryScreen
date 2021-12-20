import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { withRouter, Link } from 'umi';
import { leftMenus } from './config.js';
class Bread extends Component {
  constructor() {
    super();

    this.UNLISTEN = null;
  }

  state = {
    breadcrumbArr: [],
  };

  componentDidMount() {
    this.writeBreadcrumb();
    this.UNLISTEN = this.props.history.listen((route) => {
      // 监听
      this.writeBreadcrumb();
    });
  }

  componentWillUnmount() {
    // 取消事件监听
    this.UNLISTEN && this.UNLISTEN();
  }

  writeBreadcrumb = () => {
    const pathname = this.props.location.pathname;

    const arr = [];

    leftMenus.forEach((item) => {
      // 说明是一级菜单
      if (item.path === pathname) {
        arr.push(item);
      } else {
        // 说明是二级菜单
        item.child &&
          item.child.forEach((it) => {
            if (it.path === pathname) {
              arr.push({
                path: undefined,
                name: item.name,
                key: item.key,
              });
              arr.push({
                path: it.path,
                name: it.name,
              });
            }
          });
      }
    });

    this.setState({
      breadcrumbArr: arr ? arr : [],
    });
  };

  //页面的地址更新后调用写面包屑的方法

  render() {
    const { breadcrumbArr } = this.state;
    return (
      <div className="breadCrumb">
        <Breadcrumb>
          <Breadcrumb.Item href={'/'}>首页</Breadcrumb.Item>
          {breadcrumbArr &&
            breadcrumbArr.map((item, key) => (
              <Breadcrumb.Item key={key}>
                {item.path ? (
                  <Link to={item.path ? item.path : '/'}>{item.name}</Link>
                ) : (
                  <a>{item.name}</a>
                )}
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>
      </div>
    );
  }
}

export default withRouter(({ history, location }) => {
  return <Bread location={location} history={history}></Bread>;
});
