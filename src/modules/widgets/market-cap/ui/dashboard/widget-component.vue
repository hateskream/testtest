<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import {
	BaseErrorComponent,
	BaseWidgetDashboard,
	ModalItemSwitch,
	WidgetContextMenu,
} from '@/modules/widgets/base';
import { MarketCapFiltersPanel, PreloaderComponent } from '../common';
import { useMarketCap } from './../../composables';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/base-view.vue'),
	loadingComponent: PreloaderComponent,
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
	selectedTickers,
	selectedMarkets,
	displaySettings,
	activeDateRange,
	data,
	isLoading,
	isError,
	refetch,
	resetAllChanges,
} = useMarketCap({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
});
</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<market-cap-filters-panel
				v-model:selected-tickers="selectedTickers"
				v-model:selected-markets="selectedMarkets"
				v-model:date-range="activeDateRange"
				:class="classes.filters"
				autofocus
				is-show-date-range
				display-variant="new"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else-if="data"
				v-model:date-range="activeDateRange"
				:data="data"
				:meta="meta"
				:display-settings="displaySettings"
				:class="classes.content"
			/>
		</template>

		<template #settings-menu>
			<widget-context-menu
				:title="props.meta.name"
				:dashboards="props.meta.dashboards"
				@reset="resetAllChanges"
				@delete="emit('delete')"
				@duplicate="emit('duplicate')"
				@move-to="emit('moveTo', $event)"
			>
				<template #change-display>
					<modal-item-switch v-model="displaySettings.isShowChart">Chart</modal-item-switch>
					<modal-item-switch v-model="displaySettings.isShowChange">Change, %</modal-item-switch>
				</template>
			</widget-context-menu>
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
