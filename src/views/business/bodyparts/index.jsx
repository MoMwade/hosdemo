import { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Input, Table, Space } from 'antd';
import styled from "styled-components";
import { SearchOutlined, SyncOutlined, PlusOutlined, EditOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import TextBox from "@/components/TextBox";
import { getBodypartsList, getBodypartsAdd, getBodypartsDel } from "@/service";

const ButtonSearch = styled(Button)`
    background-color: #25c2b3;
    color: white;
    margin-right: 20px;
    &:hover {
      background-color: #189090 !important;
    }
    &:active {
      background-color: #189090 !important;
    }
`;

const Bodyparts = () => {
    const [bodyPart, setBodyPart] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parts, setParts] = useState("");
    const [sortId, setSortId] = useState(0);
    const node = useRef(null);
    const [bodyData, setBodyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState()
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 8,
      },
    });

    const columns = [
      {
        title: 'ID',
        dataIndex: 'key',
      },
      {
        title: '部位',
        dataIndex: 'bodypart',
      },
      {
        title: '排序ID',
        dataIndex: 'orderNum',
      },
      {
        title: '添加时间',
        dataIndex: 'create_time',
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space size="middle" className="w-[100px]">
            <Button type="link" icon={<EditOutlined />}>编辑</Button>
            <Button type="link" icon={<DeleteOutlined />} onClick={()=>del(record)}>删除</Button>
          </Space>
        ),
      },
    ];


    const getBodyparts = () => {
      setLoading(true);
      getBodypartsList({PageSize:999,Bodypart:bodyPart}).then(res => {
        const Data = res.data.data.result;
        Data.forEach(Item => Item.key=Item.id)
        setBodyData(Data)
        setLoading(false);
      })
    }
    const handle = () => {
      setParts("");
      setSortId("0");
      setIsModalOpen(false);
    };
    const validate = () => {
      node.current.validateFields().then(() => {
        getBodypartsAdd(
          {
            bodypart: parts,
            orderNum: sortId
          }
        ).then(res => {
          console.log(res);
          getBodyparts()
        })
        handle()
      })
    }
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setSelectedRowKeys(selectedRowKeys)
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
        setBodyData([]);
      }
    };
    function del(record){
      getBodypartsDel(selectedRowKeys.join(",")).then(() => getBodyparts())
    }
    
    useEffect(()=>{
      getBodyparts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
      <div>
        <div className="flex justify-between w-[555px]">
          <TextBox value={bodyPart} setValue={setBodyPart} label="部位：" className="w-[320px]"></TextBox>
          <div>
            <ButtonSearch type="primary" icon={<SearchOutlined />} size="large" onClick={()=>{getBodyparts();setBodyPart("");}}>搜索</ButtonSearch>
            <Button icon={<SyncOutlined />} size="large" onClick={()=>{getBodyparts()}}>重置</Button>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <Button icon={<PlusOutlined />} className="mr-[10px]" onClick={()=> setIsModalOpen(true)}>新增</Button>
            <Button icon={<EditOutlined />}>修改</Button>
          </div>
          <div>
            <Button shape="circle" icon={<SearchOutlined />} className="mr-[10px]"></Button>
            <Button shape="circle" icon={<SyncOutlined />}></Button>
          </div>
        </div>
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
              label="部位"
              name="parts"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Input value={parts} onChange={(e) => setParts(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="排序ID"
              name="sortId"
            >
              <div className="flex w-[200px]">
                <Button icon={<MinusOutlined />} onClick={()=> {
                  if(sortId>=1){
                    setSortId(Number(sortId)-1)
                  }
                }}></Button>
                <Input value={sortId} onChange={(e) => setSortId(e.target.value)} className=" text-center" />
                <Button icon={<PlusOutlined />} onClick={()=> setSortId(Number(sortId)+1)}></Button>
              </div>
              
            </Form.Item>
          </Form>
        </Modal>
        <div className="mt-[20px]">
          <Table 
            columns={columns}
            dataSource={bodyData}
            rowSelection={{type:"checkbox",...rowSelection}}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            loading={loading}
            tableLayout="auto"
          />
        </div>
      </div>
    );
}

export default Bodyparts;