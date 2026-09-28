export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParamValue = string | number | boolean | undefined;

export type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;

export type RequestOptions<Body = never> = {
  body?: Body;
  headers?: HeadersInit;
  query?: QueryParams;
  signal?: AbortSignal;
};

export type ApiError = {
  status: number;
  message: string;
};

export const isApiError = (value: unknown): value is ApiError => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    typeof value.status === 'number' &&
    'message' in value &&
    typeof value.message === 'string'
  );
};
