# Feature Request API Contract

## POST `/api/v1/feature-request`

Отправка запроса на новую функциональность (feature request) с возможностью прикрепления изображений.

### Request

**Content-Type:** `multipart/form-data`

#### Поля формы

| Поле     | Тип               | Обязательное | Описание                                        |
| -------- | ----------------- | ------------ | ----------------------------------------------- |
| `text`   | `string`          | да           | Текст запроса на функциональность               |
| `images` | `[]file` (binary) | нет          | Прикрепленные изображения (множественные файлы) |

> Поле `images` может содержать несколько файлов — каждый файл добавляется под одним и тем же ключом `images`.

### Response

**Status:** `200 OK`

Тело ответа отсутствует (`void`).

---

## Go Structures

```go
// RequestFeaturePayload — тело запроса на создание feature request.
// Передается как multipart/form-data.
type RequestFeaturePayload struct {
	// Text — текст запроса на функциональность.
	Text string `form:"text" json:"text" binding:"required"`

	// Images — прикрепленные изображения (опционально, может быть несколько файлов).
	Images []*multipart.FileHeader `form:"images" json:"-"`
}
```
