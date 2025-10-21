<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseDashboardComponent, BaseErrorComponent } from '@/modules/widgets/base';
import { useAltcoinSeasonState } from '@/modules/widgets/altcoinSeason/composables';
import { useAltcoinSeasonQuery } from '@/modules/widgets/altcoinSeason/queries';
import { usePerformanceStore } from '../../performance/stores';

import AltcoinSeasonTimeFilter from './modals/altcoin-season-time-filter.vue';
import AltcoinSeasonWidgetConfig from './modals/altcoin-season-widget-config.vue';
import AltcoinSeasonLoader from './layouts/altcoin-season-loader.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./layouts/altcoin-season-main.vue'),
	loadingComponent: AltcoinSeasonLoader,
	errorComponent: BaseErrorComponent,
});

interface IAltcoinSeasonWidgetProps {
	meta: IMeta;
}

const props = defineProps<IAltcoinSeasonWidgetProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const { period, modules, request } = useAltcoinSeasonState();
const { data, isLoading, isError, refetch } = useAltcoinSeasonQuery(request);

const performanceStore = usePerformanceStore();

function resetAll() {
	performanceStore.resetAll();
};
</script>

<template>
	<base-dashboard-component
		has-reset
		:meta="props.meta"
		:class="classes.altcoinSeasonWidget"
		@delete="emit('delete')"
		@move-to="emit('moveTo', $event)"
		@duplicate="emit('duplicate')"
		@reset="resetAll"
	>
		<template #title>{{ props.meta.name }}</template>
		<template #content>
			<div :class="classes.content">
				<altcoin-season-loader v-if="isLoading || props.meta.isResizing" />
				<base-error-component v-else-if="isError" @retry="refetch" />
				<view-component
					v-else-if="data"
					v-model:period="period"
					:meta="props.meta"
					:performance="data.performanceRank"
					:historical-values="data.historicalValues"
					:module-settings="modules"
					:top100="data.top100"
					:chart="data.chart"
				/>
			</div>
		</template>

		<template #change-display>
			<altcoin-season-widget-config
				v-model:selected-modules="modules"
			/>
		</template>

		<template #filter>
			<altcoin-season-time-filter v-model:period="period" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.altcoinSeasonWidget {
	/* todo: add styles */
}

.content {
	height: 100%;
	overflow-x: hidden;
	overflow-y: hidden;
	border-radius: 18px;
}
</style>
