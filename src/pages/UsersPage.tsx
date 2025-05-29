// admin-dashboard/src/pages/UsersPage.tsx
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress // 로딩 스피너
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// User 인터페이스 (이전과 동일)
interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  canScanQr: boolean;
  isAdmin: boolean;
  // 필요한 경우 다른 필드도 추가
}

const drawerWidth = 240;

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // 로딩 시작
      setError(''); // 에러 초기화

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get<User[]>(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (err: unknown) {
        console.error('사용자 목록 가져오기 에러:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || '사용자 목록을 가져오지 못했습니다.');
          if (err.response?.status === 401 || err.response?.status === 403) {
            alert('인증이 만료되었거나 권한이 없습니다. 다시 로그인 해주세요.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchUsers();
  }, [navigate]);

  const drawer = (
    <Box sx={{ overflow: 'auto', p: 2 }}>
      <Typography variant="h6" sx={{ my: 2, textAlign: 'center', color: 'primary.main' }}>
        관리자 대시보드
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="대시보드" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/users">
            <ListItemIcon>
              <PeopleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="사용자 관리" />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleLogout} 
          startIcon={<LogoutIcon />}
          fullWidth
        >
          로그아웃
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            사용자 관리
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar /> {/* AppBar 높이만큼 공간 확보 */}
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              사용자 관리
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : users.length > 0 ? (
              <TableContainer component={Paper} elevation={1}>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                  <TableHead>
                    <TableRow>
                      <TableCell>사용자 이름</TableCell>
                      <TableCell>이메일</TableCell>
                      <TableCell align="center">QR 스캔 권한</TableCell>
                      <TableCell align="center">관리자</TableCell>
                      {/* <TableCell align="right">액션</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="center">
                          {user.canScanQr ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                        </TableCell>
                        <TableCell align="center">
                          {user.isAdmin ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                        </TableCell>
                        {/* <TableCell align="right">
                          <Button variant="outlined" size="small">권한 변경</Button>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                사용자가 없습니다.
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default UsersPage;