import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Switch } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TagsOutlined,
  ShopOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import BrandManagement from './components/BrandManagement';
import CategoryManagement from './components/CategoryManagement';
import ApiTest from './components/ApiTest';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [useTopNav, setUseTopNav] = useState(false);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  const sidebarItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/brands',
      icon: <ShopOutlined />,
      label: 'Brand Management',
    },
    {
      key: '/categories',
      icon: <TagsOutlined />,
      label: 'Category Management',
    },
    {
      key: '/api-test',
      icon: <SettingOutlined />,
      label: 'API Test',
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="wrapper">
      <Layout style={{ minHeight: '100vh' }}>
        {!useTopNav && (
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          width={250}
          collapsedWidth={80}
          style={{
            background: '#343a40',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        >
          <div style={{ 
            height: '50px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#007bff',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {collapsed ? 'PS' : 'Phone Store'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={sidebarItems}
            style={{ background: '#343a40', border: 'none' }}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        )}
        
        <Layout style={{ marginLeft: useTopNav ? 0 : (collapsed ? 80 : 250), transition: 'margin-left 0.2s' }}>
          <Header style={{ 
            padding: '0 20px', 
            background: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!useTopNav && (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: '16px', width: 64, height: 64 }}
                />
              )}
              {useTopNav && (
                <Menu 
                  mode="horizontal" 
                  selectedKeys={[location.pathname]} 
                  onClick={({ key }) => navigate(key)}
                  items={sidebarItems}
                  style={{ borderBottom: 'none' }}
                />
              )}
            </div>
            
            <Space>
              <span style={{ marginRight: 12, color: '#8c8c8c' }}>Top Nav</span>
              <Switch checked={useTopNav} onChange={setUseTopNav} />
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span style={{ marginLeft: 8 }}>Admin</span>
                </Button>
              </Dropdown>
            </Space>
          </Header>
          
          <Content style={{ 
            margin: '20px 0', 
            padding: 0,
            background: '#f4f6f9',
            minHeight: 'calc(100vh - 100px)'
          }}>
            <div className="container">
              <div style={{ padding: '0 8px' }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/brands" element={<BrandManagement />} />
                  <Route path="/categories" element={<CategoryManagement />} />
                  <Route path="/api-test" element={<ApiTest />} />
                </Routes>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
