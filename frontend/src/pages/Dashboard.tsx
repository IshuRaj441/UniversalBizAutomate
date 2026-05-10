import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
  Paper,
  Grid,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Business as BusinessIcon,
  SwapHoriz as ConvertIcon,
  History as HistoryIcon,
  CreditCard as CreditCardIcon,
  FileCopy as FileCopyIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Activity {
  id: number;
  type: 'conversion' | 'lead_generation';
  name: string;
  status: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecentActivities([
        { id: 1, type: 'conversion', name: 'document.pdf', status: 'completed', date: '2023-05-15' },
        { id: 2, type: 'lead_generation', name: 'Tech Companies', status: 'completed', date: '2023-05-14' },
        { id: 3, type: 'conversion', name: 'presentation.pptx', status: 'completed', date: '2023-05-13' },
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: 'conversion' | 'lead_generation') => {
    switch (type) {
      case 'conversion':
        return <ConvertIcon sx={{ fontSize: 24, color: '#ffffff' }} />;
      case 'lead_generation':
        return <BusinessIcon sx={{ fontSize: 24, color: '#ffffff' }} />;
      default:
        return <FileCopyIcon sx={{ fontSize: 24, color: '#ffffff' }} />;
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          fontWeight: 600,
          color: '#e2e8f0',
          mb: 4,
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}
      >
        Welcome back, {user?.email?.split('@')[0] || 'User'}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Credits Card */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              border: '1px solid #334155',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                borderColor: '#3b82f6'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography 
                  color="textSecondary" 
                  gutterBottom
                  sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                >
                  Available Credits
                </Typography>
                <Avatar 
                  sx={{ 
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    width: 48,
                    height: 48
                  }}
                >
                  <CreditCardIcon />
                </Avatar>
              </Box>
              <Typography 
                variant="h3" 
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  color: '#e2e8f0',
                  mb: 3
                }}
              >
                {user?.credits || 0}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="small" 
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3
                }}
                onClick={() => navigate('/billing')}
              >
                Buy More
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card 
            elevation={0}
            sx={{
              height: '100%',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: '#e2e8f0',
                  mb: 3
                }}
              >
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<BusinessIcon />}
                    onClick={() => navigate('/leads')}
                    sx={{ 
                      height: '100%', 
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#334155',
                      color: '#e2e8f0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Generate Leads
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={() => navigate('/converter')}
                    sx={{ 
                      height: '100%', 
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#334155',
                      color: '#e2e8f0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Convert File
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FileCopyIcon />}
                    onClick={() => navigate('/my-files')}
                    sx={{ 
                      height: '100%', 
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#334155',
                      color: '#e2e8f0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    My Files
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<HistoryIcon />}
                    onClick={() => navigate('/history')}
                    sx={{ 
                      height: '100%', 
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#334155',
                      color: '#e2e8f0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    History
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card 
        elevation={0}
        sx={{ 
          mb: 4,
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#e2e8f0',
              mb: 3
            }}
          >
            Recent Activity
          </Typography>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress sx={{ color: '#3b82f6' }} />
            </Box>
          ) : (
            <Box>
              {recentActivities.map((activity) => (
                <Box key={activity.id} mb={2}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    p={2}
                    sx={{
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(59,130,246,0.05)'
                      }
                    }}
                  >
                    <Box mr={3}>
                      <Avatar 
                        sx={{
                          background: activity.type === 'conversion' 
                            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                            : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          width: 48,
                          height: 48
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </Box>
                    <Box flexGrow={1}>
                      <Typography 
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: '#e2e8f0',
                          mb: 0.5
                        }}
                      >
                        {activity.type === 'conversion' 
                          ? `Converted ${activity.name}` 
                          : `Generated leads for ${activity.name}`}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {new Date(activity.date).toLocaleDateString()} • {activity.status}
                      </Typography>
                    </Box>
                    <Button 
                      variant="text" 
                      color="primary" 
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(59,130,246,0.1)'
                        }
                      }}
                      onClick={() => navigate(activity.type === 'conversion' ? '/my-files' : '/leads')}
                    >
                      View
                    </Button>
                  </Box>
                  {activity.id !== recentActivities[recentActivities.length - 1].id && (
                    <Divider sx={{ borderColor: '#334155', my: 1 }} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Tips & Updates */}
      <Card 
        elevation={0}
        sx={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#e2e8f0',
              mb: 3
            }}
          >
            Tips & Updates
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                p={2}
                sx={{
                  borderRadius: 2,
                  background: 'rgba(59,130,246,0.05)',
                  border: '1px solid rgba(59,130,246,0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(59,130,246,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box component="span" sx={{ fontSize: '1rem' }}>✨</Box>
                  New Feature
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: '#94a3b8',
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}
                >
                  Try our new bulk file conversion tool to process multiple files at once!
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                p={2}
                sx={{
                  borderRadius: 2,
                  background: 'rgba(34,197,94,0.05)',
                  border: '1px solid rgba(34,197,94,0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(34,197,94,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box component="span" sx={{ fontSize: '1rem' }}>💡</Box>
                  Pro Tip
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: '#94a3b8',
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}
                >
                  Save credits by scheduling lead generation during off-peak hours.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                p={2}
                sx={{
                  borderRadius: 2,
                  background: 'rgba(239,68,68,0.05)',
                  border: '1px solid rgba(239,68,68,0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(239,68,68,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box component="span" sx={{ fontSize: '1rem' }}>🚀</Box>
                  Coming Soon
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: '#94a3b8',
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}
                >
                  API access for developers to integrate directly with our services.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;