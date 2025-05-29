// admin-dashboard/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import PrivateRoute from './components/PrivateRoute';

// MUI 관련 임포트
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // 새로 만든 테마 불러오기

function App() {
  return (
    // ThemeProvider로 앱 전체를 감싸서 테마 적용
    // CssBaseline은 Material Design의 기본 CSS를 적용하여 일관된 스타일을 제공합니다.
   <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 보호된 라우트: PrivateRoute 컴포넌트를 사용하여 페이지를 래핑 */}
        {/* element prop에 직접 PrivateRoute 컴포넌트를 반환하는 함수를 전달 */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          } 
        />

        {/* 기본 경로를 로그인 페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;