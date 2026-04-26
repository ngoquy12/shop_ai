import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  // Nếu BE trả cookie thay vì body thì bật lên, nhưng ở đây BE trả Body nên ta tự xử
  withCredentials: true,
});

// Thêm token vào request headers
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Chặn response để tự refresh token nếu gặp 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Nếu BE dùng TransformResponseInterceptor bọc data trong { success, data }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu gọi bị 401 (Hết token) và không phải URL refresh token hay login
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("auth/login") &&
      !originalRequest.url?.includes("auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Gọi API refresh
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken },
        );

        // Cập nhật lại Cookies
        const newAccess = data.data.accessToken; // Tùy vào format TransformResponseInterceptor
        const newRefresh = data.data.refreshToken;

        Cookies.set("accessToken", newAccess, { expires: 1 / 96 }); // 15 phút
        Cookies.set("refreshToken", newRefresh, { expires: 7 }); // 7 ngày

        // Báo cho các request đang đợi gọi lại
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Log out user
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        if (typeof window !== "undefined") {
          window.location.href = "/dang-nhap";
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Ném lỗi ra cấp ngoài (Xử lý toast error sau)
    return Promise.reject(error?.response?.data || error);
  },
);
