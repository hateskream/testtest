<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { BaseDashboardComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group/core';
import { PerformanceWidget } from '@/modules/widgets/performance';
import { useAltcoinSeasonStore } from '../stores';

import BtcPerformance from './btc-performance/btc-performance.vue';
import BtcPerformanceRcm from './modals/btc-performance-rcm.vue';
import WidgetLayout from './layouts/widget-layout.vue';
import AltcoinSeasonPeriodGroup from './period-switch/altcoin-season-period-group.vue';
import HistoricalValue from './historical-value/historical-value.vue';

interface IAltcoinSeasonWidgetProps {
	meta: IMeta;
}

const props = defineProps<IAltcoinSeasonWidgetProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const altcoinSeasonStore = useAltcoinSeasonStore();

// FIXME: remove init on mount coz it make useless request on widget dnd\resize
onMounted(() => {
	altcoinSeasonStore.initializeConfig();
});

const altcoinSeasonWidgetConfig = computed(() => altcoinSeasonStore.config);


const metaPerformance = computed(() => {
	return {
		...props.meta,
		name: 'Top 100 coins performance',
	};
});
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
				<template #period>
					<altcoin-season-period-group
						v-if="altcoinSeasonWidgetConfig?.period"
						:period="altcoinSeasonWidgetConfig?.period"
					/>
				</template>

				<template #performanceRank="{ showPeriod }">
					<btc-performance :show-period="showPeriod" />
				</template>

				<template #top100>
					<performance-widget :meta="metaPerformance" />
				</template>

				<template #historicalValues="{ showPeriod }">
					<historical-value :show-period="showPeriod" />
				</template>

			</widget-layout>
		</template>

		<template #rcm>
			<btc-performance-rcm :widget-config="altcoinSeasonWidgetConfig || null"  @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.altcoinSeasonWidget {
	/* todo: add styles */
}
</style>
