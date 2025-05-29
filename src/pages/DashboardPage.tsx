// admin-dashboard/src/pages/DashboardPage.tsx
import React, { useState } from 'react'; // useState 임포트 확인
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // useNavigate 임포트 확인

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
  Paper, // <-- Paper 컴포넌트 임포트 확인!
} from '@mui/material'; // MUI 컴포넌트 임포트

// MUI 아이콘 임포트
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

// UserInfo 인터페이스 (이전과 동일)
interface UserInfo {
  id: string;
  username: string;
  email: string;
  canScanQr: boolean;
  isAdmin: boolean;
}

// drawerWidth 변수를 컴포넌트 밖 (상단)에 선언하여 전역적으로 접근 가능하게 합니다.
const drawerWidth = 240;

function DashboardPage() {
  const userString = localStorage.getItem('user');
  const user: UserInfo | null = userString ? JSON.parse(userString) : null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // navigate 훅을 사용하여 로그인 페이지로 이동
  };

  // Drawer 내용을 별도의 변수로 정의하여 가독성 높임
  const drawer = (
    <Box sx={{ overflow: 'auto', p: 2 }}>
      <Typography variant="h6" sx={{ my: 2, textAlign: 'center', color: 'primary.main' }}>
        관리자 대시보드
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/dashboard"> {/* RouterLink 사용 */}
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="대시보드" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/users"> {/* RouterLink 사용 */}
            <ListItemIcon>
              <PeopleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="사용자 관리" />
          </ListItemButton>
        </ListItem>
        {/* 다른 관리 기능 링크 추가 예정 */}
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
      <CssBaseline /> {/* Material-UI의 기본 CSS 재설정 */}
      <AppBar
        position="fixed"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }} // drawerWidth 사용
      >
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
            대시보드
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} // drawerWidth 사용
        aria-label="mailbox folders"
      >
        {/* 모바일 드로어 (임시) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // 성능 최적화
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, // drawerWidth 사용
          }}
        >
          {drawer}
        </Drawer>
        {/* 데스크탑 드로어 (영구) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, // drawerWidth 사용
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }} // drawerWidth 사용
      >
        <Toolbar /> {/* AppBar 높이만큼 공간 확보 */}
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}> {/* Paper 컴포넌트 사용 */}
            <Typography variant="h4" gutterBottom>
              관리자 대시보드
            </Typography>
            {user ? (
              <Typography variant="h6" color="textSecondary">
                환영합니다, {user.username}님! (관리자: {user.isAdmin ? '예' : '아니오'})
              </Typography>
            ) : (
              <Typography variant="h6" color="textSecondary">
                사용자 정보를 불러올 수 없습니다.
              </Typography>
            )}
          </Paper>
          {/* 여기에 추가적인 대시보드 콘텐츠를 넣을 수 있습니다. */}
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardPage;