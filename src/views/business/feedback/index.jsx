import { useEffect, useState } from "react";
import {  Button, Table } from "antd";
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import 'moment/dist/locale/zh-cn'
import CommonHeader from "@/components/CommonHeader";
import CommonStatusbar from "@/components/CommonStatusbar";
import { getBusinessFeedbackList } from "@/service";
const Feedback = () => {
  // const [operlogData, setOperlogData] = useState()
  const [loading, setLoading] = useState(false)
  // const [operIds, setOperIds] = useState()
  const [title, setTitle]  = useState('')
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['8', '16', '24', '32'],
      locale: {
        items_per_page: '/页',
        jump_to: '跳至',
        jump_to_confirm: '确认',
        page: '页',
      }
    },
  });

  const columns = [
    { title: 'ID', dataIndex: 'ID', key: 'ID', width:100, align: 'center', fixed:'left' },
    { title: '用户ID', dataIndex: 'userId', key: 'userId', width:120, align: 'center' },
    { title: '提交时间', dataIndex: 'time', key: 'time', width:100, align: 'center' },
    { title: '建议内容', dataIndex: 'content', key: 'content', width:120, align: 'center' },
    { title: '操作', dataIndex: 'oper', key: 'oper', width:100, align: 'center', render: (text, record) => <Button type="link" icon={<EyeOutlined />}>详情</Button> },
  ];

  const getFeedback = () => {
    setLoading(true)
    getBusinessFeedbackList().then(res => {
      console.log(res);
      setLoading(false)
    })
  }
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      // setOperIds(selectedRowKeys.join(','))
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    console.log('pagination', pagination);
  };

  useEffect(()=> {
    getFeedback()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
      <CommonHeader
        theme="建议内容"
        bindValue={title}
        bindChangeValue={setTitle}
        eventSearch={() => getFeedback()}
        eventResetting={getFeedback}
        className="mb-[15px] w-[555px]"
      />
      <CommonStatusbar>
        <Button danger icon={<DeleteOutlined />} >删除</Button>
      </CommonStatusbar>
      <Table
          locale={zhCN}
          className="mt-[20px]"
          columns={columns}
          // dataSource={operlogData} 
          rowSelection={{type:"checkbox",...rowSelection}}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          loading={loading}
          scroll={{ x: 1000 }}
          bordered
        />
    </div>
  );
}

export default Feedback;