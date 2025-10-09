export const msalConfig: any = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common", // + process.env.NEXT_PUBLIC_AZURE_TENANT_ID,
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["AllSites.Manage", "MyFiles.Write"],
};

export const getAzureToken = async (msalInstance: any) => {
  try {
    const res = await msalInstance?.initialize();
    const accounts = await msalInstance?.getAllAccounts();

    if (!accounts?.length) return;

    const authResult = await msalInstance?.acquireTokenSilent({
      account: accounts[0],
      scopes: loginRequest.scopes,
    });

    return authResult?.accessToken;
  } catch (e) {
    console.error(e);
  }
};
