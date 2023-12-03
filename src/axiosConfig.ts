import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function setupInterceptors() {
  // Request Interceptor
  axios.interceptors.request.use(request => {
    const accessToken = cookies.get('accessToken');
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return request;
  }, error => {
    return Promise.reject(error);
  });

  // Response Interceptor
  axios.interceptors.response.use(response => {
    return response;
  }, async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = cookies.get('refreshToken');
      return axios.post('/refresh-token', { refreshToken })
        .then(res => {
          if (res.status === 200) {
            cookies.set('accessToken', res.data.accessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  });
}