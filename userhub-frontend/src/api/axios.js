import axios from 'axios';

const baseURL = 'http://localhost:8081/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // 🔐 includes cookies
});

export const setupAxiosInterceptors = (auth, login, logout) => {
  // ✅ Request Interceptor: only attach token if it exists
  axiosInstance.interceptors.request.use(
    (config) => {
      // Skip attaching Authorization for login or refresh endpoints
      const isAuthEndpoint =
        config.url.includes('/auth/login') ||
        config.url.includes('/auth/refreshToken');

      if (!isAuthEndpoint && auth?.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Response Interceptor: handle expired token only for protected routes
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const isAuthEndpoint =
        originalRequest.url.includes('/auth/login') ||
        originalRequest.url.includes('/auth/refreshToken');

      // 🚫 Never retry for auth endpoints or already retried requests
      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          logout();
          return Promise.reject(error);
        }

        try {
          const res = await axios.post(`${baseURL}/auth/refreshToken`, {
            refreshToken,
          });

          const newAccessToken = res.data.accessToken;
          const newRefreshToken = res.data.refreshToken;

          login(auth.user, newAccessToken, newRefreshToken); // 🔁 update context + storage

          // 🔁 Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          logout();
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
