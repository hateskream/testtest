<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { useWidgetContext } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard, useWidgetState } from '@/modules/widgets/base';
import { usePerformanceState } from '../../composables';
import { ALL_COLUMNS, DisplayVariant, getDefaultState, type IState } from '../../model';

import PerformanceLoader from '../layouts/performance-loader.vue';
import PerformanceHeader from '../header/performance-header.vue';
import PerformanceFilter from '../modals/performance-filters.vue';

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

const { updateState } = useWidgetContext();

const { state } = useWidgetState<IState>({
	externalState: computed(() => props.meta.state as IState | undefined),
	getDefaultState: () => getDefaultState(props.meta.defaultStateType),
	onStateChange: (s) => updateState(s),
});

const limit = computed(() => props.meta.maxCountRowTable ?? 50);

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
} = usePerformanceState({
	state,
	defaultStateType: props.meta.defaultStateType,
	limit,
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
		@retry="refetch"
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
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<performance-loader
				v-else-if="isLoading || props.meta.isLoading"
				:display-variant="currentDisplayVariant"
			/>
			<view-component
				v-else-if="tickers.length"
				v-model:display-variant="currentDisplayVariant"
				:active-market="activeMarket"
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
