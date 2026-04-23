import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" })
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append("username", form.username)
        formData.append("password", form.password)

        try {
            const res = await API.post("/login", formData);
            localStorage.setItem("token", res.data.access_token);
            navigate("/");
        } catch (err) {
            alert("Login failed");
            console.log(err)
        }
    };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  )
}

