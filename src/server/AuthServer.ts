import apiClient, { type ApiError } from "./apiClient";

import type { Colaborador, MSAuthResponse } from "../schemas/schemas";
import {
  ColaboradorSchema,
  IsAdminResponseSchema,
  MSAuthResponseSchema,
} from "../schemas/schemas";

class AuthServer {
  static instance: AuthServer;

  private constructor() {}

  public static getInstance(): AuthServer {
    if (!AuthServer.instance) {
      AuthServer.instance = new AuthServer();
    }
    return AuthServer.instance;
  }

  public async login({
    cpf_cnpj,
    password,
  }: {
    cpf_cnpj: string;
    password: string;
  }): Promise<void> {
    try {
      // Prepare form data for OAuth2 password grant
      const formData = new URLSearchParams();
      formData.append("username", cpf_cnpj);
      formData.append("password", password);
      formData.append("grant_type", "password");

      const response = await apiClient.post("/o/token", formData, {
        baseURL: "",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to authenticate");
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error logging in:", apiError);
      throw apiError;
    }
  }

  public async fetchUser(): Promise<Colaborador> {
    try {
      const response = await apiClient.get<Colaborador>(`/o/me`, {
        baseURL: "", // Use empty baseURL to ensure it goes to the proxy
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      // Validate the response shape at the infrastructure boundary.
      // A ZodError here means the backend contract changed — fail fast.
      return ColaboradorSchema.parse(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error fetching user:", apiError);
      throw apiError;
    }
  }

  public async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate session/cookie on the server
      await apiClient.post("/o/logout", null, {
        baseURL: "",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Session successfully cleared on the server.");
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error during server logout:", apiError);
    }
  }

  public async validateCpfCnpj(cpfCnpj: string): Promise<boolean> {
    try {
      const response = await apiClient.post(
        "/users/is-admin",
        null,
        {
          baseURL: "",
          params: { cpf_cnpj: cpfCnpj },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      // Parse with the narrow schema — is_admin is fully typed as boolean.
      const parsed = IsAdminResponseSchema.parse(response.data);
      return parsed.data.is_admin;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error validating CPF/CNPJ:", apiError);
      throw apiError;
    }
  }

  public async validateMsToken(token: string): Promise<MSAuthResponse> {
    try {
      const response = await apiClient.post<MSAuthResponse>(
        "/o/microsoft/validate",
        { token },
        {
          baseURL: "",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      return MSAuthResponseSchema.parse(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error validating Microsoft token:", apiError);
      throw apiError;
    }
  }
}

export default AuthServer.getInstance();
