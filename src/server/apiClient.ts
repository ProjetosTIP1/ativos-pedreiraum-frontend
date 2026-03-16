import axios, { type AxiosResponse, AxiosError, type InternalAxiosRequestConfig } from "axios";

// =============================================================================
// TYPES
// =============================================================================

// Types for better type safety (following Interface Segregation Principle)
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Type for API error responses (defensive programming)
interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  code?: string;
}

// Extend Axios config to include metadata
declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

// =============================================================================
// CALLBACK REGISTRATION — Dependency Inversion
//
// The Infrastructure layer MUST NOT import from the Application layer.
// Instead we expose a registration function that main.tsx calls after the
// stores are initialised, wiring in the desired side-effects.
// This breaks the apiClient → stores → apiClient circular dependency.
// =============================================================================

type UnauthorizedHandler = () => void;
type ToastHandler = (message: string, type: string) => void;

let onUnauthorized: UnauthorizedHandler = () => {};
let onShowToast: ToastHandler = () => {};

/**
 * Call once at application startup (in main.tsx) **after** stores are ready.
 * This decouples the infrastructure layer from the application/store layer.
 */
export const registerAuthHandlers = (
  unauthorizedHandler: UnauthorizedHandler,
  toastHandler: ToastHandler,
) => {
  onUnauthorized = unauthorizedHandler;
  onShowToast = toastHandler;
};

// =============================================================================
// TYPE GUARDS
// =============================================================================

// Type guard to safely check if response data has error properties
const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  return typeof data === "object" && data !== null;
};

// =============================================================================
// AXIOS INSTANCE
// =============================================================================

const API_CONFIG = {
  baseURL: "/api/v1",
  timeout: 10000,
} as const;

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (import.meta.env.VITE_ENV_MODE === "development") {
      console.log(
        `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      );
    }
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// =============================================================================
// RESPONSE INTERCEPTOR
// =============================================================================

// Helper to safely extract error message from response data
const extractErrorMessage = (
  data: unknown,
  fallbackMessage: string,
): string => {
  if (!isApiErrorResponse(data)) return fallbackMessage;
  return data.message || data.detail || data.error || fallbackMessage;
};

// Helper to safely extract error code from response data
const extractErrorCode = (data: unknown): string | undefined => {
  if (!isApiErrorResponse(data)) return undefined;
  return data.code;
};

// Helper for default HTTP error messages
const getErrorMessage = (status: number): string => {
  const messages: Record<number, string> = {
    400: "Dados inválidos enviados",
    401: "Credenciais inválidas ou sessão expirada",
    403: "Acesso negado",
    404: "Recurso não encontrado",
    409: "Conflito nos dados",
    422: "Dados não processáveis",
    500: "Erro interno do servidor",
    502: "Servidor indisponível",
    503: "Serviço temporariamente indisponível",
  };
  return messages[status] ?? `Erro ${status}: Algo deu errado`;
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.VITE_ENV_MODE === "development") {
      const duration =
        new Date().getTime() -
        (response.config.metadata?.startTime?.getTime() ?? 0);
      console.log(`✅ API Success: ${response.status} - ${duration}ms`);
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = { message: "Erro desconhecido", status: 0 };

    if (error.response) {
      const { status, data } = error.response;
      apiError.status = status;
      apiError.message = extractErrorMessage(data, getErrorMessage(status));
      apiError.code = extractErrorCode(data);

      // Delegate side-effects to the registered handlers —
      // keeping the infrastructure layer completely store-agnostic.
      switch (status) {
        case 401:
          console.warn("🔐 Authentication expired - clearing local state");
          onUnauthorized();
          onShowToast("Sessão expirada.", "warning");
          break;
        case 403:
          console.warn("🚫 Access forbidden - insufficient permissions");
          onShowToast("Acesso negado.", "warning");
          break;
        case 500:
          console.error("💥 Server error - please try again later");
          onShowToast("Erro interno do servidor.", "error");
          break;
      }
    }

    return Promise.reject(apiError);
  },
);

export default apiClient;
