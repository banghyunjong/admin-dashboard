// admin-dashboard/src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRouteProps 인터페이스 정의
interface PrivateRouteProps {
  children: React.ReactElement; // children의 타입을 React.ReactNode에서 React.ReactElement로 변경
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');
  
  const userString = localStorage.getItem('user');
  // user 정보를 파싱할 때 타입 단언 (JSON.parse 결과가 예상하는 UserInfo 타입이라고 가정)
  // isAdmin이 UserInfo 인터페이스에 정의되어 있다고 가정
  const user: { isAdmin?: boolean } | null = userString ? JSON.parse(userString) : null; 

  // 토큰이 없거나, 사용자 정보가 없거나, 관리자가 아니면 로그인 페이지로 리다이렉트
  if (!token || !user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // 인증이 완료되면 children을 직접 반환합니다.
  // children이 이미 React.ReactElement 타입이므로, Fragment로 감쌀 필요가 없습니다.
  return children; 
};

export default PrivateRoute;