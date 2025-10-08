<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/core';
import { BaseDashboardComponent, BaseErrorComponent } from '@/modules/widgets/base';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';

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

const altcoinSeasonStore = useAltcoinSeasonStore();

const widgetConfig = computed(() => altcoinSeasonStore.widgetData.value.widgetConfig);
const isLoading = computed(() => altcoinSeasonStore.isLoading.value || props.meta.isLoading);
const isError = computed(() => altcoinSeasonStore.isError.value);
</script>

<template>
	<base-dashboard-component
		:is-resizing="props.meta.isResizing"
		:meta="props.meta"
		:class="classes.altcoinSeasonWidget"
	>
		<template #title>{{ props.meta.name }}</template>
		<template #content>
			<altcoin-season-loader v-if="isLoading" :count="6" />
			<base-error-component v-else-if="isError" @retry="altcoinSeasonStore.refetch" />
			<view-component v-else :meta="props.meta" />

		</template>

		<template #rcm>
			<altcoin-season-context-menu
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
</style>
