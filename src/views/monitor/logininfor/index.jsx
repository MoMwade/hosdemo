import { useEffect, useState } from "react";
import { Select, DatePicker, Button, Table } from "antd";
import { DeleteOutlined, } from '@ant-design/icons';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import 'moment/dist/locale/zh-cn'
import CommonHeader from "@/components/CommonHeader";
import TextBox from "@/components/TextBox";
import CommonStatusbar from "@/components/CommonStatusbar";
import { getMonitorLogininforlist, getMonitorLogininforDel, getMonitorLogininforclean } from "@/service";

const Logininfor = () => {
    const { RangePicker } = DatePicker;
    const [logininforData, setLogininforData] = useState()
    const [loading, setLoading] = useState(false)
    const [infoIds, setInfoIds] = useState()
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 8,
      },
    });
    const columns = [
      { title: '访问编号', dataIndex: 'infoId', key: 'infoId' },
      { title: '用户名称', dataIndex: 'userName', key: 'userName' },
      { title: '登录地址', dataIndex: 'ipaddr', key: 'ipaddr' },
      { title: '登录地点', dataIndex: 'loginLocation', key: 'loginLocation' },
      { title: '浏览器', dataIndex: 'browser', key: 'browser' },
      { title: '操作系统', dataIndex: 'os', key: 'os' },
      { title: '登录状态', dataIndex: 'status', key: 'status' },
      { title: '操作信息', dataIndex: 'msg', key: 'msg' },
      { title: '登录日期', dataIndex: 'loginTime', key: 'loginTime' },
    ];

    const getLogininfor = async () => {
      setLoading(true)
      const res = await getMonitorLogininforlist();
      if(res.data.msg === "FAIL"){
        setLogininforData([]);
      } else {
        const Data = res.data.data.result.map(item => {
          return { ...item, key: item.infoId }
        });
        setLogininforData(Data);
      }
      setLoading(false)
    }
    const rowSelection = {
      onChange: (selectedRowKeys) => {
        setInfoIds(selectedRowKeys.join(', '))
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
  
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        logininforData([]);
      }
    };
    const LogininforDelete = async function(ids) {
      await getMonitorLogininforDel(ids)
      await getLogininfor()
    }

    useEffect(()=> {
      getLogininfor()
    },[])

    return (
      <div>
        <CommonHeader
          theme="登录地址"
          className=" max-w-[1200px] mb-[15px]"
          BoxClass ="min-w-[1200px] flex justify-between"
        >
          <TextBox label="用户名称"></TextBox>
          <TextBox label="状态">
            <Select
              placeholder="登录状态"
              // value={Area}
              // options={optionArea}
              // onChange={(e) => setArea(e)}
              size="large"
              style={{ width: 120 , marginLeft: 30}}
            ></Select>
          </TextBox>
          <TextBox label="登录时间">
            <RangePicker showTime locale={zhCN}  renderExtraFooter={() => '请选择日期'} size="large" />
          </TextBox>
        </CommonHeader>
        <CommonStatusbar>
            <div className="w-[180px] flex justify-between">
              <Button danger icon={<DeleteOutlined />} onClick={() => LogininforDelete(infoIds)}>删除</Button>
              <Button danger icon={<DeleteOutlined />} onClick={ async ()=> {
                await getMonitorLogininforclean()
                await getLogininfor()
              }}>清空</Button>
            </div>
        </CommonStatusbar>
        <Table
            className="mt-[20px]"
            columns={columns}
            dataSource={logininforData}
            rowSelection={{type:"checkbox",...rowSelection}}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            loading={loading}
          />
      </div>
    );
}

export default Logininfor;