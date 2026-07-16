import { createContext, useEffect, useState } from "react";
import { login as loginApi } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem("token") || ""
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (
            storedUser &&
            storedUser !== "undefined" &&
            storedUser !== "null"
        ) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Invalid user in localStorage:", err);
                localStorage.removeItem("user");
            }
        }

    }, []);

    const login = async (credentials) => {

        try {

            const response = await loginApi(credentials);

            /*
                Expected Backend Response

                {
                  access_token:"",
                  role:"",
                  user:{}
                }

            */

            const accessToken =
                response.data.access_token;

            const loggedUser =
                response.data.user;

            localStorage.setItem(
                "token",
                accessToken
            );

            localStorage.setItem(
                "user",
                JSON.stringify(loggedUser)
            );

            setToken(accessToken);

            setUser(loggedUser);

            return {
                success: true
            };

        } catch (error) {

            return {
                success: false,
                message:
                    error.response?.data?.detail ||
                    "Login Failed"
            };

        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setToken("");

        setUser(null);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                token,

                loading,

                login,

                logout

            }}

        >

            {children}

        </AuthContext.Provider>

    );

};