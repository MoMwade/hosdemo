import { Button } from 'antd';
import { SearchOutlined, SyncOutlined} from '@ant-design/icons';
const CommonStatusbar = (props) => {
    return(
        <div className="flex justify-between">
          <div>
            { props.children }
          </div>
          <div>
            <Button shape="circle" icon={<SearchOutlined />} className="mr-[10px]"></Button>
            <Button shape="circle" icon={<SyncOutlined />}></Button>
          </div>
        </div>
    )
}

export default CommonStatusbar;