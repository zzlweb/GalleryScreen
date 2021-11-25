import React, { Component } from 'react';
import { Menu, Button } from 'antd';
import { withRouter, Link } from 'umi';
import { leftMenus } from './config.js';
const MenuItem = Menu.Item;
const { SubMenu } = Menu;

class ChartLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTitle: '可视化展示',
      img: null,
    };
  }

  componentDidMount() {
    const title = this.handleRoute(
      this.props.route.routes,
      this.props.location.pathname,
    );
    if (title) {
      this.setState({
        pageTitle: title,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const title = this.handleRoute(
      this.props.route.routes,
      nextProps.location.pathname,
    );
    if (title) {
      this.state.pageTitle = title;
    }
    return true;
  }

  handleRoute = (routes, key) => {
    let temp = '可视化展示';
    if (routes && routes.length > 0) {
      routes.map((item) => {
        if (item.path == key) {
          temp = item.title;
        }
      });
    }
    return temp;
  };

  renderMenus = () => {
    const { location } = this.props;
    // console.log('location', location)

    const sideMenus = leftMenus.map((item) => {
      if (item.child?.length > 0) {
        return (
          <SubMenu title={item.name} key={item.key}>
            {item.child.map((itm) => (
              <MenuItem key={itm.path}>
                <Link to={itm.path}>
                  <span className="left-component">{itm.component}</span>
                  <span className="right-name">{itm.name}</span>
                </Link>
              </MenuItem>
            ))}
          </SubMenu>
        );
      } else {
        return (
          <MenuItem key={item.path}>
            <Link to={item.path}>
              <span className="left-component">{item.component}</span>
              <span className="right-name">{item.name}</span>
            </Link>
          </MenuItem>
        );
      }
    });

    return (
      <Menu
        multiple
        inlineIndent={20}
        mode="inline"
        selectedKeys={[location.pathname]}
      >
        {sideMenus}
      </Menu>
    );
  };

  render() {
    const { pageTitle, img } = this.state;

    return (
      <div className="basic-layout flex-col">
        <div className="layout-header flex-row">
          <Link
            className="left-logo left-container flex-row"
            to="/"
            id="logo-container"
          >
            <img
              className="logo"
              src={require('../../../public/image/logo.svg')}
            />
            {/* 可视化展示 */}
          </Link>

          <div className="fill-flex center-title" id="step-two">
            {pageTitle}
          </div>
        </div>
        <div className="content-container fill-flex flex-row">
          <div className="left-container">{this.renderMenus()}</div>
          {img && <img src={img} />}
          <div className="fill-flex right-container">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
export default ChartLayout;
