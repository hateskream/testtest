# API Client

## Назначение

* Единая точка доступа к HTTP API.
* Типобезопасные ответы через `zod`.
* `Transformers` и `Schemas` для преобразования данных (`camelize`).
* Логирование ошибок валидации.

## Архитектура

```
 UI
      ↓
 Composable/Query
      ↓
 ApiClient
      ↓
 http-service (fetch)
      ↓
 Backend API
```

## Методы

```ts
api.get<T>(url, schema, options?)
api.post<T>(url, body, schema, options?)
api.put<T>(url, body, schema, options?)
api.delete<T>(url, schema, options?)
```

* Все методы валидируют ответ через `zod`.
* Возвращают типизированные данные.

## Использование

### Схема API

```ts
import { z } from 'zod';

export const userApiSchema = z.object({
  user_id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
});
```

### Схема с преобразованием (camelize)

```ts
import { z } from 'zod';
import { apiSchema } from '@/shared/service/api'

export const userSchema = apiSchema(z.object({
	user_id: z.number(),
	first_name: z.string(),
	last_name: z.string(),
}));

export type User = z.infer<typeof userSchema>;
```

### GET запрос

```ts
import { useApiClient } from '@/shared/service/api-client';
import { userSchema } from './schemas';

const api = useApiClient();
const user = await api.get('/users/1', userSchema);
user.firstName; // OK
```

### POST запрос

```ts
const createUserSchema = z.object({ id: z.number() });

await api.post('/users', { first_name: 'Ivan', last_name: 'Ivanov' }, createUserSchema);
```

## Ошибки схемы

* Если ответ API не соответствует схеме, выбрасывается `ZodError`.
* Логируется список issues и сырой payload.

## Рекомендации

1. Всегда используйте схемы.
2. Разделяйте apiSchema и domainSchema.
3. Один endpoint — один файл схем.
