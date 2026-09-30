import type { MaybeRefOrGetter } from 'vue';

export const Key = {
  for<TScope extends string, TName extends string>(
    scope: TScope,
    name: TName,
    ...params: MaybeRefOrGetter<unknown>[]
  ) {
    return [scope, name, ...params] as [
      TScope,
      TName,
      ...MaybeRefOrGetter<unknown>[],
    ];
  },

  scope<TScope extends string>(scope: TScope) {
    return [scope] as [TScope];
  },
};
