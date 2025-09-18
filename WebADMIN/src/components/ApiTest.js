import React, { useState } from 'react';
import { Card, Button, Space, Alert, Spin, Typography, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { brandApi, categoryApi } from '../services/api';

const { Title, Text } = Typography;

const ApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const testApi = async (apiName, apiFunction) => {
    setLoading(true);
    try {
      const startTime = Date.now();
      const data = await apiFunction();
      const endTime = Date.now();
      
      setResults(prev => ({
        ...prev,
        [apiName]: {
          success: true,
          data: data,
          responseTime: endTime - startTime,
          timestamp: new Date().toLocaleString()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [apiName]: {
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testAllApis = async () => {
    setResults({});
    
    // Test Brand APIs
    await testApi('Brands - GetAll', () => brandApi.getAll());
    await testApi('Brands - GetById', () => brandApi.getById(1));
    
    // Test Category APIs
    await testApi('Categories - GetAll', () => categoryApi.getAll());
    await testApi('Categories - GetById', () => categoryApi.getById(1));
    
    // Test Create operations
    await testApi('Brands - Create', () => brandApi.create({
      brandName: 'Test Brand',
      description: 'Test Description',
      isActive: true
    }));
    
    await testApi('Categories - Create', () => categoryApi.create({
      categoryName: 'Test Category',
      description: 'Test Description',
      isActive: true
    }));
  };

  const renderResult = (apiName, result) => {
    if (!result) return null;
    
    return (
      <Card 
        size="small" 
        style={{ marginBottom: 8 }}
        title={
          <Space>
            {result.success ? (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            )}
            <Text strong>{apiName}</Text>
          </Space>
        }
        extra={
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {result.responseTime && `${result.responseTime}ms`}
          </Text>
        }
      >
        {result.success ? (
          <div>
            <Text type="success">✅ Success</Text>
            {result.data && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Data: {Array.isArray(result.data) ? `${result.data.length} items` : 'Object received'}
                </Text>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Text type="danger">❌ Error: {result.error}</Text>
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {result.timestamp}
          </Text>
        </div>
      </Card>
    );
  };

  return (
    <div>
      <Title level={3}>API Connection Test</Title>
      <Text type="secondary">
        Test the connection between frontend and WebAPI backend
      </Text>
      
      <Divider />
      
      <Space style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={testAllApis}
          loading={loading}
        >
          Test All APIs
        </Button>
        
        <Button 
          onClick={() => setResults({})}
          disabled={loading}
        >
          Clear Results
        </Button>
      </Space>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Testing API connections...</Text>
          </div>
        </div>
      )}

      {Object.keys(results).length > 0 && (
        <div>
          <Title level={4}>Test Results</Title>
          {Object.entries(results).map(([apiName, result]) => 
            renderResult(apiName, result)
          )}
        </div>
      )}

      <Alert
        message="API Configuration"
        description={
          <div>
            <p>Current API Base URL: <Text code>https://localhost:7000/api</Text></p>
            <p>Mock Data Mode: <Text code>Enabled</Text> (for testing without backend)</p>
            <p>To test with real API:</p>
            <ol>
              <li>Start your WebAPI backend</li>
              <li>Set <Text code>USE_MOCK_DATA = false</Text> in <Text code>src/services/api.js</Text></li>
              <li>Update <Text code>API_BASE_URL</Text> if needed</li>
            </ol>
          </div>
        }
        type="info"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
  );
};

export default ApiTest;
