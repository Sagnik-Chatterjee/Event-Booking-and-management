import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

let refreshPromise = null;

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = axios
                        .get(
                            "http://localhost:8000/user/refreshToken",
                            {
                                withCredentials: true
                            }
                        )
                        .finally(() => {
                            refreshPromise = null;
                        });
                }

                await refreshPromise;

                return api(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem("user");
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;