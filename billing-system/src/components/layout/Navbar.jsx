import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    return (

        <div className="bg-white shadow px-8 py-4 flex justify-between items-center">

            <h2 className="font-semibold text-xl">

                Welcome, {user?.name}

            </h2>

            <button

                onClick={handleLogout}

                className="bg-red-600 text-white px-4 py-2 rounded"

            >

                Logout

            </button>

        </div>

    );

}