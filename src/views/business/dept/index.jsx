import { useState, useRef, useEffect } from "react";
import { Button, Modal, Form, Input, Select,  Table, Space } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReactQuill from "react-quill";
import CommonHeader from "@/components/CommonHeader";
import TextBox from "@/components/TextBox";
import CommonStatusbar from "@/components/CommonStatusbar";
import { geBusinessDeptAdd, getDeptList } from "@/service";
const Dept = () => {
    const [Deptcode, setDeptCode] = useState("");
    const [Deptname, setDeptName] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortId, setSortId] = useState(0);
    const [inputDeptname, setInputDeptname] = useState("");
    const [inputdeptType, setInputdeptType] = useState("");
    const [QuillValue, setQuillValue] = useState("")
    const [loading, setLoading] = useState(false);
    const [deptData, setDeptData] = useState([]);
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 8,
      },
    });
    const node = useRef(null);
    const optionDeptType = [
      { value: '0', label: '普通' },
      { value: '1', label: '急诊' },
      { value: '2', label: '特需' },
    ]
    const modules = {
      toolbar: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ header: [1, 2, false] }],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["clean"],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }]
      ]
    };
    const columns = [
      {
        title: 'ID',
        dataIndex: 'key',
      },
      {
        title: '科室代码',
        dataIndex: 'deptCode',
      },
      {
        title: '科室名称',
        dataIndex: 'deptName',
      },
      {
        title: '科室位置',
        dataIndex: 'position',
      },
      {
        title: '排序ID',
        dataIndex: 'orderNum',
      },
      {
        title: '科室类型',
        dataIndex: 'deptType',
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (_, record) => (
          <Space size="middle" className="w-[100px]">
            <Button type="link" icon={<EditOutlined />}>编辑</Button>
            <Button type="link" icon={<DeleteOutlined />}>删除</Button>
          </Space>
        ),
      },
    ]

    const getDeptlistData = () => {
      setLoading(true)
      getDeptList({
        PageSize:999,
        DeptCode:Deptcode,
        DeptName:Deptname,
      }).then(res => {
        const Data = res.data.data.result.map(item => {
          return {
            key: item.id,
            deptCode: item.deptCode,
            deptName: item.deptName,
            position: item.position,
            orderNum: item.orderNum,
            deptType: item.deptType === '0' ? "普通" : item.deptType === '1' ? "急诊" : item.deptType === '2' ? "特需" : "其他",

          }
        })
        setDeptData(Data)
        setLoading(false)
      })
    }
    const handle = () => {
      setIsModalOpen(false);
    };
    const validate = () => { 
      node.current.validateFields().then(()=>{
        geBusinessDeptAdd({
          deptCode :inputCode,
          deptName:inputDeptname,
          introduction:QuillValue,
          orderNum:sortId,
          deptType:inputdeptType,
        }).then(res => {
          getDeptlistData()
        })
      })
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
    const handleTableChange = (pagination, filters, sorter) => {
      setTableParams({
        pagination,
        filters,
        ...sorter,
      });
  
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        setDeptData([]);
      }
    };
    const handleSearch = () => {
      getDeptlistData()
      setDeptCode("")
      setDeptName("")
    }
    const handleResetting = () => {
      getDeptlistData()
    }
    useEffect(()=>{
      getDeptlistData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
      <div>
        <CommonHeader 
          theme="科室代码"
          className="w-[888px]"
          bindValue={Deptcode}
          bindChangeValue={setDeptCode}
          eventSearch={handleSearch}
          eventResetting={handleResetting}
        >
          <TextBox 
            label='科室名称'
            className="w-[320px]"
            value={Deptname}
            setValue={setDeptName}
          />
        </CommonHeader>
        <CommonStatusbar>
          <Button icon={<PlusOutlined />} onClick={()=>setIsModalOpen(true)}>新增</Button>
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
              label="科室代码"
              name="DeptCode"
            >
              <Input placeholder="请输入科室代码" value={inputCode} onChange={e => setInputCode(e.target.value)}></Input>
            </Form.Item>
            <Form.Item
              label="科室名称"
              name="DeptName"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Input placeholder="请输入科室名称" value={inputDeptname} onChange={e => setInputDeptname(e.target.value)}></Input>
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
                <Input value={sortId} onChange={(e) => setSortId(Number(e.target.value))} className=" text-center" />
                <Button icon={<PlusOutlined />} onClick={()=> setSortId(Number(sortId)+1)}></Button>
              </div>
            </Form.Item>
            <Form.Item
              label="科室类型"
              name="DeptType"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Select
                placeholder="请选择科室类型"
                value={inputdeptType}
                options={optionDeptType}
                style={{ width: 200 }}
                onChange={(e) => setInputdeptType(e)}
              ></Select>
            </Form.Item>
            <Form.Item
              label="科室介绍"
              name="DeptIntro"
              className="h-[400px]"
            >
              <ReactQuill
                className="h-[300px]"
                theme="snow"
                modules={modules}
                value={QuillValue}
                onChange={(e) => setQuillValue(e)}
              ></ReactQuill>
            </Form.Item>
          </Form>
        </Modal>
        <Table
            className="mt-[20px]"
            columns={columns}
            dataSource={deptData}
            rowSelection={{type:"checkbox",...rowSelection}}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            loading={loading}
          />
      </div>

    );
}

export default Dept;