import React, { Component } from 'react';
import {
  Table,
  Tag,
  Space,
  message,
  Button,
  Modal,
  Form,
  Input,
  Select,
} from 'antd';
import './index.less';
import { connect } from 'dva';
@connect(({ table, loading }) => ({
  ...table,
  loading,
}))
export default class TableState extends Component {
  constructor(props) {
    super(props);
    this.columns = [
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
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (tags) => (
          <>
            {tags.map((tag) => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick={() => this.ChangeList(record)}>编辑修改</a>
            <a onClick={() => this.deleteList(record.id)}>删除</a>
          </Space>
        ),
      },
    ];
    this.editingKey = '';
    this.setEditingKey = '';
  }

  state = {
    isModalVisible: false,
  };

  componentDidMount() {
    this.queryList();
  }

  // 查
  queryList = () => {
    this.props.dispatch({
      type: 'table/queryList',
    });
  };

  // 删
  deleteList = (id) => {
    this.props
      .dispatch({
        type: 'table/deleteOne',
        payload: id,
      })
      .then(() => {
        message.success('删除成功,更新！');
      });
  };

  // 增
  addList = (payload) => {
    try {
      this.props
        .dispatch({
          type: 'table/addOne',
          payload,
        })
        .then(() => {
          message.success('新增数据成功！');
        })
        .catch(() => {
          message.error('新增数据请求失败！');
        })
        .finally(() => {
          this.setState({
            isModalVisible: false,
          });
        });
    } catch (error) {
      message.error('新增数据请求失败！');
    }
  };

  // 改
  ChangeList = (value) => {
    console.log(value);
  };

  // 模态事件处理
  handleOk = () => {
    // 处理表单校验
    this.formRef.submit();
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  openModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  onFinish = (values) => {
    this.addList(values);
  };

  onFinishFailed(value) {
    message.destroy();
    message.error('校验失败！');
  }

  // select
  handleChange = (value) => {
    setTimeout(() => {
      this.multiSelect.blur();
    }, 50);
  };

  render() {
    const { TableList, loading } = this.props;
    const isLoading = loading.effects['table/queryList'];
    return (
      <div className="wrapTable">
        <Button
          onClick={this.openModal}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          新增数据
        </Button>
        <Table
          columns={this.columns}
          loading={isLoading}
          rowKey="id"
          dataSource={TableList}
        />
        <Modal
          title="新增数据"
          destroyOnClose
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确定"
        >
          <Form
            ref={(c) => (this.formRef = c)}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="描述"
              name="desc"
              rules={[{ required: true, message: '请输入描述!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="链接"
              name="url"
              rules={[{ required: true, message: '请输入链接!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="tags"
              name="tags"
              rules={[{ required: true, message: '请选择标签!' }]}
            >
              <Select
                placeholder="请选择标签!"
                allowClear
                onChange={this.handleChange}
                ref={(c) => (this.multiSelect = c)}
                mode="multiple"
              >
                <Select.Option value="loser">loser</Select.Option>
                <Select.Option value="loser2">loser1</Select.Option>
                <Select.Option value="loser3">loser2</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
