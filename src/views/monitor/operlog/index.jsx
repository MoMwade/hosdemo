import { useEffect, useState } from "react";
import { Select, DatePicker, Button, Table } from "antd";
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import 'moment/dist/locale/zh-cn'
import CommonHeader from "@/components/CommonHeader";
import TextBox from "@/components/TextBox";
import CommonStatusbar from "@/components/CommonStatusbar";
import { getMonitorOperlogList, getMonitorOperlogDel, getMonitorOperlogclean } from "@/service";


const Operlog = () => {
    const { RangePicker } = DatePicker;
    const [operlogData, setOperlogData] = useState()
    const [loading, setLoading] = useState(false)
    const [operIds, setOperIds] = useState()
    const [title, setTitle]  = useState('')
    const [operName, setOperName] = useState('')
    const [status, setStatus] = useState('')
    const [businessType, setBusinessType] = useState('')
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
    const optionOperStatus = [
      { value: '0', label: '成功'},
      { value: '1', label: '失败'}
    ]
    const optionOperType = [
      { value: '0', label: '新增'},
      { value: '1', label: '修改'},
      { value: '2', label: '删除'},
      { value: '3', label: '授权'},
      { value: '4', label: '导出'},
      { value: '5', label: '导入'},
      { value: '6', label: '强退'},
      { value: '7', label: '生成代码'},
      { value: '8', label: '清空数据'}
    ]

    const columns = [
      { title: '日志编号', dataIndex: 'operId', key: 'operId', width:100, align: 'center', fixed:'left' },
      { title: '系统模块', dataIndex: 'title', key: 'title', width:120, align: 'center' },
      { title: '请求方式', dataIndex: 'requestMethod', key: 'requestMethod', width:100, align: 'center' },
      { title: '操作人员', dataIndex: 'operName', key: 'operName', width:120, align: 'center' },
      { title: '主机', dataIndex: 'operIp', key: 'operIp', width:150, align: 'center' },
      { title: '操作地点', dataIndex: 'operLocation', key: 'operLocation', width:150, align: 'center' },
      { title: '操作状态', dataIndex: 'status', key: 'status', width:100, align: 'center' },
      { title: '用时', dataIndex: 'elapsed', key: 'elapsed', width:100, align: 'center', render: text => <span className="text-lime-600">{text}ms</span> },
      { title: '日志内容', dataIndex: 'jsonResult', key: 'jsonResult', width:250, align: 'center' },
      { title: '操作日期', dataIndex: 'operTime', key: 'operTime', width:200, align: 'center'},
      { title: '操作', dataIndex: 'oper', key: 'oper', width:100, align: 'center', render: (text, record) => <Button type="link" icon={<EyeOutlined />}>详情</Button> },
    ];

    const getOperlog = async (modules, operator, state, type) => {
      setLoading(true)
      const res = await getMonitorOperlogList({
        pageNum:"1",
        pageSize:"999",
        totalNum:"1",
        totalPageNum:"1",
        title:modules,
        operName:operator,
        status:state,
        businessType:type
      });
      if(res.data.msg === "FAIL") {
        setOperlogData([]);
      } else {
        const Data = res.data.data.result.map(item => {
          return {
              ...item, 
              key: item.operId,
              status: item.status === 0 ? '正常' : '失败'
          }
        });
        setOperlogData(Data);
      }
      
      setLoading(false)
    }
    const rowSelection = {
      onChange: (selectedRowKeys) => {
        setOperIds(selectedRowKeys.join(','))
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
    const OperlogDelete = async function(ids) {
      await getMonitorOperlogDel(ids)
      await getOperlog()
    }

    useEffect(()=> {
      getOperlog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
      <div>
        <CommonHeader
          theme="系统模块"
          bindValue={title}
          bindChangeValue={setTitle}
          eventSearch={() => getOperlog(title, operName, status, businessType)}
          eventResetting={getOperlog}
          className="mb-[15px] w-[1200px]"
          BoxClass ="flex-wrap w-[950px]"
        >
          <TextBox label="操作人员" value={operName} setValue={setOperName}></TextBox>
          <TextBox label="类型">
            <Select
              placeholder="操作类型"
              size="large"
              style={{ width: 120 , marginLeft: 30}}
              onChange={(value)=> setBusinessType(value)}
               options={optionOperType}
            ></Select>
          </TextBox>
          <TextBox label="状态">
            <Select
              placeholder="操作状态"
              size="large"
              style={{ width: 120 , marginLeft: 30}}
              onChange={(value)=> setStatus(value)}
              options={optionOperStatus}
            ></Select>
          </TextBox>
          <TextBox label="登录时间">
            <RangePicker showTime locale={zhCN}  renderExtraFooter={() => '请选择日期'} size="large" />
          </TextBox>
        </CommonHeader>
        <CommonStatusbar>
            <div className="w-[180px] flex justify-between">
              <Button danger icon={<DeleteOutlined />} onClick={() => OperlogDelete(operIds)}>删除</Button>
              <Button danger icon={<DeleteOutlined />} onClick={ async ()=> {
                await getMonitorOperlogclean()
                await getOperlog()
              }}>清空</Button>
            </div>
        </CommonStatusbar>
        <Table
            locale={zhCN}
            className="mt-[20px]"
            columns={columns}
            dataSource={operlogData}
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

export default Operlog;