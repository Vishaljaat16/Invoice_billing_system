import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [form, setForm] = useState({

        phone: "",

        password: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const result = await login(form);

        if (!result.success) {

            toast.error(result.message);

            return;

        }

        toast.success("Login Successful");

        const user = JSON.parse(localStorage.getItem("user"));

        switch (user.role) {

            case "admin":

                navigate("/dashboard/admin");

                break;

            case "staff":

                navigate("/dashboard/staff");

                break;

            case "accountant":

                navigate("/dashboard/accountant");

                break;

            default:

                navigate("/");

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white w-96 rounded-lg shadow-lg p-8 space-y-4"
            >

                <h2 className="text-3xl font-bold text-center">

                    Login

                </h2>

                <input

                    type="text"

                    name="phone"

                    placeholder="Phone"

                    className="border w-full p-3 rounded"

                    onChange={handleChange}

                />

                <input

                    type="password"

                    name="password"

                    placeholder="Password"

                    className="border w-full p-3 rounded"

                    onChange={handleChange}

                />

                <button

                    className="w-full bg-blue-600 text-white py-3 rounded"

                >

                    Login

                </button>

            </form>

        </div>

    );

}