# Ticker Section Guide

Документ описывает стандарт устройства секций на странице тикера.
Сначала следует ознакомиться с устройством виджетов в принципе - [base-widget.md](./base-widget.md)

---

## Реализация

- Секция должна поддерживать отображение под разные рынки, если это подразумевается дизайном
- Компонент секции имеет только следующие props:
```ts
interface ISectionProps {
	section: ISectionItem;
}
```

## Структура и загрузка

Секции загружаются асинхронно через `ticker-section.vue`, который управляет:

- Ленивой загрузкой компонента (IntersectionObserver)
- Кешированием компонентов для оптимизации
- Отображением скелетона во время загрузки
- Обработкой ошибок с возможностью повтора

## UI

- Представление секции должно находиться в каталоге `/modules/ticker/ui/sections/[market]` (например, `/modules/ticker/ui/sections/crypto/overview-section.vue`)
- Каждая секция - это отдельный vue-файл, реэкспортируемый из `index.ts` внутри `sections/[market]`
- Секция содержит виджеты, которые отображают данные

**Структура папки:**
```
/modules/ticker/ui/sections/
├── [market]/
│   ├── index.ts
│   └── section-name.vue
```

**Пример реализации:**
```vue
<script setup lang="ts">
import { ActivityMetricsTickerWidget } from '@/modules/widgets/activity-metrics';
import { useTickerContext } from '../../composables';

const { tickerId } = useTickerContext();
</script>

<template>
  <div class="classes.section">
    <activity-metrics-ticker-widget :meta="{ tickerId, name: 'Activity Metrics' }" />
  </div>
</template>

<style module="classes">
.section {
  background: var(--bg-color-surface-00);
  color: var(--text-color-base-100);
}
</style>
```

## Данные о тикере

Получить данные о тикере можно из контекста модуля через composable `useTickerContext()` (провайд-инжект под капотом):
```ts
import { useTickerContext } from '@/modules/ticker/composables';

const { tickerId } = useTickerContext();
```

## Регистрация секции

После создания секции необходимо:

1. Добавить название секции в объект `TICKER_SECTION_COMPONENT`:
```ts
// В models/sections/sections.ts
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

3. Добавить секцию в конфигурацию маркета в `models/sections/[market]`:
```ts
// Пример конфигурации
import { type ITickerWidgetSections } from './sections';

export const tickerEtfSections = {
	left: [
		{
			id: 'overview',
			title: 'Overview',
			component: 'STOCK_OVERVIEW',
			height: 1000,
		},
	],
	center: [
		{
			id: 'valuation',
			title: 'Valuation & Estimates',
			component: 'STOCK_VALUATION_AND_ESTIMATES',
			height: 200,
		},
	],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'STOCK_INSIGHTS_AND_ACTIVITY',
			height: 1000,
		},
	],
} as const satisfies ITickerWidgetSections;
```

## ВАЖНОЕ ЗАМЕЧАНИЕ

Если виджет не содержит центральной колонки, а только левую и правую, то поле `center` можно оставить пустым

Пример:
```ts
export const chartForexSections: IChartWidgetSections = {
	left: [
		{
			id: 'price-performance',
			title: 'Performance',
			component: CHART_SECTION_COMPONENT.PRICE_PERFORMANCE,
		},
		{
			id: 'explorer',
			title: 'Explorer',
		},
	],
	center: [],
	right: [
		{
			id: 'insight-and-activity',
			title: 'Insight',
			component: CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY,
		},
	],
} as const;
```

## Что делать, если для одного Market может быть разная конфигурация секций?

На данный момент существуют маркеты (forex), для которых есть несколько конфигураций секций.

Например, USD-тикеры должны отображать секцию `us-macroeconomic-indicators`.

Для решения такой задачи можно описать функцию, которая принимает `tickerId` и на основе его анализа возвращает определенную конфигурацию.

Пример:

```ts
// config
const config = {
	...
	[TickerType.FOREX]: getForexTickerSections,
	...
}

// sections/forex.ts
const tickerCommonForexSections = { ... }
const tickerUsForexSections = { ... }

function isUsdForexTicker(tickerId: string) { ... }

export const getForexTickerSections = (
	tickerId: string,
): ITickerWidgetSections => {
	if (isUsdForexTicker(tickerId)) {
		return tickerUsForexSections;
	}

	return tickerCommonForexSections;
};
```

## Стилизация

Секция должна использовать CSS переменные дизайн-системы:

- `--bg-color-surface-00` - основной фон
- `--bg-color-surface-01` - фон с контрастом
- `--text-color-base-100` - основной цвет текста
- `--text-color-base-300` - дополнительный цвет текста

Содержимое секции должно быть гибким и адаптивным к ширине контейнера.

## Обработка ошибок

Ошибки загрузки секции автоматически обрабатываются `ticker-section.vue`:

- Отображается сообщение об ошибке
- Предоставляется кнопка повтора загрузки
- При нескольких неудачных попытках отображается финальное сообщение об ошибке
