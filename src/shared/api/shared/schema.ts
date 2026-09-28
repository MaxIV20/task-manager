import type { ApiEndpoint } from '@/utils/api';

export type Test = {
  status: string;
};

export type Endpoints = {
  test: ApiEndpoint<'GET', '/test', Test>;
};
