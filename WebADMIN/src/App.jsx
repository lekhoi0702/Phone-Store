import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import BrandManagement from './pages/BrandManagement';
import CategoryManagement from './pages/CategoryManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main App Component
const AppContent = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/brands"
            element={
              <ProtectedRoute>
                <Layout>
                  <BrandManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Placeholder routes for future pages */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Quản lý sản phẩm</h2>
                      <p className="text-gray-600">Trang này đang được phát triển</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h2>
                      <p className="text-gray-600">Trang này đang được phát triển</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt</h2>
                      <p className="text-gray-600">Trang này đang được phát triển</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
};

// App with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
