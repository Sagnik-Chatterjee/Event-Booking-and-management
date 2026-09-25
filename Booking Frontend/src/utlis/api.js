import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        console.log("Access token expired. Attempting silent refresh...");
        const response= await axios.get(
          `http://localhost:8000/user/refreshToken`,
          { withCredentials: true }
        );
        console.log("Token refreshed successfully! Retrying original request...");
        console.log(response.data)
        return api(originalRequest); 
      } catch (refreshError) {
        console.error("Refresh token expired. Force logging out user...");
        

        localStorage.removeItem("user");
        
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;