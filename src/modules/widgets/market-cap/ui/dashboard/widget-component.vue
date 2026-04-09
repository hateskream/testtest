<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { useWidgetContext } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard, ModalItemSwitch, useWidgetState } from '@/modules/widgets/base';
import { MarketCapFiltersPanel, PreloaderComponent } from '../common';
import { useMarketCapState } from './../../composables';
import { getDefaultState, type IState } from '../../model';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/base-view.vue'),
	loadingComponent: PreloaderComponent,
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
	getDefaultState,
	onStateChange: (s) => updateState(s),
});

const {
	selectedTickers,
	selectedMarkets,
	displaySettings,
	activeDateRange,
	data,
	isLoading,
	isError,
	refetch,
	resetAllChanges,
} = useMarketCapState({ state });
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@delete="emits('delete')"
		@duplicate="emits('duplicate')"
		@move-to="emits('moveTo', $event)"
		@reset="resetAllChanges"
		@retry="refetch"
	>
		<template #filters>
			<market-cap-filters-panel
				v-model:selected-tickers="selectedTickers"
				v-model:selected-markets="selectedMarkets"
				v-model:date-range="activeDateRange"
				:class="classes.filters"
				display-variant="new"
				is-show-date-range
				autofocus
				@reset="resetAllChanges"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component
				v-else-if="isLoading || props.meta.isLoading"
				:display-variant="props.meta.activeDisplayVariant"
			/>
			<view-component
				v-else-if="data"
				v-model:date-range="activeDateRange"
				:data="data"
				:meta="meta"
				:display-settings="displaySettings"
				:class="classes.content"
			/>
		</template>
		<template #change-display>
			<modal-item-switch v-model="displaySettings.isShowChart">Chart</modal-item-switch>
			<modal-item-switch v-model="displaySettings.isShowChange">Change, %</modal-item-switch>
		</template>
	</base-widget-dashboard>
</template>

<style module="classes">
.filters {
	gap: 3px;
}

.content {
	padding-top: 12px;
	padding-bottom: 12px;
	padding-left: 20px;
}
</style>
