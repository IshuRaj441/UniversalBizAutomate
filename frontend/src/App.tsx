import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LeadGenerator = lazy(() => import('./pages/LeadGenerator'));
const FileConverter = lazy(() => import('./pages/FileConverter'));
const MyFiles = lazy(() => import('./pages/MyFiles'));
const JobHistory = lazy(() => import('./pages/JobHistory'));
const Billing = lazy(() => import('./pages/Billing'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

// Create dark theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#22c55e',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    divider: '#334155',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#94a3b8',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 18px',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px rgba(59,130,246,0.3)',
          },
        },
        outlined: {
          borderColor: '#334155',
          color: '#e2e8f0',
          '&:hover': {
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            background: '#020617',
            border: '1px solid #334155',
            borderRadius: 10,
            padding: '12px',
            color: '#e2e8f0',
            '&:hover': {
              borderColor: '#475569',
            },
            '&.Mui-focused': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94a3b8',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#020617',
          borderRight: '1px solid #1e293b',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#020617',
          borderBottom: '1px solid #1e293b',
          boxShadow: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            background: '#1e293b',
            color: '#ffffff',
            '&:hover': {
              background: '#334155',
            },
          },
          '&:hover': {
            background: 'rgba(30,41,59,0.5)',
          },
        },
      },
    },
  },
});

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    }>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        
        {/* Protected routes */}
        <Route element={<Layout />}>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute>
              <LeadGenerator />
            </ProtectedRoute>
          } />
          <Route path="/converter" element={
            <ProtectedRoute>
              <FileConverter />
            </ProtectedRoute>
          } />
          <Route path="/my-files" element={
            <ProtectedRoute>
              <MyFiles />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <JobHistory />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
