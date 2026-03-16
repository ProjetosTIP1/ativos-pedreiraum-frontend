import { PublicClientApplication, LogLevel } from "@azure/msal-browser";
import type { Configuration } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID || "YOUR_CLIENT_ID",
    authority:
      import.meta.env.VITE_MSAL_AUTHORITY ||
      "https://login.microsoftonline.com/common",
    redirectUri:
      import.meta.env.VITE_MSAL_REDIRECT_URI ||
      "http://localhost:5173/redirect",
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

// Create a single instance of the PublicClientApplication
export const msalInstance = new PublicClientApplication(msalConfig);

// Helper to ensure instance is initialized before use
export const initializeMsal = async () => {
  try {
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise({ navigateToLoginRequestUrl: false });
    console.log("MSAL Initialized.");
  } catch (error) {
    console.error("MSAL initialization failed:", error);
  }
};
