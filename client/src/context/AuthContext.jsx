import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";

const Context = React.createContext(null);

const ProviderWrapper = (props) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const accessToken = localStorage.getItem('bungie_access_token');
            const membershipId = localStorage.getItem('bungie_membership_id');
            
            if (accessToken && membershipId) {
                setUser({ 
                    token: accessToken, 
                    membershipId: membershipId 
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const authenticateWithBungie = async (code) => {
        try {
            const data = await authService.exchangeBungieToken(code);
            
            if (data.accessToken) {
                localStorage.setItem('bungie_access_token', data.accessToken);
                localStorage.setItem('destiny_membership_id', data.destinyMembershipId);
                localStorage.setItem('membership_type', data.membershipType);
                localStorage.setItem('display_name', data.displayName);
                
                setUser({ 
                    token: data.accessToken, 
                    destinyId: data.destinyMembershipId,
                    type: data.membershipType,
                    name: data.displayName
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erreur d'authentification Bungie:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('bungie_access_token');
        localStorage.removeItem('bungie_refresh_token');
        localStorage.removeItem('bungie_membership_id');
        setUser(null);
    };

    const exposedValue = {
        user,
        setUser,
        authenticateWithBungie,
        logout,
        loading
    };

    return (
        <Context.Provider value={exposedValue}>
            { props.children }
        </Context.Provider>
    );
};

export { Context, ProviderWrapper };