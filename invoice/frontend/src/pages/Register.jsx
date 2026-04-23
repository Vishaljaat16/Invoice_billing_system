import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import API from "../api";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        password: "",
        role: "",
        bussiness_id: ""
    })

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post("/register", form);
        navigate("/login");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <label for="roles">Choose a Role</label>
                <select  name="roles">
                <option value="admin">Admin</option>
                <option value="accountant">Accountant</option>
                <option value="staff">Staff</option>
                </select>
            <input placeholder="Bussiness ID" onChange={(e) => setForm({ ...form, bussiness_id: e.target.value })} />

            <button type="submit">Register</button>
        </form>
    )
}