import React, { Component, useState, useEffect } from 'react';
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
  Popconfirm,
  Typography,
} from 'antd';
import './index.less';
import { connect } from 'dva';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = (props) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      desc: '',
      url: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...props.originData];
      const index = newData.findIndex((item) => id === item.id);

      if (index > -1) {
        // 更新item
        props.changeList(row, index);
        setEditingKey('');
      } else {
        props.changeList(row);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const deleteList = (id) => {
    props.delData(id);
  };

  const columns = [
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      editable: true,
    },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      editable: true,
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags) => (
        <>
          {tags &&
            tags.map((tag) => {
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
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Typography.Link>
            <Popconfirm
              title="确定取消吗?"
              cancelText="取消"
              okText="确定"
              onConfirm={cancel}
            >
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            编辑
          </Typography.Link>
        );
      },
    },
    {
      title: '删除',
      key: 'del',
      render: (text, record) => {
        return (
          <Typography.Link onClick={() => deleteList(record.id)}>
            删除
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        loading={props.loading}
        dataSource={props.originData}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

@connect(({ table, loading }) => ({
  ...table,
  loading,
}))
export default class TableState extends Component {
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

  //删除
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

  // 修改
  changeList = (row, index) => {
    this.props.dispatch({
      type: 'table/changeList',
      payload: {
        row,
        index,
      },
    });
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
    const { loading, TableList } = this.props;
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
        <EditableTable
          originData={TableList}
          delData={this.deleteList}
          loading={isLoading}
          changeList={this.changeList}
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
