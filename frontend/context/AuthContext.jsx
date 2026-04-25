"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session on mount
        const checkSession = () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            
            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setProfile(parsedUser);
                } catch (e) {
                    console.error("Error parsing stored user:", e);
                }
            }
            setLoading(false);
        };

        checkSession();
    }, []);

    const login = async (email, password, role) => {
        if (role === 'seller') {
            try {
                const res = await axios.post("http://localhost:5000/seller/login", { email, password });
                const data = res.data;
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.seller));
                setUser(data.seller);
                setProfile(data.seller);
                return data;
            } catch (sellerError) {
                throw new Error("Invalid login credentials");
            }
        } else if (role === 'user') {
            try {
                const res = await axios.post("http://localhost:5000/user/login", { email, password });
                const data = res.data;
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                setProfile(data.user);
                return data;
            } catch (userError) {
                throw new Error("Invalid login credentials");
            }
        } else {
            // Fallback trial-and-error for legacy calls
            try {
                const res = await axios.post("http://localhost:5000/user/login", { email, password });
                const data = res.data;
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                setProfile(data.user);
                return data;
            } catch (userError) {
                try {
                    const res = await axios.post("http://localhost:5000/seller/login", { email, password });
                    const data = res.data;
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.seller));
                    setUser(data.seller);
                    setProfile(data.seller);
                    return data;
                } catch (sellerError) {
                    throw new Error("Invalid login credentials");
                }
            }
        }
    };

    const signup = async (email, password, metadata) => {
        const endpoint = metadata.role === "seller" ? "/seller/add" : "/user/add";
        const payload = {
            email,
            password,
            ...metadata
        };
        
        try {
            const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Registration failed");
        }
    };

    const signOut = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setProfile(null);
        toast.success("Signed out successfully");
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, signup, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
