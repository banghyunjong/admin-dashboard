// admin-dashboard/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios'; // AxiosError 타입 임포트
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert 
} from '@mui/material'; // MUI 컴포넌트 임포트
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // 아이콘 임포트


function LoginPage() {
  const [username, setUsername] = useState<string>(''); // 타입 명시
  const [password, setPassword] = useState<string>(''); // 타입 명시
  const [error, setError] = useState<string>(''); // 타입 명시
  const navigate = useNavigate();

  // 이벤트 객체 e에 React.FormEvent<HTMLFormElement> 타입 명시
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/dashboard'); 

    } catch (err: unknown) { // err 타입을 unknown으로 명시
      console.error('로그인 에러:', err);
      // AxiosError 타입 가드 사용
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

 return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', borderRadius: '50%', color: 'white', mb: 2 }}>
          <LockOutlinedIcon fontSize="large" />
        </Box>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          관리자 로그인
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="사용자 이름"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            variant="outlined"
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            로그인
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;