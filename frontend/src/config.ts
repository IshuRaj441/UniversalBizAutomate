const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://universar-bussiness-automation.onrender.com/api',
    timeout: 10000,
  },
  auth: {
    tokenKey: 'token',
    userKey: 'user',
  },
};

export default config;
