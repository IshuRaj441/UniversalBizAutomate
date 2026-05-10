import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Drawer, 
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Container, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton, 
  Tooltip,
  styled,
  Chip,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  SwapHoriz as ConvertIcon,
  Folder as FolderIcon,
  History as HistoryIcon,
  Payment as PaymentIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface StyledListItemProps {
  selected?: boolean;
  theme?: any;
}

const StyledListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<StyledListItemProps>(({ theme, selected }) => ({
  ...(selected && {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
}));

const drawerWidth = 240;

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Lead Generator', icon: <BusinessIcon />, path: '/leads' },
    { text: 'File Converter', icon: <ConvertIcon />, path: '/converter' },
    { text: 'My Files', icon: <FolderIcon />, path: '/my-files' },
    { text: 'Job History', icon: <HistoryIcon />, path: '/history' },
    { text: 'Billing', icon: <PaymentIcon />, path: '/billing' },
    ...(user?.is_admin ? [{ text: 'Admin', icon: <AdminIcon />, path: '/admin' }] : []),
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ py: 2 }}>
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            color: '#e2e8f0',
            fontSize: '1.25rem',
            letterSpacing: '-0.025em'
          }}
        >
          UBA Pro
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#334155' }} />
      <List sx={{ py: 1 }}>
        {menuItems.map((item) => (
          <StyledListItem 
            key={item.text} 
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: location.pathname === item.path ? '#3b82f6' : '#94a3b8'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  color: location.pathname === item.path ? '#ffffff' : '#e2e8f0',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: '0.875rem'
                }
              }}
            />
          </StyledListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`${user?.credits || 0} credits`}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '28px',
                borderRadius: '14px',
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ 
                  ml: 1,
                  '&:hover': {
                    background: 'rgba(59,130,246,0.1)'
                  }
                }}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: '2px solid #334155'
                  }}
                >
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/billing'); }}>
              <ListItemIcon>
                <PaymentIcon fontSize="small" />
              </ListItemIcon>
              Billing & Plans
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
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
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
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
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
          background: '#0f172a'
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
