import React, { Component } from 'react';
import { Table, Tag, Space } from 'antd';
import { connect } from 'dva';
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '描述',
    dataIndex: 'desc',
  },
  {
    title: '链接',
    dataIndex: 'url',
  },
];
@connect(({ table, loading }) => ({
  ...table,
  loading,
}))
export default class TableState extends Component {
  componentDidMount() {
    this.queryList();
  }

  queryList() {
    this.props.dispatch({
      type: 'table/queryList',
    });
  }

  render() {
    const { TableList, loading } = this.props;

    const isLoading = loading.effects['table/queryList'];
    return (
      <div>
        <Table
          columns={columns}
          loading={isLoading}
          rowKey="id"
          dataSource={TableList}
        />
      </div>
    );
  }
}
