# Ticker Section Guide

Документ описывает стандарт устройства секций на странице тикера.
Сначала следует ознакомиться с устройством виджетов в принципе - [base-widget.md](./base-widget.md)

---

## Реализация

- Секция должна поддерживать отображение под разные рынки, если это подразумевается дизайном
- Компонент секции не требует обязательных props - она грузится асинхронно и содержит виджеты, которые сами управляют загрузкой своих данных

## Структура и загрузка

Секции загружаются асинхронно через `section-layout.vue`, который управляет:

- Ленивой загрузкой компонента (IntersectionObserver)
- Кешированием компонентов для оптимизации
- Отображением скелетона во время загрузки
- Обработкой ошибок с возможностью повтора

## UI

- Представление секции должно находиться в каталоге `/modules/ticker/ui/sections`
- Каждая секция - это отдельная папка с компонентом и index файлом
- Секция содержит виджеты, которые отображают данные

**Структура папки:**
```
/modules/ticker/ui/sections/
├── section-name/
│   ├── index.ts
│   └── section-name.vue
```

**Пример реализации:**
```vue
<script setup lang="ts">
import { useTickerContext } from '../../composables';

const { tickerId, tickerType } = useTickerContext();
</script>

<template>
  <div class="section-name">
    <!-- Виджеты секции -->
  </div>
</template>

<style scoped>
.section-name {
  background: var(--bg-color-surface-00);
  color: var(--text-color-base-100);
}
</style>
```

## Props

Секция не требует prop`ов и получает контекст тикера через composable `useTickerContext()` (по факту провайд-инжект):
```ts
import { useTickerContext } from '@/modules/ticker/composables';

const { tickerId, tickerType } = useTickerContext();
```

## Регистрация секции

После создания секции необходимо:

1. Добавить тип секции в объект `TICKER_SECTION_COMPONENT`:
```ts
// В models/ticker-section.ts или аналогичном файле
export const TICKER_SECTION_COMPONENT = {
	TEST_SECTION_ONE: 'TEST_SECTION_ONE',
	TEST_SECTION_TWO: 'TEST_SECTION_TWO',
	TEST_SECTION_THREE: 'TEST_SECTION_THREE',
} as const;
```

2. Добавить loader в `use-section-loader.ts`:
```ts
const loaders: Record<string, () => Promise<Component>> = {
  // ... существующие loaders
  [TICKER_SECTION_COMPONENT.SECTION_NAME]: () =>
    import('@/modules/ticker/ui/sections/section-name')
      .then(m => m.SectionName),
};
```

3. Добавить секцию в конфигурацию разделов в `ticker-component.vue` через функцию `getChartSectionsByType()`:
```ts
// В моделях тикера
export const getChartSectionsByType = (type: TickerType) => {
  return {
    left: [
      // Секции для левой колонки
    ],
    center: [
      // Секции для центральной колонки
      TICKER_SECTION_COMPONENT.SECTION_NAME,
    ],
    right: [
      // Секции для правой колонки
    ],
  };
};

```

## ВАЖНОЕ ЗАМЕЧАНИЕ

Некоторые секции СОДЕРЖАТ ТОЛЬКО ЦЕНТРАЛЬНУЮ И ПРАВУЮ КОЛОНКУ
`@src/modules/ticker/ui/columns-layout.vue`
```
const hideLeftColumnTypes: TickerType[] = [TickerType.ETF];
```
В дальнейшем таких секций быть не должно, но на данном этапе - они есть

## Стилизация

Секция должна использовать CSS переменные дизайн-системы:

- `--bg-color-surface-00` - основной фон
- `--bg-color-surface-01` - фон с контрастом
- `--text-color-base-100` - основной цвет текста
- `--text-color-base-300` - дополнительный цвет текста

Содержимое секции должно быть гибким и адаптивным к ширине контейнера.

## Обработка ошибок

Ошибки загрузки секции автоматически обрабатываются `section-layout.vue`:

- Отображается сообщение об ошибке
- Предоставляется кнопка повтора загрузки
- При нескольких неудачных попытках отображается финальное сообщение об ошибке
