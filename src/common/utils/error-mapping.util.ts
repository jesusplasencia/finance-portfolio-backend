// src/common/utils/error-mapping.util.ts

import { HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';

export interface MappedError {
  statusCode: number;
  message: string;
}

/**
 * Type‐guard for AxiosError<T>.
 * Ensures err is an object, has the `isAxiosError` flag set true.
 */
export function isAxiosError<T = any>(err: unknown): err is AxiosError<T> {
  return (
    typeof err === 'object' &&
    err !== null &&
    'isAxiosError' in err &&
    (err as AxiosError<T>).isAxiosError === true
  );
}

/** Type‐guard for Nest’s HttpException */
export function isHttpException(err: unknown): err is HttpException {
  return err instanceof HttpException;
}

/**
 * Map any thrown error to a statusCode + tailored message.
 */
export function mapError(err: unknown): MappedError {
  let statusCode: number;
  let message: string;

  if (isAxiosError(err)) {
    statusCode = err.response?.status ?? 500;
    message = err.message || 'An unexpected HTTP error occurred.';
  } else if (isHttpException(err)) {
    statusCode = err.getStatus();
    const response = err.getResponse();
    if (typeof response === 'string') {
      message = response;
    } else if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const msg = response?.message;
      message = Array.isArray(msg) ? msg.join(', ') : String(msg);
    } else {
      message = err.message;
    }
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  } else {
    statusCode = 500;
    message = 'An unknown error occurred';
  }

  // Tailor common statuses
  switch (statusCode) {
    case 400:
      message = message || 'Bad Request';
      break;
    case 401:
      message = message || 'Unauthorized';
      break;
    case 403:
      message = message || 'Forbidden: you lack permission.';
      break;
    case 404:
      message = message || 'Not Found: the resource is missing.';
      break;
    case 429:
      message =
        message ||
        'Too Many Requests: rate limit exceeded, please retry later.';
      break;
    case 500:
      message =
        message || 'Internal Server Error: something went wrong on our end.';
      break;
  }

  return { statusCode, message };
}
