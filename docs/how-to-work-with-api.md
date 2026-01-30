# How to work with API

Данный файл описывает как удобно работать с API в проекте, используя схемы валидации.

В нашем проекте для работы со схемами используется `zod`

---

## useApiClient()

Сервис для формирования запросов к API. Требует схему валидации (в нашем случае zod).

**Правила:**

- Формируем схему для модели (используем zod)
- На фронтенде и в схеме используем преимущественно `camelCase`
- Бекенд чаще всего должен отдавать в `snake_case`, поэтому для решения проблемы маппинга используем `apiSchema()`
- `apiSchema()` расширит переданную в нее схему и займется преобразованием `snake_case => camelCase`
- `apiClient` сам выведет тип, исходя из схемы. Типизировать его через `as` или другими способами нет необходимости

**Пример:**
```ts
// ../activity-metrics/model
import { z } from 'zod';

enum MarketType { ... };

export const ActivityMetricsSchema = z.object({
	marketType: z.nativeEnum(MarketType),
	volume24h: z.string(),
	sector: z.string().optional(),
})
```

```ts
// ../activity-metrics/api
import { useApiClient, apiSchema } from "@/shared/service/api";
import { useLogger } from "@/shared/service/monitoring";
import { ActivityMetricsSchema } from "@/modules/widgets/activity-metrics"

export async function getActivityMetrics(request: IActivityMetricsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
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

## Как мне получить тип для использования?

Используйте `z.infer`

```ts
const schema = z.object({ ... });

type schemaType = z.infer<typeof schema>;
```
