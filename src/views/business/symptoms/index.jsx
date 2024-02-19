import { useState, useRef, useEffect } from "react";
import { Button, Modal, Form, Input, Select, Table, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CommonHeader from "@/components/CommonHeader";
import CommonStatusbar from "@/components/CommonStatusbar";
import { geBusinessSymptomsAdd, getSymptomsList } from "@/service";

const Symptoms = () => {
    const [symptoms, setSymptoms] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectValue, setSelectValue] = useState("");
    const [selectPart, setSelectPart] = useState();
    const [symptomsValue, setsymptomsValue] = useState("");
    const [symptomsList, setSymptomsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 8,
      },
    });
    const node = useRef(null);
    const optionSex = [
      { value: '2', label: '全部'},
      { value: '1', label: '男'},
      { value: '0', label: '女'}
    ]
    const optionParts = [
      { value: 10024, label: '头颅'},
      { value: 10032, label: '胸部'},
      { value: 10030, label: '四肢脊柱'},
      { value: 10052, label: '颈部'},
      { value: 10053, label: '皮肤'},
      { value: 10035, label: '背部'},
      { value: 10029, label: '腰子'},
      { value: 10054, label: '臀部'},
      { value: 10037, label: '生殖系统'}
    ]

    const columns = [
      {
        title: 'ID',
        dataIndex: 'key',
      },
      {
        title: '症状',
        dataIndex: 'symptoms',
      },
      {
        title: '身体部位',
        dataIndex: 'parts',
      },
      {
        title: '适用性别',
        dataIndex: 'sex',
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (_, record) => (
          <Space size="middle" className="w-[100px]">
            <Button type="link" icon={<EditOutlined />}>编辑伴随症状</Button>
            <Button type="link" icon={<EditOutlined />}>编辑</Button>
            <Button type="link" icon={<DeleteOutlined />}>删除</Button>
          </Space>
        ),
      },
    ]

    const PartsFilter = (value) => {
      const filter = optionParts.filter(item => item.value === value)
      return filter[0]?.label || ''
    }
    const getList = () => {
      setLoading(true); 
      getSymptomsList({PageSize:999,Symptom:symptoms}).then(res=>{
        const Data = res.data.data.result.map(item => {
          return {
            key: item.id,
            symptoms: item.symptom,
            parts: PartsFilter(item.partId),
            sex: item.sex === '1' ? '男' : item.sex === '0' ? '女' : '全部',
          }
        })
        setSymptomsList(Data);
        setLoading(false);
      })
    }
    const handleSearch = () => {
      getList()
      setSymptoms("")
    }
    const handleResetting = () => { 
      getList()
    }
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
    };
    const handleAdding = () => {
      setIsModalOpen(true);
    }
    const handle = () => {
      setIsModalOpen(false);
    };
    const validate = () => { 
      node.current.validateFields().then(()=>{
        // console.log(selectValue,selectPart,symptomsValue);
        geBusinessSymptomsAdd({
          id:0,
          partId: selectPart,
          sex: selectValue,
          symptom: symptomsValue
        }).then(()=>{
          handle()
          getList()
        })
      })
    }
    const handleTableChange = (pagination, filters, sorter) => {
      setTableParams({
        pagination,
        filters,
        ...sorter,
      });
  
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        setSymptomsList([]);
      }
    };


    useEffect(()=>{
      getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
      <div>
        <CommonHeader
          theme="症状:"
          bindValue={symptoms}
          bindChangeValue={setSymptoms}
          eventSearch={handleSearch}
          eventResetting={handleResetting}
          className="w-[555px]"
        />
        <CommonStatusbar>
            <Button icon={<PlusOutlined />} className="mr-[10px]" onClick={handleAdding}>新增</Button>
            <Button icon={<EditOutlined />}>修改</Button>
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
              label="适用性别"
              name="sex"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Select
                placeholder="请选择"
                onChange={(value)=> setSelectValue(value)}
                style={{ width: 200 }}
                options={optionSex}
              />
            </Form.Item>
            <Form.Item
              label="身体部位"
              name="parts"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Select
                placeholder="请选择"
                onChange={(value)=> setSelectPart(value)}
                style={{ width: 200 }}
                options={optionParts}
              />
            </Form.Item>
            <Form.Item
              label="症状"
              name="symptomsValue"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Input placeholder="请输入症状" value={symptomsValue} onChange={(e)=> setsymptomsValue(e.target.value) } ></Input>
            </Form.Item>
          </Form>
        </Modal>
        <Table
            className="mt-[20px]"
            columns={columns}
            dataSource={symptomsList}
            rowSelection={{type:"checkbox",...rowSelection}}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            loading={loading}
          />
      </div>
    );
}

export default Symptoms;