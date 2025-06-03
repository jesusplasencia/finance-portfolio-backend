import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';
import { tryCatch, Result } from './result';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpWrapperService implements OnModuleInit {
  private readonly logger = new Logger(HttpWrapperService.name);
  private token: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    this.token = this.config.get<string>('STOCK_API_KEY')!;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    options?: { params?: unknown; data?: unknown },
  ): Promise<Result<T, AxiosError>> {
    // attach token automatically on GET
    if (method === 'GET') {
      options = {
        ...(options ?? {}),
        params: { ...(options?.params ?? {}), token: this.token },
      };
    }

    const promise: Promise<T> = firstValueFrom(
      this.http.request<T>({ method, url: endpoint, ...options }).pipe(
        catchError((err: AxiosError) => {
          // log and rethrow so that tryCatch can catch it
          this.logger.error(err.response?.data || err.message);
          throw err;
        }),
      ),
    ).then((response) => response.data);

    // Wrap it in your tryCatch helper
    return tryCatch<T, AxiosError>(promise);
  }

  get<T>(endpoint: string, params?: unknown) {
    return this.request<T>('GET', endpoint, { params });
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>('POST', endpoint, { data });
  }

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>('PUT', endpoint, { data });
  }

  patch<T>(endpoint: string, data?: unknown) {
    return this.request<T>('PATCH', endpoint, { data });
  }

  delete<T>(endpoint: string, params?: unknown) {
    return this.request<T>('DELETE', endpoint, { params });
  }
}
