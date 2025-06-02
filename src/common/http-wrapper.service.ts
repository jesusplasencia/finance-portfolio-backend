import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';
import { tryCatch, Result } from './result';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpWrapperService {
  private readonly logger = new Logger(HttpWrapperService.name);
  private token: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService
  ) {
    this.token = this.config.get("STOCK_API_KEY") || "";
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    options?: { params?: unknown; data?: unknown },
  ): Promise<Result<T, AxiosError>> {

    // attach token automatically on GET
    if (method === 'GET') {
      options = { ...(options ?? {}), params: { ...(options?.params ?? {}), token: this.token } };
    }

    const promise: Promise<T> = firstValueFrom(
      this.http
        .request<T>({ method, url, ...options })
        .pipe(
          catchError((err: AxiosError) => {
            // log and rethrow so that tryCatch can catch it
            this.logger.error(err.response?.data || err.message);
            throw err;
          }),
        ),
    ).then(response => response.data);

    // Wrap it in your tryCatch helper
    return tryCatch<T, AxiosError>(promise);
  }

  get<T>(url: string, params?: unknown) {
    return this.request<T>('GET', url, { params });
  }

  post<T>(url: string, data?: unknown) {
    return this.request<T>('POST', url, { data });
  }

  put<T>(url: string, data?: unknown) {
    return this.request<T>('PUT', url, { data });
  }

  patch<T>(url: string, data?: unknown) {
    return this.request<T>('PATCH', url, { data });
  }

  delete<T>(url: string, params?: unknown) {
    return this.request<T>('DELETE', url, { params });
  }
}
