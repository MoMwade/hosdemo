import { useState, useEffect, useRef } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Radio, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CommonHeader from "@/components/CommonHeader";
import TextBox from "@/components/TextBox";
import CommonStatusbar from "@/components/CommonStatusbar";
import { getSystemDepttreeselect, getSystemDeptlist, getSystemDeptAdd, getSystemDeptDel, getSystemDeptEdit } from '@/service';


const Dept = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Deptdata, setDeptData] = useState([]);
    const [deptLoading, setDeptLoading]= useState([]);
    const [parentId, setParentId]  = useState();
    const [deptName, setDeptName]  = useState();
    const [leader, setLeader]  = useState();
    const [orderNum, setOrderNum] = useState();
    const [status, setStatus] = useState("0");
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [optionDept, setOptionDept] = useState([]);
    const node = useRef(null);
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'deptName',
        key: 'deptName'
      },
      {
        title: '负责人',
        dataIndex: 'leader',
        key: 'leader'
      },
      {
        title: '排序',
        dataIndex: 'orderNum',
        key: 'orderNum'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: '创建时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
          <div className='flex justify-center'>
            <Button type="link" icon={<EditOutlined />} onClick={DeptEdit}>编辑</Button>
            <Button type="link" icon={<PlusOutlined />} onClick={()=> setIsModalOpen(true)}>新增</Button>
            {
              record.deptName === "总院" ? null : <Button type="link" icon={<DeleteOutlined />} onClick={()=>{DeptDelete(record.deptId)}} >删除</Button>
            }
          </div>
        )
      }
    ];

    const getDeptdata = async () => {
      setDeptLoading(true)
      const treeselect = await getSystemDepttreeselect()
      const list = await getSystemDeptlist()
      let res = await treeselect.data.data 
      let listRes = await list.data.data
      const optionData = listRes.map(item=> {
        return {
          value: item.deptId,
          label: item.deptName
        }
      })
      setOptionDept(optionData)
      setDeptData(DeptdataTreeselect(res,listRes));
      setDeptLoading(false)
    }
    const DeptdataTreeselect = function(res,listRes) {
      let routes = [];
        for (let i = 0; i < res.length; i++) {
          // 判断是否存在子级
          listRes.forEach((item,index) => {
            if(res[i].id === item.deptId) {
              routes.push({
                key:index,
                ...item,
                children: (res[i].children).length !== 0 ? DeptdataTreeselect(res[i].children,listRes) : null
              })
            }
          })
        }
        return routes;
    }
    const DeptAdd = async () => {
      const res = await getSystemDeptAdd({
        parentId,
        deptName,
        orderNum,
        leader,
        phone,
        email,
        status,
      })
      console.log(res);
    }
    const handle = () => {
      setIsModalOpen(false);
    };
    const validate = () => {
      node.current.validateFields().then(() => {
        DeptAdd()
        handle()
        getDeptdata()
      })
    }
    const DeptDelete = async function(id) {
      await getSystemDeptDel(id)
      // getDeptdata()
    }
    const DeptEdit = async function() {
      await getSystemDeptEdit()
    }

    useEffect(() => {
      getDeptdata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
      <div>
        <CommonHeader 
          theme="部门名称"
          className="w-[820px]"
          BoxClass="w-[600px]"
        >
          <TextBox label="状态" />
        </CommonHeader>
        <CommonStatusbar>
          <Button type="primary" icon={<PlusOutlined />} onClick={()=> setIsModalOpen(true)}>新增</Button>
        </CommonStatusbar>
        <Table
            className="mt-[20px]"
            columns={columns}
            dataSource={Deptdata}
            loading={deptLoading}
          />
          <Modal title="添加部门" open={isModalOpen} onOk={validate} onCancel={handle} okText="确定" cancelText="取消">
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
              label="上级部门"
              name="parent"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Select
                placeholder="请选择"
                onChange={(value)=> setParentId(value)}
                style={{ width: 200 }}
                options={optionDept}
              />
            </Form.Item>
            <Form.Item
              label="部门名称"
              name="deptName"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <Input value={deptName} onChange={(e) => setDeptName(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="显示排序"
              name="orderNum"
              rules={[
                {
                  required: true,
                  message:'不能为空'
                },
              ]}
            >
              <InputNumber min="0" value={orderNum} onChange={(e) => setOrderNum(e)} />
            </Form.Item>
            <Form.Item
              label="负责人"
              name="leader"
            >
              <Input value={leader} onChange={(e) => setLeader(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="联系电话"
              name="phone"
            >
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
            >
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="部门状态"
              name="status"
              initialValue={status}
            >
              <Radio.Group onChange={(e) => {setStatus(e.target.value);}}>
                <Radio value="0">正常</Radio>
                <Radio value="1">停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
          </Modal>
      </div>
    );
}

export default Dept;