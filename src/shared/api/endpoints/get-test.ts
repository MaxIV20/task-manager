import { api, type RequestOptions } from '@/utils/api';

import type { Endpoints } from '../shared';

type Endpoint = Endpoints['test'];

export const name = 'test';
export const path = '/test' satisfies Endpoint['path'];
export type Data = Endpoint['response'];

export function getTest(options?: RequestOptions): Promise<Data> {
  return api.get<Endpoint>(path, options);
}
