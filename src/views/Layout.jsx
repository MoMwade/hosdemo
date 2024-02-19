import React, { useState } from 'react';
import { Outlet,  useNavigate } from 'react-router-dom'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;

const LayOut = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const treeData = (arr) => {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            data.push({
                label: arr[i].meta.title,
                key: arr[i].path,
                children: arr[i].children ? treeData(arr[i].children) : null,
            })
        }
        return data;
    }
    const navigate = useNavigate();
    // 获取菜单
    const routers = JSON.parse(localStorage.getItem('routers'));
    const menu = treeData(routers);
    return(
    <Layout>
      <Sider className='min-h-[98vh] overflow-auto' trigger={null} collapsible collapsed={collapsed}>
        <div className="font-bold text-[20px] h-[60px] text-[white] text-center flex items-center p-[10px]">
          <img
            src="https://pe.xzzl120.com/assets/logo.1c4bdeb5.png"
            className="w-[40px] h-[40px] rounded-full mr-[10px]"
            alt=""
          />
          <span className="text-[16px] transition-opacity" style={{opacity:collapsed?'0':'1'}}>西藏康城肿瘤医院</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menu}
          onClick={(e) => {
            if(e.keyPath[0].includes("/")){
              e.keyPath[0] = e.keyPath[0].slice(1);
            }
            navigate(e.keyPath.reverse().join("/"));
        }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minWidth: 1230,
          }}
        >
          <Outlet></Outlet> 
        </Content>
      </Layout>
    </Layout>
    )
}

export default LayOut;