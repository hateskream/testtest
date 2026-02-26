# Ticker Widget Guide

Документ описывает стандарт устройства виджетов на странице тикера.
Сначала следует ознакомиться с устройством виджетов в принципе - [base-widget.md](./base-widget.md)

---

## Реализация

- При доработке старого виджета старый код старого виджета не изменять. Скопировать в новый виджет, унифицировать, доработать, развивать далее. **Но не удалять и не менять**.
- Виджет должен поддерживать отображение под разные рынки, если это подразумевается дизайном
- Компонент представления должен иметь минимальный набор props:
```ts
meta: {
	tickerId: string;
};
```

## UI

- Представление виджета под страницу тикера должно находиться в каталоге `/widget/ui/ticker`.
- Если виджет имеет специфические составляющие, характерные только для страницы тикера, то их тоже следует класть в этот каталог
- Общие составляющие виджеты хранить в `widget/ui/common`
- Базовые компоненты представления можно найти в `@/modules/widgets/base/ticker`

**Пример представления:**

```vue
<script setup lang="ts">
import {
	BaseTickerWidgetWrapper,
	BaseTickerWidgetHeader,
	BaseTickerWidgetContent,
	BaseTickerWidgetError
} from '@/modules/widgets/base';
import { useWidget } from '../composables';

const props = defineProps<{
	meta: {
		tickerId: string;
	};
}>();

const { isLoading, isError, data, refetch } = useWidget(() => props.meta.tickerId);
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>Widget Name</base-ticker-widget-header>
		<base-ticker-widget-content>
				<widget-loading-component v-if="isLoading" />
				<widget-view v-else-if="data && !isError" :content="data" />
				<base-ticker-widget-error v-else-if="isError" @retry="refetch" />
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>
```
