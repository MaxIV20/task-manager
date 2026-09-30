import type { ApiEndpoint, EndpointBody, EndpointResponse } from './schema';
import {
  isAbortError,
  isApiError,
  type ApiError,
  type HttpMethod,
  type QueryParamValue,
  type RequestOptions,
} from './types';

type EndpointFor<Method extends HttpMethod> = ApiEndpoint<
  Method,
  string,
  unknown,
  unknown
>;

export function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
}

export function normalizeError(status: number): ApiError {
  return {
    status,
    message: 'Request failed',
  };
}

function appendQueryValue(
  params: URLSearchParams,
  key: string,
  value: QueryParamValue,
) {
  if (value !== undefined) {
    params.append(key, String(value));
  }
}

function buildUrl(path: string, query: RequestOptions['query']): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (Array.isArray(value)) {
      value.forEach((item) => appendQueryValue(params, key, item));
    } else {
      appendQueryValue(params, key, value);
    }
  }

  const search = params.toString();
  return `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}${search ? `?${search}` : ''}`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

async function request<
  Endpoint extends EndpointFor<Method>,
  Method extends HttpMethod,
>(
  method: Method,
  path: Endpoint['path'],
  options: RequestOptions<EndpointBody<Endpoint>> = {},
): Promise<EndpointResponse<Endpoint>> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(buildUrl(path, options.query), {
      method,
      headers,
      signal: options.signal,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
      throw normalizeError(response.status);
    }

    return (await parseResponseBody(response)) as EndpointResponse<Endpoint>;
  } catch (error) {
    if (isApiError(error) || isAbortError(error)) {
      throw error;
    }

    throw normalizeError(0);
  }
}

export const api = {
  get<Endpoint extends EndpointFor<'GET'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) {
    return request<Endpoint, 'GET'>('GET', path, options);
  },

  post<Endpoint extends EndpointFor<'POST'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) {
    return request<Endpoint, 'POST'>('POST', path, options);
  },

  put<Endpoint extends EndpointFor<'PUT'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) {
    return request<Endpoint, 'PUT'>('PUT', path, options);
  },

  patch<Endpoint extends EndpointFor<'PATCH'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) {
    return request<Endpoint, 'PATCH'>('PATCH', path, options);
  },

  delete<Endpoint extends EndpointFor<'DELETE'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) {
    return request<Endpoint, 'DELETE'>('DELETE', path, options);
  },
};
