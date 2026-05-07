const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
  },
  auth: {
    tokenKey: 'token',
    userKey: 'user',
  },
};

export default config;
