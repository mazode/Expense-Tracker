export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    GET_USER_INFO: "/api/v1/auth/getUser",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },
  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
    GET_INCOME: "/api/v1/income/get",
    DOWNLOAD_INCOME: "/api/v1/income/download",
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
    GET_EXPENSE: "/api/v1/expense/get",
    DOWNLOAD_EXPENSE: "/api/v1/expense/download",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
};
