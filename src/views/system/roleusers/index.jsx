import { useEffect, useState } from 'react';
import { Button, Input, Table, Modal, message } from 'antd';
import { PlusOutlined, CloseCircleOutlined, SearchOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { getSystemRoleList, getSystemuserRoleGet, getSystemuserGetExcludeUsers, getSystemUserRoleCreate, getSystemUserRoleDelete } from '@/service';

const Roleusers = () => {
    // 获取角色列表
    const [roleList, setRoleList] = useState([]);
    const [roleId, setRoleId]  = useState(2);
    const [muserRole, setMuserRole] = useState('');
    const [loading, setLoading] = useState(false); 
    const [excludeUsersData, setExcludeUsersData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userIds, setUserIds] = useState([]);
    const columns = [
      {
        title: '用户Id',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '用户账号',
        dataIndex: 'createBy',
        key: 'createBy',
        align: 'center',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickName',
        key: 'nickName',
        align: 'center',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        align: 'center',
      },
      {
        title: '账号状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <Button type="link" icon={<CloseCircleOutlined />} onClick={RoleDelete}>取消授权</Button>
        ),
      }
    ]
    const UsersColumns = [
      {
        title: '用户编号',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '用户名称',
        dataIndex: 'createBy',
        key: 'createBy',
        align: 'center',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickName',
        key: 'nickName',
        align: 'center',
      },
      {
        title: '账号状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
      }
    ]

    const getRole = () => {
      getSystemRoleList()
      .then(res => {
        setRoleList(res.data.data.result);
      })
    };
    const RoleGet = (roleId=2) => {
      setLoading(true);
      getSystemuserRoleGet(roleId).then(res =>{
        const Data = res.data.data.map(item => {
          return {
            ...item,
            key: item.userId,
            status: item.status === "0" ? <CheckCircleFilled className='text-lime-500' /> : <CloseCircleFilled className='text-red-800' />,
          };
        })
        setMuserRole(Data);
        setLoading(false);
      })
    }
    const ExcludeUsers = () => {
      setUsersLoading(true);
      getSystemuserGetExcludeUsers({roleId}).then(res => {
        const Data = res.data.data.map(item => {
          return {
            ...item,
            key: item.userId,
            status: item.status === "0" ? <CheckCircleFilled className='text-lime-500' /> : <CloseCircleFilled className='text-red-800' />,
          };
        })
        setExcludeUsersData(Data)
        setUsersLoading(false);
      })
    }
    const handle = () => {
      setIsModalOpen(false);
    };
    const validate = async () => {
      if(userIds.length > 0){
        await getSystemUserRoleCreate({roleId,userIds});
        await setUserIds([]);
        await RoleGet();
        handle();
        message.success("添加成功");
      }
    }
    const open = async () => {
      await ExcludeUsers();
      setIsModalOpen(true);
    }
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        setUserIds(selectedRowKeys)
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
      
    };
    const RoleDelete = async function () {
      if(userIds.length > 0) {
        await getSystemUserRoleDelete({roleId,userIds});
        setUserIds([]);
        RoleGet();
      }
    }

    useEffect(()=>{
      getRole();
      RoleGet();
      ExcludeUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
      <div className="flex justify-between">
        <div className='w-[200px] h-[600px] border-[1px] border-gray-200 border-solid box-border'>
          <h3 className='pl-[20px] leading-[30px] text-gray-500'>角色名称</h3>
          {
            roleList.map((item, index) => (
              <div 
                className='pl-[20px] leading-[50px] text-gray-500 hover:bg-[#f5f5f5] border-[1px] border-gray-200 m-[-1px] border-solid'
                key={index}
                onClick={  () => {
                   setRoleId(item.roleId);
                   RoleGet(item.roleId);
                }}
                style={{background: roleId === item.roleId ? '#f0f2f5' : ''}}
              >
                {item.roleName}
              </div>
            ))
          }
        </div>
        <div className='w-[80%] min-w-[800px]'>
          <div className='flex justify-between mb-[20px]'>
            <div className='w-[260px] flex justify-between'>
              <Button icon={<PlusOutlined />} onClick={open} >添加用户</Button>
              <Button icon={<CloseCircleOutlined />} danger>批量取消授权</Button>
            </div>
            <Input prefix={<SearchOutlined />} placeholder='请输入用户名称' style={{width:"200px"}}></Input>
          </div>
          <Table 
            columns={columns}
            dataSource={muserRole}
            loading={loading}
            rowSelection={{type:"checkbox",...rowSelection}}
            scroll={{x: 800,}}
          />
        </div>
        <Modal title="添加" open={isModalOpen} onOk={validate} onCancel={handle} okText="确定" cancelText="取消" width={800} >
          <Table 
            columns={UsersColumns}
            dataSource={excludeUsersData}
            rowSelection={{type:"checkbox",...rowSelection,checkStrictly:true}}
            loading={usersLoading}
            scroll={{x: 600,}}
          />
        </Modal>
      </div>
    );
}

export default Roleusers;