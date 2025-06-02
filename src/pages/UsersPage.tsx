import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Checkbox, FormControlLabel, TextField, Dialog, DialogActions,
  DialogContent, DialogTitle, Snackbar, Alert
} from '@mui/material'; // MUI 컴포넌트 임포트
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'; // 아이콘 임포트

// API_URL은 .env 파일에서 가져옵니다 (예: REACT_APP_API_URL=https://your-fabric-qr-api.vercel.app)
const API_URL = process.env.REACT_APP_API_URL;

interface User {
  id: string;
  username: string;
  email: string;
  canScanQr: boolean;
  isAdmin: boolean;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // 사용자 수정/등록 다이얼로그 상태
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // 수정 시 현재 사용자
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState(''); // 새 사용자 등록 시에만 사용
  const [newCanScanQr, setNewCanScanQr] = useState(false);
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // 수정 모드인지 등록 모드인지

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인 토큰이 없습니다. 다시 로그인 해주세요.');
        setLoading(false);
        return;
      }
      const response = await axios.get<User[]>(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('사용자 목록을 가져오는 데 실패했습니다:', err);
      setError('사용자 목록을 불러오는 데 실패했습니다.');
      showSnackbar('사용자 목록을 불러오는 데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // 사용자 수정 다이얼로그 열기
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setNewUsername(user.username);
    setNewEmail(user.email);
    setNewCanScanQr(user.canScanQr);
    setNewIsAdmin(user.isAdmin);
    setNewPassword(''); // 비밀번호는 수정 시 초기화
    setIsEditMode(true);
    setOpenUserDialog(true);
  };

  // 새 사용자 등록 다이얼로그 열기
  const handleAddUser = () => {
    setCurrentUser(null);
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setNewCanScanQr(false);
    setNewIsAdmin(false);
    setIsEditMode(false);
    setOpenUserDialog(true);
  };

  // 다이얼로그 닫기
  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
  };

  // 사용자 정보 저장 (수정 또는 등록)
  const handleSaveUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showSnackbar('로그인 토큰이 없습니다. 다시 로그인 해주세요.', 'error');
      return;
    }

    try {
      if (isEditMode && currentUser) {
        // 사용자 수정
        await axios.put(`${API_URL}/users/${currentUser.id}`, {
          username: newUsername,
          email: newEmail,
          canScanQr: newCanScanQr,
          isAdmin: newIsAdmin,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar('사용자 정보가 성공적으로 수정되었습니다.', 'success');
      } else {
        // 새 사용자 등록
        if (!newUsername || !newEmail || !newPassword) {
          alert('사용자 이름, 이메일, 비밀번호는 필수 입력 항목입니다.');
          return;
        }
        await axios.post(`${API_URL}/users/register`, {
          username: newUsername,
          email: newEmail,
          password: newPassword,
          canScanQr: newCanScanQr,
          isAdmin: newIsAdmin,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar('새로운 사용자가 성공적으로 등록되었습니다.', 'success');
      }
      handleCloseUserDialog();
      fetchUsers(); // 목록 새로고침
    } catch (err: any) {
      console.error('사용자 정보 저장/등록 실패:', err);
      const errorMessage = err.response?.data?.message || '사용자 정보 저장/등록에 실패했습니다.';
      showSnackbar(errorMessage, 'error');
    }
  };

  // 사용자 삭제
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showSnackbar('로그인 토큰이 없습니다. 다시 로그인 해주세요.', 'error');
      return;
    }

    try {
      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar('사용자가 성공적으로 삭제되었습니다.', 'success');
      fetchUsers(); // 목록 새로고침
    } catch (err: any) {
      console.error('사용자 삭제 실패:', err);
      const errorMessage = err.response?.data?.message || '사용자 삭제에 실패했습니다.';
      showSnackbar(errorMessage, 'error');
    }
  };

  if (loading) {
    return <div>사용자 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>사용자 관리</h1>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddUser}
        style={{ marginBottom: '20px' }}
      >
        새 사용자 등록
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>사용자 이름</TableCell>
              <TableCell>이메일</TableCell>
              <TableCell>QR 스캔 권한</TableCell>
              <TableCell>관리자</TableCell>
              <TableCell align="right">액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.canScanQr ? '있음' : '없음'}</TableCell>
                <TableCell>{user.isAdmin ? '예' : '아니오'}</TableCell>
                <TableCell align="right">
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEditUser(user)}
                    size="small"
                  >
                    수정
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                    size="small"
                    style={{ marginLeft: '10px' }}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 사용자 수정/등록 다이얼로그 */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog}>
        <DialogTitle>{isEditMode ? '사용자 정보 수정' : '새 사용자 등록'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="사용자 이름"
            type="text"
            fullWidth
            variant="standard"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="이메일"
            type="email"
            fullWidth
            variant="standard"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          {!isEditMode && ( // 새 사용자 등록 시에만 비밀번호 필드 표시
            <TextField
              margin="dense"
              label="비밀번호"
              type="password"
              fullWidth
              variant="standard"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={newCanScanQr}
                onChange={(e) => setNewCanScanQr(e.target.checked)}
              />
            }
            label="QR 스캔 권한"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newIsAdmin}
                onChange={(e) => setNewIsAdmin(e.target.checked)}
              />
            }
            label="관리자 권한"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>취소</Button>
          <Button onClick={handleSaveUser}>{isEditMode ? '저장' : '등록'}</Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 (알림 메시지) */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UsersPage;