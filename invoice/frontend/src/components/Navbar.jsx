import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav style = {{ paddig: "10px" , background: "#eee"}}> 
        <Link to="/"> Dashboard </Link> | {" "}
        <Link to="/invoice"> Invoice </Link> | {" "}
        <Link to="/reports"> Reports </Link> | {" "}
        <Link to="/admin"> Admin </Link>

        <span style={{ float: "right" }}>
            {token ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <>
                <Link to="/login">Login</Link> | {" "}
                <Link to="/register">Register</Link>
                </>
            )}
        </span>

        </nav>
    )
}