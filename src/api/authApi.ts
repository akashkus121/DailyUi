import axios from "axios";
import { LoginRequest, submitDailyHealth, UserRegisterRequest } from "../types/authTypes";

const API_URL = "https://localhost:7228/api";

// authApi.ts
export const registerUser = async (
  data: { Name: string; Email: string; Password: string },
  avatarFile?: File
) => {
  const formData = new FormData();
  formData.append("Name", data.Name);
  formData.append("Email", data.Email);
  formData.append("Password", data.Password);

  if (avatarFile) formData.append("avatar", avatarFile); // must match backend param name

  // Important: Do NOT set Content-Type manually; Axios will handle multipart boundary.
  return await axios.post(`${API_URL}/Auth/register`, formData);
};

export const loginUser = async (data: LoginRequest) => {
  return await axios.post(
    `${API_URL}/Auth/login`,
    data,
    {
      withCredentials: true,
    }
  );
};

export const dashboardData = async () => {
  const res = await axios.get(`${API_URL}/Auth/dashboard-json`, {
    withCredentials: true,
  });
  return res.data?.data ?? res.data?.Data ?? res.data;
}


export const getuser=async ()=>{
  return await axios.get(`${API_URL}/Auth/me`, {
    withCredentials: true,
  });

}

export const  DailyHealthSubmit = async (data: submitDailyHealth) => {
    return await axios.post(
        `${API_URL}/DailyHealth/submit`,
        data,
        {
          withCredentials: true,
        }
      );
}

export const getHealthReport = async (from: string, to: string) => {
  return await axios.get(`${API_URL}/DailyHealth/Healthreport`, {
    params: { from, to }, // ✅ clean & safe
    withCredentials: true,
  });
};


export const getExpenseReport = async () => {
  const res = await axios.get(`${API_URL}/Expense/expensereport`, {
    withCredentials: true,
  });
  // API wraps payload in an ApiResponse { success,message,statusCode,data }
  // normalize to return the inner data object so callers receive the model directly
  return res.data?.data ?? res.data?.Data ?? res.data;
};

export const returnWageAPI = async (id: number) => {
  console.log("API ID:", id); // 👈 add this

  return await axios.post(
    `${API_URL}/Expense/ReturnWage`,
    { id },
    { withCredentials: true }
  );
};

export const createSalary = async (amount: number, dailyLimitExpenses: number) => {
  // Send as FormData so backend [FromForm] binding works
  const form = new FormData();
  form.append("Amount", String(amount));
  form.append("DailyLimitExpenses", String(dailyLimitExpenses));
  return await axios.post(`${API_URL}/Expense/Create`, form, { withCredentials: true });
};

// Add Expense
export const addExpense = async (amount: number , description: string , category: string) => {
  const form = new FormData();
  form.append("Amount", String(amount));
  form.append("Note", description);
  form.append("Category", category);
  return await axios.post(`${API_URL}/Expense/AddExpense`, form, { withCredentials: true });
};

// Give Wage
export const giveWage = async (amount: number, personName: string) => {
  const form = new FormData();
  form.append("amount", String(amount));
  form.append("Amount", String(amount));
  form.append("personName", personName);
  form.append("PersonName", personName);
  return await axios.post(`${API_URL}/Expense/GiveWage`, form, { withCredentials: true });
};

export const sendOtp = async (data: { email: string }) => {
  return await axios.post(`${API_URL}/Auth/forgot-password`, data);
}

export const resetPassword = async (data: { email: string; otp: string; newPassword: string }) => {
  
  return await axios.post(`${API_URL}/Auth/reset-password`, data);
}

