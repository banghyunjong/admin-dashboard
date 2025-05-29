// admin-dashboard/src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200EE', // 좀 더 진한 보라색 (기본 Material Primary)
    },
    secondary: {
      main: '#03DAC6', // 민트색 (상큼한 강조색)
    },
    background: {
      default: '#f4f6f8', // 매우 밝은 회색 배경
      paper: '#ffffff', // 카드나 패널의 흰색 배경
    },
    text: {
      primary: '#333333', // 기본 텍스트 색상
      secondary: '#666666', // 보조 텍스트 색상
    },
    // 상큼한 느낌을 위해 오버라이드
    // 예를 들어, 밝고 부드러운 색상을 추가할 수 있습니다.
    // info, success, warning, error 등도 필요에 따라 설정 가능
  },
  typography: {
    fontFamily: [
      'Pretendard', // 시스템에 설치된 폰트 우선 (설치되어 있다면)
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    // 다른 텍스트 스타일도 필요에 따라 조정
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // 버튼 모서리 둥글게
          textTransform: 'none', // 버튼 텍스트 대문자 변환 방지
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // 부드러운 그림자
          borderRadius: 12, // 카드 모서리 둥글게
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTableHead: { // 테이블 헤더 디자인 개선
      styleOverrides: {
        root: {
          backgroundColor: '#e3f2fd', // 밝은 파란색 계열 배경
          '& .MuiTableCell-root': {
            fontWeight: 700,
            color: '#3f51b5', // 진한 파란색 글씨
          },
        },
      },
    },
  },
});

export default theme;