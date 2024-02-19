import { useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Select, Slider, Upload, message, Table, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import CommonHeader from "@/components/CommonHeader";
import CommonStatusbar from "@/components/CommonStatusbar";
import { getFoordataList, geBusinessFoordataAdd } from '@/service';
import useUserStore from '@/store/user';
import { v4 as uuidv4 } from "uuid"
import axios from "axios";
import FormDate from '@/hooks/useFormDate';

const Flooredit = () => {
    const UserStore = useUserStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [sliderValue, setSliderValue]= useState(1);
    const [loading, setLoading] = useState(false);
    const [FoorlistLoading, setFoorlistLoading] = useState(false);
    const [FloorData, setFloorData] = useState([]);
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 8,
      },
    });
    const [Url, setUrl] = useState('');
    const node = useRef(null);
    const optionName = [
      { label: '门诊大楼', value: "0" },
      { label: '住院部', value: "1" },
      { label: '急诊部', value: "2" },
      { label: '医技楼', value: "3" },
      { label: '手术科', value: "4" },
      { label: '放射科', value: "5" },
      { label: '门诊药房', value: "6" },
      { label: '住院药房', value: "7" },
      { label: '供应室', value: "8" },
      { label: '检验科', value: "9" },
      { label: '超声科', value: "10" },
      { label: '病理科', value: "11" },
      { label: 'PACS', value: "12" },
      { label: '心电图室', value: "13" },
      { label: 'CT室', value: "14" },
      { label: 'MR室', value: "15" },
      { label: 'PET室', value: "16" },
      { label: '核医学科', value: "17" },
      { label: '功能检查科', value: "18" },
      { label: '内镜中心', value: "19" },
      { label: '介入放射科', value: "20" },
      { label: '超声诊断中心', value: "21" },
      { label: '医学影像诊断中心', value: "22" },
    ]
    const columns = [
      {
        title: 'ID',
        dataIndex: 'key',
      },
      {
        title: '建筑物名',
        dataIndex: 'building',
      },
      {
        title: '楼层',
        dataIndex: 'floor',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space size="middle" className="w-[100px]">
            <Button type="link" icon={<EditOutlined />}>坐标数据</Button>
            <Button type="link" icon={<EditOutlined />}>编辑</Button>
            <Button type="link" icon={<DeleteOutlined />}>删除</Button>
          </Space>
        ),
      },
    ];

    const getFoorList = () => {
      setFoorlistLoading(true)
      getFoordataList({PageSize:999}).then(res => {
        console.log(res);
        const Data = res.data.data.result.map(item => {
          return {
            key: item.id,
            building: FoorFilter(item.building),
            floor: item.floor,
            create_time: item.create_time,
          }
        })
        setFloorData(Data)
        setFoorlistLoading(false)
      })
    }
    const FoorFilter = function(Arr){
      const filter =  optionName.filter(item => Number(item.value) === Number(Arr))
      return filter[0]?.label || ''
    }
    const getFoordata = () => {
      geBusinessFoordataAdd({
        building: selectedOption,
        floor: sliderValue,
        planurl:Url,
      }).then(res => {
        console.log(res);
      })
    }
    const handle = () => {
      setIsModalOpen(false);
    };
    const validate = () => {
      node.current.validateFields().then(()=>{
        getFoordata()
        getFoorList()
        handle()
      })
    }
    const beforeUpload = (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    };
    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        // console.log(token);
        const form = FormDate({
          key: uuidv4(),
          file: info.file.originFileObj,
          token: UserStore.user.token.uploadToken
        })
        axios.post("https://upload-z2.qiniup.com",form).then(res => {
          setUrl(`${UserStore.user.token.baseURL}${res.data.key}`)
        })
      }
    };
    const normFile = (e) => {
      if(Array.isArray(e))
      return e;
      return e && e.fileList;
    }
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
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
        FloorData([]);
      }
    };

    useEffect(()=>{
      getFoorList()
      UserStore.getRequestToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const uploadButton = (
      <button
        style={{
          border: 0,
          background: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          padding: 0,
          height: '100%',
          width: '100%',
        }}
        type="button"
      >
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div
            style={{
              marginTop: 8,
            }}
          >
            Upload
          </div>
        </div>
      </button>
    );
    
    return (
      <div>
        <CommonHeader hybrid className='mb-[20px]' />
        <CommonStatusbar>
          <div className='w-[265px] flex justify-between'>
            <Button type="primary" icon={<PlusOutlined />} onClick={()=> setIsModalOpen(true)}>新增</Button>
            <Button icon={<EditOutlined />} >修改</Button>
            <Button type="primary" danger icon={<DeleteOutlined />}>删除</Button>
          </div>
        </CommonStatusbar>
        <Modal title="添加" open={isModalOpen} onOk={validate} onCancel={handle} okText="确定" cancelText="取消">
          <Form
            name="wrap"
            ref={node}
            labelCol={{
              flex: '110px',
            }}
            labelAlign="left"
            labelWrap
            wrapperCol={{
              flex: 1,
            }}
            colon={false}
            style={{
              maxWidth: 600,
            }}
            onFinish={validate}
          >
            <Form.Item
              label="建筑物名"
              name="buildingName"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Select
                placeholder="请选择"
                value={selectedOption}
                onChange={(value)=> setSelectedOption(value)}
                style={{ width: 200 }}
                options={optionName}
              />
            </Form.Item>
            <Form.Item
              label="楼层"
              name="floor"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
              initialValue={sliderValue}
            >
              <div style={{display: 'inline-block',height: 100}}>
                <Slider min={1} max={10} vertical onChange={(e)=>setSliderValue(String(e))} />
              </div>
            </Form.Item>
            <Form.Item
              label="平面图"
              name="plan"
              valuePropName='fileList'
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                <div className='w-[100%] h-[100%] overflow-hidden'>
                  {Url ? (
                    <img
                      src={Url}
                      className='w-[100%] h-[100%] object-cover'
                      alt="avatar"
                      style={{
                        width: '100%',
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </div>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
        <Table
            className="mt-[20px]"
            columns={columns}
            dataSource={FloorData}
            loading={FoorlistLoading}
            pagination={tableParams.pagination}
            rowSelection={{type:"checkbox",...rowSelection}}
            onChange={handleTableChange}
          />
      </div>
    );
}

export default Flooredit;