import type { ApiEndpoint, EndpointBody, EndpointResponse } from './schema';
import {
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

export const getApiBaseUrl = (): string => {
  return (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
};

export const normalizeError = (status: number): ApiError => ({
  status,
  message: 'Request failed',
});

const appendQueryValue = (
  params: URLSearchParams,
  key: string,
  value: QueryParamValue,
) => {
  if (value !== undefined) {
    params.append(key, String(value));
  }
};

const buildUrl = (path: string, query: RequestOptions['query']): string => {
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
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

const request = async <
  Endpoint extends EndpointFor<Method>,
  Method extends HttpMethod,
>(
  method: Method,
  path: Endpoint['path'],
  options: RequestOptions<EndpointBody<Endpoint>> = {},
): Promise<EndpointResponse<Endpoint>> => {
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
    if (isApiError(error)) {
      throw error;
    }

    throw normalizeError(0);
  }
};

export const api = {
  get: <Endpoint extends EndpointFor<'GET'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) => request<Endpoint, 'GET'>('GET', path, options),

  post: <Endpoint extends EndpointFor<'POST'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) => request<Endpoint, 'POST'>('POST', path, options),

  put: <Endpoint extends EndpointFor<'PUT'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) => request<Endpoint, 'PUT'>('PUT', path, options),

  patch: <Endpoint extends EndpointFor<'PATCH'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) => request<Endpoint, 'PATCH'>('PATCH', path, options),

  delete: <Endpoint extends EndpointFor<'DELETE'>>(
    path: Endpoint['path'],
    options?: RequestOptions<EndpointBody<Endpoint>>,
  ) => request<Endpoint, 'DELETE'>('DELETE', path, options),
};
