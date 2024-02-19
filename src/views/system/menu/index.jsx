import { useEffect, useState } from 'react';
import { Button, Select, Table } from 'antd';
import { PlusOutlined, EditOutlined, SwapOutlined, DeleteOutlined } from '@ant-design/icons';
import CommonHeader from "@/components/CommonHeader";
import CommonStatusbar from "@/components/CommonStatusbar";
import TextBox from "@/components/TextBox";
import { getSystemMenuList, getSystemMenuTreeSelect } from '@/service';
const Menu = () => {
    const [menuList, setMenuList] = useState([]);
    const [loading, setLoading] = useState(false);
    const columns = [
      {
        title: '菜单名称',
        width: 200,
        dataIndex: 'menuName',
        key: 'menuName',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '类型',
        width: 80,
        dataIndex: 'menuType',
        key: 'menuType',
        align: 'center',
      },
      {
        title: '图标',
        width: 80,
        dataIndex: 'icon',
        align: 'center',
        key: 'icon'
      },
      {
        title: '排序',
        width: 100,
        dataIndex: 'orderNum',
        align: 'center',
        key: 'orderNum'
      },
      {
        title: '权限标识',
        dataIndex: 'perms',
        width: 200,
        align: 'center',
        key: 'perms'
      },
      {
        title: '路由地址',
        width: 200,
        dataIndex: 'path',
        align: 'center',
        key: 'path'
      },
      {
        title: '组件路径',
        width: 200,
        dataIndex: 'component',
        align: 'center',
        key: 'component'
      },
      {
        title: '显示',
        width: 80,
        dataIndex: 'visible',
        align: 'center',
        key: 'visible'
      },
      {
        title: '状态',
        width: 80,
        dataIndex: 'status',
        align: 'center',
        key: 'status'
      },
      {
        title: '操作',
        width: 300,
        align: 'center',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
          <div className=''>
            <Button type="link" icon={<EditOutlined />}>编辑</Button>
            <Button type="link" icon={<PlusOutlined />}>新增</Button>
            <Button type="link" icon={<DeleteOutlined />} >删除</Button>
          </div>
        )
      }
    ];

    const getMenuData = async () => {
      setLoading(true);
      const {data:{data:List}} = await getSystemMenuList();
      const {data:{data:TreeSelect}} = await getSystemMenuTreeSelect();
      setMenuList(menuTree(List,TreeSelect))
      setLoading(false)
    };
    const menuTree = function(List,TreeSelect) {
      let res = [];
      for (let i = 0; i < TreeSelect.length; i++) {
        List.forEach(item => {
          if (TreeSelect[i].id === item.menuId) {
            console.log();
            res.push({
              ...item,
              children: (TreeSelect[i].children).length !== 0 ? menuTree(List,TreeSelect[i].children) : null,
              key: TreeSelect[i].id
            });
          }
        })

      }
      return res;
    }

    useEffect(() => {
      getMenuData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <>
        <CommonHeader
          className="w-[800px]"
          BoxClass="w-[555px]"
          theme="菜单名称"
        >
          <TextBox label="状态">
            <Select
              style={{ width: "150px", marginLeft: "20px"}}
            ></Select>
          </TextBox>
        </CommonHeader>
        <CommonStatusbar>
          <div className='w-[300px] flex justify-between'>
            <Button icon={<PlusOutlined />}>新增</Button>
            <Button icon={<EditOutlined />} type="dashed">修改</Button>
            <Button icon={<SwapOutlined />} type="dashed">展开/折叠</Button>
          </div>
        </CommonStatusbar>
        <Table
            className="mt-[20px]"
            columns={columns}
            dataSource={menuList}
            scroll={{x: 1500,}}
            loading={loading}
            bordered
          />
      </>
    );
}

export default Menu;