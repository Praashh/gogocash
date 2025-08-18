import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { HTTP_CONFIG } from "./config";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
}

interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  retry: RetryConfig;
  headers?: Record<string, string>;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export class SecureHttpClient {
  private client: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("❌ Request error:", error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error("❌ Response error:", {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
        });
        return Promise.reject(error);
      },
    );
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    attempt: number = 1,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= this.config.retry.maxAttempts) {
        throw error;
      }

      const delay =
        this.config.retry.delay *
        Math.pow(this.config.retry.backoffMultiplier, attempt - 1);
      console.log(
        `🔄 Retry attempt ${attempt}/${this.config.retry.maxAttempts} in ${delay}ms`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.retryWithBackoff(operation, attempt + 1);
    }
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResult<T>> {
    try {
      const response = await this.retryWithBackoff(() =>
        this.client.get<T>(url, config),
      );

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResult<T>> {
    try {
      const response = await this.retryWithBackoff(() =>
        this.client.post<T>(url, data, config),
      );

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private handleError<T>(error: unknown): ApiResult<T> {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message || error.message || "Unknown error";

      return {
        success: false,
        error: message,
        statusCode,
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      error: errorMessage,
      statusCode: 500,
    };
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.client.defaults.headers.common["Authorization"];
  }
}

export const httpClient = new SecureHttpClient({
  baseURL: "",
  timeout: HTTP_CONFIG.TIMEOUT,
  retry: {
    maxAttempts: HTTP_CONFIG.RETRY_ATTEMPTS,
    delay: HTTP_CONFIG.RETRY_DELAY,
    backoffMultiplier: 2,
  },
});
