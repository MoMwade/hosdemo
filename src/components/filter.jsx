import { useState } from "react";
import TextBox from "./TextBox";
import { DatePicker, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import 'moment/dist/locale/zh-cn';

const { RangePicker } = DatePicker;
const Filter = () => {
  const [filterText, setFilterText] = useState("");
  const [orderFor, setOrderFor] = useState("");
  const [orderType, setOrderType] = useState("");
    return (
        <div className="flex justify-between flex-wrap">
          <TextBox
            value={filterText}
            setValue={setFilterText}
            label="微信订单号"
            className="w-[30%]"
          ></TextBox>
          <TextBox
            value={orderFor}
            setValue={setOrderFor}
            label="订单号"
            className="w-[30%]"
          ></TextBox>
          <TextBox
            value={orderType}
            setValue={setOrderType}
            label="订单类型"
            className="w-[30%]"
          ></TextBox>
          <TextBox
            value={orderType}
            setValue={setOrderType}
            label="时间"
            className="w-[50%]"
          >
            <Space direction="vertical" size={12}>
              <RangePicker showTime locale={zhCN}  renderExtraFooter={() => '请选择日期'} />
            </Space>
          </TextBox>
          <div className="w-[48%]">
            <Button type="primary" icon={<SearchOutlined />} className="mr-[20px]">搜索</Button>
            <Button>重置</Button>
          </div>
        </div>
    );
}

export default Filter;