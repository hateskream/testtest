<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseDashboardComponent, BaseErrorComponent } from '@/modules/widgets/base';
import { ALL_COLUMNS } from '../model';
import { usePerformance } from '../composables';

import PerformanceFilter from './modals/performance-filters.vue';
import PerformanceLoader from './layouts/performance-loader.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./layouts/performance-view.vue'),
	loadingComponent: PerformanceLoader,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const {
	currentStock,
	currentDate,
	currentDisplayVariant,
	isCompactMode,
	resetAllChanges,
	tickers,
	isError,
	isLoading,
	currentSymbolDisplayVariant,
	activeMarket,
	quoteCurrency,
	refetch,
} = usePerformance(props.meta.widgetId, props.meta.defaultStateType);
</script>

<template>
	<base-dashboard-component
		:meta="props.meta"
		has-reset
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
	>
		<template #title>
			<span :class="classes.title">{{ props.meta.name }}</span>
		</template>

		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<performance-loader v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else-if="tickers.length"
				v-model:active-market="activeMarket"
				v-model:is-compact-mode="isCompactMode"
				v-model:display-variant="currentDisplayVariant"
				v-model:stock="currentStock!"
				v-model:date="currentDate"
				v-model:symbol-display="currentSymbolDisplayVariant"
				v-model:quote-currency="quoteCurrency"
				:rows="tickers"
				:columns="ALL_COLUMNS"
			/>
		</template>

		<template #filter>
			<performance-filter
				v-model:active-market="activeMarket"
				v-model:is-compact-mode="isCompactMode"
				v-model:display-variant="currentDisplayVariant"
				v-model:stock="currentStock"
				v-model:date="currentDate"
				v-model:symbol-display="currentSymbolDisplayVariant"
				v-model:quote-currency="quoteCurrency"
			/>
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.title {
	font-size: 12px;
	line-height: 1;
}
</style>
