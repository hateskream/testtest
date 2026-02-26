# Base Widget Guide

Документ описывает стандарт устройства виджетов в проекте. Цель — обеспечить единый, предсказуемый подход к разработке, поддержке и масштабированию виджетов, а также упростить онбординг.

---

## Назначение виджета

Виджет — это изолированный модуль, который:

* реализует конкретную бизнес‑метрику или визуализацию;
* может использоваться в нескольких контекстах отображения (Dashboard / TV / Ticker);

Каждый виджет разрабатывается как автономный модуль.

---

## Базовая структура

Каждый виджет располагается в собственной директории, например `modules/widgets/fear-greed/`:

```
fear-greed/
├── api/
├── queries/
├── model/
├── ui/
│   ├── common/
│   ├── dashboard/
│   ├── ticker/
│   └── tv/
├── composables/
└── index.ts (для реэкспорта допустимых частей)
```

Ниже — назначение каждой части.

---

## api/

**Назначение:**

* работа с запросами к API;
* описание контрактов API;
* mock‑реализация.

**Правила:**

* API‑контракты описываются строго внутри `api`;
* компоненты и composables **не должны** напрямую использовать типы из `api`;
* при отсутствии реального backend — данные мокаются, но контракты проектируются как реальные.
* ошибки логируются в `Sentry` через сервис `monitoring`

**Пример:**
```ts
import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { ActivityMetricsSchema } from '../model';
import type { IActivityMetricsRequest } from './contract';
import { getMockData } from './mock';

const IS_USE_MOCK = true;

export async function getActivityMetrics(request: IActivityMetricsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return apiClient.get('/api/v1/insights-activity/data', apiSchema(ActivityMetricsSchema), {
			query: {
				ticker_id: request.tickerId,
			},
		});

	} catch (error) {
		logger.error('Failed to get ticker activity metrics', { error: error as Error });
		throw error;
	}
}

```

---

## queries/

**Назначение:**

* query / mutation слой (у нас это TanStack Query);
* инкапсуляция логики загрузки данных;
* использование `api` и маппинг данных в `model`.

**Правила:**

* queries используют `api`, но возвращают данные **в терминах model**;
* вся логика кеширования, refetch, loading/error состояний — здесь.
* параметры, передаваемый в query, определяем как `MaybeRefOrGetter`, чтобы одновременно поддерживать возможность передавать как реактивные значения, так и статичные

**Пример:**
```ts
import { useQuery } from '@tanstack/vue-query';
import { getDominanceHistory } from '../api';
import { mapDominanceHistoryResponseToModel } from '../model';

export function useQueryDominanceHistory(
	tickers: MaybeRefOrGetter<string[]>,
	range: MaybeRefOrGetter<string>,
) {
	return useQuery({
		queryKey: computed(() => ['dominance', toValue(tickers), toValue(range)]),
		queryFn: async () => {
			const response = await getDominanceHistory({
				tickers: toValue(tickers),
				range: toValue(range),
			});

			return mapDominanceHistoryResponseToModel(response);
		},
	});
}
```

---

## model/

**Назначение:**

* доменные модели виджета;
* интерфейсы, enum'ы, константы, маппинг;
* типы, используемые UI и composables.

**Ключевой принцип:**

> model **не зависят** от api контрактов.

При изменении API:

* обновляется `api`;
* адаптируются маппер для `queries`;
* UI и composables не затрагиваются.

**Пример структуры**

```
model/
├── chart.ts // основная модель Chart.
├── filters.ts // описание фильтров. Лейблы, возможные значения, конфиги.
├── state.ts // описание state к виджету. Например, виджет может запоминать выбранные фильтры (стейт).
├── mappers.ts // мапперы данных из одной структуры в другую
└── index.ts // для реэкспорта только допустимых данных наружу
```

---

## ui/

Слой визуальных компонентов.

### Структура

```
ui/
├── common/
├── dashboard/
├── ticker/
└── tv/
```

### common/

* базовые компоненты виджета;
* логика отображения;
* переиспользуются во всех представлениях.

Примеры:

* основной компонент виджета;
* графики, индикаторы;
* элементы управления состоянием.

### dashboard / ticker / tv

* сборки виджета под конкретное представление;
* отвечают **только** за layout и внешнее оформление;
* используют компоненты из `common`;
* у виджета обязательно должно быть состояние загрузки и ошибки.

Различия между представлениями должны быть минимальными и оправданными.

---

## composables/

**Назначение:**

* переиспользуемая логика виджета;
* работа с состоянием, computed, side‑effects;
* интеграция с queries.
* параметры, передаваемый в composable, определяем как `MaybeRefOrGetter`, чтобы одновременно поддерживать возможность передавать как реактивные значения, так и статичные


**Примеры:**

* `useFearGreed()`
* `useDominanceHistory()`

---

## Базовые компоненты виджетов

Общие компоненты находятся в:

```
modules/widgets/base/
```

Примеры:

* `BaseLoaderComponent`
* `BaseErrorComponent`
* `BaseTickerWidgetError`

**Правила:**

* виджеты могут использовать базовые компоненты для loading / error состояний;
* не дублировать общую логику обработки ошибок внутри виджетов;

---

## Процесс создания нового виджета

1. Создать директорию виджета.
2. Создать доменные модели в `model/`.
3. Описать API‑контракты и mock‑ответы в `api/`.
4. Реализовать queries с маппингом API → model через zod.
5. Вынести бизнес‑логику в composables.
6. Реализовать UI:
	* core‑компоненты в `ui/common`;
	* представления в `ui/dashboard`, `ui/ticker`, `ui/tv`.

---

## Ключевые принципы

* изоляция API контрактов;
* минимальные различия между представлениями;
* переиспользование common и base компонентов;
* отсутствие бизнес‑логики в layout‑компонентах;
* единая структура для всех виджетов.

Следование этим правилам обеспечивает масштабируемость и поддерживаемость системы виджетов.
