<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/core';
import { BaseDashboardComponent, BaseErrorComponent } from '@/modules/widgets/base';
import { useAltcoinSeasonState } from '@/modules/widgets/altcoinSeason/composables';
import { useQueryAltcoinSeason } from '@/modules/widgets/altcoinSeason/queries/use-query-altcoin-season.ts';

import AltcoinSeasonContextMenu from './modals/altcoin-season-context-menu.vue';
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
const { data, isLoading, isError, refetch } = useQueryAltcoinSeason(request);

const widgetConfig = computed(
	() => data.value?.widgetConfig,
);
</script>

<template>
	<base-dashboard-component
		:is-resizing="props.meta.isResizing"
		:meta="props.meta"
		:class="classes.altcoinSeasonWidget"
	>
		<template #title>{{ props.meta.name }}</template>
		<template #content>
			<div :class="classes.content">
				<altcoin-season-loader v-if="isLoading" :count="6" />
				<base-error-component v-else-if="isError" @retry="refetch" />
				<view-component
					v-else-if="data"
					v-model:period="period"
					:meta="props.meta"
					:performance="data.performanceRank"
					:historical-values="data.historicalValues"
					:module-settings="modules"
					:top100="data.top100"
				/>
			</div>
		</template>

		<template #rcm>
			<altcoin-season-context-menu
				v-model:period="period"
				v-model:selected-modules="modules"
				:title="props.meta.name"
				:dashboards="props.meta.dashboards"
				:widget-config="widgetConfig || null"
				@delete="emit('delete')"
				@move-to="emit('moveTo', $event)"
				@duplicate="emit('duplicate')"
			/>
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
