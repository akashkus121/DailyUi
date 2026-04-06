import axios from "axios";
import { LoginRequest, submitDailyHealth, UserRegisterRequest } from "../types/authTypes";

const API_URL = "https://localhost:5001/api";

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
  return await axios.get(`${API_URL}/Auth/dashboard-json`, {
    withCredentials: true,
  });
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