"use client"
import React, { useState, createContext, useContext, useEffect } from "react"
import axios from "axios";
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

// Custom hook
export const useAuthContext = () => {
    return useContext(AuthContext);
}



export default function AuthProvider ({ children }) {
    const router = useRouter();

    
    
    // Variables
    const [token, setToken] = useState("");

    // Actions
    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { email, password });
            
            if (data.access_token) {
                setToken(data.access_token)
                router.push('/'); 
            }
        } catch (err) {
           console.log(err)
        }
    }

    const logout = () => {

        setToken(false);
        router.push('/');
    }

    

    // Value for Context.Provider
    const variables = {
        token
    }

    const actions = {
        login, 
        logout
    }

    return (
        <AuthContext.Provider value={{ variables, actions }}>
            {children}
        </AuthContext.Provider>
    )


}