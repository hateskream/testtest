<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/core';
import { BaseDashboardComponent } from '@/modules/widgets/base';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';

import AltcoinSeasonContextMenu from './modals/altcoin-season-context-menu.vue';
import AltcoinSeasonMain from './layouts/altcoin-season-main.vue';
import AltcoinSeasonLoader from './layouts/altcoin-season-loader.vue';
import AltcoinSeasonError from './layouts/altcoin-season-error.vue';

const altcoinSeasonStore = useAltcoinSeasonStore();
interface IAltcoinSeasonWidgetProps {
	meta: IMeta;
}

const props = defineProps<IAltcoinSeasonWidgetProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const widgetConfig = computed(() => altcoinSeasonStore.widgetData.value.widgetConfig);
const isLoading = computed(() => altcoinSeasonStore.isLoading.value);
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
			<altcoin-season-error v-else-if="isError" />
			<altcoin-season-main v-else :meta="props.meta" />
		</template>

		<template #rcm>
			<altcoin-season-context-menu
				:title="props.meta.name"
				:widget-config="widgetConfig || null"
				@delete="emit('delete')"
			/>
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.altcoinSeasonWidget {
	/* todo: add styles */
}
</style>
