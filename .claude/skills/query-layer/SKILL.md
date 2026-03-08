---
name: query-layer
description: How to write TanStack Query hooks in this project. Use when creating useQuery, useInfiniteQuery hooks, or working with queryClient and real-time updates.
---

# Query Layer Pattern

Query files live in `module/queries/` — one hook per file.

## File structure

```
queries/
├── use-query-<name>.ts    # One file per query hook
└── index.ts               # Re-exports
```

## Simple useQuery (most widgets)

```typescript
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { get<Name> } from '../api';

export function useQuery<Name>() {
  return useQuery({
    queryKey: ['<name>'],
    queryFn: () => get<Name>(),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });
}
```

## useQuery with reactive params

```typescript
import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';
import { get<Name> } from '../api';

export function useQuery<Name>(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['<name>', id],   // reactive refs in queryKey auto-track
    queryFn: () => get<Name>({ id: toValue(id) }),
  });
}
```

## useInfiniteQuery (paginated lists, e.g. price widget)

```typescript
import { useInfiniteQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';
import { get<Name> } from '../api';

export function useQuery<Name>(
  filters: MaybeRefOrGetter<IFilters>,
  limit: MaybeRefOrGetter<number>,
) {
  return useInfiniteQuery({
    queryKey: ['<name>', filters, limit],
    queryFn: ({ pageParam = 0 }) =>
      get<Name>({
        offset: pageParam,
        limit: toValue(limit),
        filters: toValue(filters),
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { total, offset } = lastPage.pagination;
      const nextOffset = offset + toValue(limit);
      return nextOffset < total ? nextOffset : undefined;
    },
  });
}
```

## Real-time updates via CellUpdater

When a query needs live WebSocket updates (e.g. price tickers):

```typescript
import { useInfiniteQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, onUnmounted, toValue } from 'vue';
import { CellUpdater, type Message } from '@/shared/service/real-time';
import { type QueryData, updateInfiniteQueryData } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import { ColumnType } from '@/modules/cell';

export function useQuery<Name>(market: MaybeRefOrGetter<MarketType>, limit: MaybeRefOrGetter<number>) {
  const cellUpdater = CellUpdater.getInstance();

  // Register real-time column updates
  cellUpdater.register(ColumnType.PriceCurrent, (updatedData) => {
    queryClient.setQueryData(
      ['<name>', toValue(market), limit],
      (oldData: QueryData<I<Name>Data>) => updateQueryData(oldData, updatedData),
    );
  });

  onUnmounted(() => { cellUpdater.disconnect(); });

  return useInfiniteQuery({ /* ... */ });
}

function updateQueryData<T>(oldData: QueryData<I<Name>Data>, updatedData: Message<T>) {
  return updateInfiniteQueryData(oldData, (page) => ({
    ...page,
    items: page.items.map((item) =>
      item.tickerId === updatedData.tickerId ? { ...item, ...updatedData } : item,
    ),
  }));
}
```

## Key rules

- `queryKey` must include all reactive params that affect the query result
- Use `MaybeRefOrGetter<T>` for params, unwrap with `toValue()` inside `queryFn`
- `keepPreviousData` — use for queries where stale data is better than loading flash
- `refetchOnMount: false` — use when data is long-lived and doesn't need re-fetch on component mount
- Real-time: `CellUpdater.getInstance()` + `onUnmounted(() => cellUpdater.disconnect())`
- `queryClient` from `@/shared/service/query-client` for manual cache updates
- index.ts: `export { useQuery<Name> } from './use-query-<name>';`
