import { Phone } from "lucide-react";
import api from "./axios";

export const register = (data) => api.post("/register", data);

export const login = ({ phone, username, password }) => {
  const formData = new URLSearchParams();

  // OAuth2PasswordRequestForm expects "username"
  formData.append("username", username || phone);
  formData.append("password", password);

  return api.post("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const logout = () => api.post("/logout");

export const refreshToken = () => api.post("/refreshtoken");