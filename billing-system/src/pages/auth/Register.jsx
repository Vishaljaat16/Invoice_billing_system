import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../api/authApi";

const Register = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        role: "staff",
        business_id: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {

        if (!formData.name.trim()) {
            toast.error("Name is required");
            return false;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            toast.error("Enter valid 10 digit phone");
            return false;
        }

        if (formData.password.length < 6) {
            toast.error("Password should be at least 6 characters");
            return false;
        }

        if (!formData.business_id) {
            toast.error("Business ID is required");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            setLoading(true);

            await register(formData);

            toast.success("Registration Successful");

            navigate("/login");

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.detail ||
                "Registration Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-slate-100">

            <div className="bg-white w-[420px] rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center mb-6">

                    Register

                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="accountant">Accountant</option>
                    </select>

                    <input
                        type="number"
                        name="business_id"
                        placeholder="Business ID"
                        value={formData.business_id}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                <p className="text-center mt-5">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold ml-2"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );
};

export default Register;