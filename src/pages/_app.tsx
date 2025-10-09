import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {msalConfig} from "@/auth/msalConfig";
import {MsalProvider} from "@azure/msal-react";
import {EventType, PublicClientApplication} from "@azure/msal-browser";
import {useEffect} from "react";

export const msalInstance = new PublicClientApplication(msalConfig);


export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
    useEffect(() => {
        msalInstance.initialize().then(() => {
            // Account selection logic is app dependent. Adjust as needed for different use cases.
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                msalInstance.setActiveAccount(accounts[0]);
            }

            msalInstance.addEventCallback((event: any) => {
                if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
                    const account = event.payload.account;
                    msalInstance.setActiveAccount(account);
                }
            });
        });
    }, []);

    return <>
        <MsalProvider instance={msalInstance}>
            <Component {...pageProps} />
        </MsalProvider>
    </>
}
