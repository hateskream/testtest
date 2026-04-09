<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { useWidgetContext } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard, ModalItemSwitch, useWidgetState } from '@/modules/widgets/base';
import { PreloaderComponent } from '../common';
import { useDominanceState } from '../../composables';
import { getDefaultState, type IState } from '../../model';

import DominanceFiltersPanel from '../common/dominance-filters-panel.vue';

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
	displaySettings,
	selectedTickers,
	activeDateRange,
	data,
	isLoading,
	isError,
	refetch,
	resetAllChanges,
} = useDominanceState({ state });
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
			<dominance-filters-panel
				v-model:selected-tickers="selectedTickers"
				v-model:date-range="activeDateRange"
				:meta="props.meta"
				:display-settings="displaySettings"
				:class="classes.filters"
				display-variant="new"
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
				v-else-if="data?.length"
				v-model:date-range="activeDateRange"
				:selected-tickers="selectedTickers"
				:data="data"
				:meta="props.meta"
				:display-settings="displaySettings"
				:class="classes.content"
			/>
		</template>

		<template #change-display>
			<modal-item-switch v-model="displaySettings.isShowIndicator">Segmented indicator</modal-item-switch>
			<modal-item-switch v-model="displaySettings.isShowHistorical">Historical values</modal-item-switch>
			<modal-item-switch v-model="displaySettings.isShowChart">Chart</modal-item-switch>
		</template>
	</base-widget-dashboard>
</template>

<style module="classes">
.filters {
	gap: 3px;
}

.content {
	padding: 24px 20px 12px;
}
</style>
