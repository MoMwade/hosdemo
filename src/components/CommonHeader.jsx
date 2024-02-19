import { Button } from 'antd';
import TextBox from "@/components/TextBox"
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
const CommonHeader = (props) => {
    return (
        <div className={`${props.className} flex justify-between flex-wrap`}>
          <div className={`${props.hybrid ? "hidden" : "block"} ${props.BoxClass} flex justify-between`}>
            <TextBox value={props.bindValue} setValue={props.bindChangeValue} label={props.theme} className="max-w-[320px]" />
            {props.children}
          </div>
          <div>
            <Button type="primary" icon={<SearchOutlined />} size="large" className='mr-[20px]' onClick={props.eventSearch}>搜索</Button>
            <Button icon={<SyncOutlined />} size="large" onClick={()=> props.eventResetting()}>重置</Button>
          </div>
        </div>
    )
}

export default CommonHeader;

