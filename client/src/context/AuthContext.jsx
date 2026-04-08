import React, { useState, useEffect } from "react";
import { authService } from "../controller/authService";

const Context = React.createContext(null)

const ProviderWrapper = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authService.getme();
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (name, password) => {
        try {
            const data = await authService.login(name, password);
            
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            setUser(data.user || { name, token: data.token });
            return true;
        } catch (error) {
            console.error("Erreur de login:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const exposedValue = {
        user,
        setUser,
        login,
        logout,
        loading
    };

    return <Context.Provider value={exposedValue}>
        { props.children }
    </Context.Provider>  
}

export {    
    Context,
    ProviderWrapper,    
}  