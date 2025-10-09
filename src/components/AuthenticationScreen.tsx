import React, {useEffect} from 'react';
import {AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal} from "@azure/msal-react";
import {InteractionType} from "@azure/msal-browser";
import {getAzureToken} from "@/auth/msalConfig";
import {msalInstance} from "@/pages/_app";
import {useAtom} from "jotai";
import {azureTokenAtom, isAuthenticatedAtom} from "@/store/fileManagerAtoms";

const AuthenticationScreen = () => {
    const {instance}: any = useMsal();
    const isMsAuthenticated = useIsAuthenticated();
    const [azureToken, setAzureToken] = useAtom(azureTokenAtom);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

    const handleLogin = () => {
        instance.loginPopup({interactionType: InteractionType.Popup});
    };

    const handleLogout = () => {
        instance.logoutPopup({interactionType: InteractionType.Popup});
    };

    useEffect(() => {
        setIsAuthenticated(isMsAuthenticated);

        if (!msalInstance.getActiveAccount()) return;
        getAzureToken(msalInstance)
            .then((res) => {
                setAzureToken(res);
            });
    }, [isMsAuthenticated]);

    return (
        <div>
            <AuthenticatedTemplate>
                <h2>Welcome! You are authenticated.</h2>
                <button  className="p-2 px-4 bg-black text-white font-bold" onClick={handleLogout}>Logout</button>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <h2>Please log in to continue.</h2>
                <button className="p-2 px-4 bg-black text-white font-bold" onClick={handleLogin}>Login</button>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default AuthenticationScreen;
