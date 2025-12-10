<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { ALL_COLUMNS, DisplayVariant } from '../../model';
import { usePerformance } from '../../composables';

import PerformanceLoader from '../layouts/performance-loader.vue';
import PerformanceHeader from '@/modules/widgets/performance/ui/header/performance-header.vue';
import PerformanceFilter from '@/modules/widgets/performance/ui/modals/performance-filters.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../layouts/performance-view.vue'),
	loadingComponent: PerformanceLoader,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emits = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const {
	currentStock,
	currentDate,
	currentDisplayVariant,
	isCompactMode,
	tickers,
	isError,
	isLoading,
	currentSymbolDisplayVariant,
	activeMarket,
	quoteCurrency,
	refetch,
	resetAllChanges,
} = usePerformance({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
});
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="currentDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@update:active-display-variant="(val) => currentDisplayVariant = val as DisplayVariant"
		@delete="emits('delete')"
		@duplicate="emits('duplicate')"
		@move-to="emits('moveTo', $event)"
		@reset="resetAllChanges"
	>
		<template #filters>
			<performance-header
				v-model:active-market="activeMarket"
				v-model:display-variant="currentDisplayVariant"
				v-model:stock="currentStock"
				v-model:date="currentDate"
				v-model:quote-currency="quoteCurrency"
				v-model:symbol-display="currentSymbolDisplayVariant"
				display-style="new"
				@reset="resetAllChanges"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<performance-loader v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else-if="tickers.length"
				v-model:display-variant="currentDisplayVariant"
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
				display-source="new"
			/>
		</template>
	</base-widget-dashboard>
</template>

<style module="classes">
.title {
	font-size: 12px;
	line-height: 1;
}
</style>
