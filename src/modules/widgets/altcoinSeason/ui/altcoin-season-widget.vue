<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { BaseDashboardComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group/core';
import { PerformanceWidget } from '@/modules/widgets/performance';
import { useAltcoinSeasonStore } from '../stores';

import BtcPerformance from './btc-performance/btc-performance.vue';
import BtcPerformanceRcm from './modals/btc-performance-rcm.vue';
import WidgetLayout from './layouts/widget-layout.vue';

interface IAltcoinSeasonWidgetProps {
	meta: IMeta;
}

const props = defineProps<IAltcoinSeasonWidgetProps>();

const altcoinSeasonStore = useAltcoinSeasonStore();

// FIXME: remove init on mount coz it make useless request on widget dnd\resize
onMounted(() => {
	altcoinSeasonStore.initializeConfig();
});

const altcoinSeasonWidgetConfig = computed(() => altcoinSeasonStore.config);
</script>

<template>
	<base-dashboard-component
		:is-resizing="props.meta.isResizing"
		:meta="props.meta"
		:class="classes.altcoinSeasonWidget"
	>
		<template #title>{{ props.meta.name }}</template>

		<template #content>
			<widget-layout :size-by-cells="props.meta.size" :widget-config="altcoinSeasonWidgetConfig || null">
				<template #performanceRank>
					<btc-performance  />
				</template>

				<template #top100>
					<performance-widget :meta="props.meta" />
				</template>

			</widget-layout>
		</template>

		<template #rcm>
			<btc-performance-rcm :widget-config="altcoinSeasonWidgetConfig || null" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.altcoinSeasonWidget {
	/* todo: add styles */
}
</style>
