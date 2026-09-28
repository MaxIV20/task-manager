import type { HttpMethod } from './types';

export type ApiEndpoint<
  Method extends HttpMethod = HttpMethod,
  Path extends string = string,
  Response = unknown,
  Body = never,
> = {
  readonly method: Method;
  readonly path: Path;
  readonly response: Response;
  readonly body: Body;
};

export type EndpointBody<Endpoint> =
  Endpoint extends ApiEndpoint<HttpMethod, string, unknown, infer Body>
    ? Body
    : never;

export type EndpointResponse<Endpoint> =
  Endpoint extends ApiEndpoint<HttpMethod, string, infer Response, unknown>
    ? Response
    : never;
