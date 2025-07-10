<script setup lang="ts">
import { BaseDashboardComponent } from '../../base/index.ts';
import type { IMeta } from '@/modules/dashboard-group/model';

import BtcPerformance from './btc-performance/btc-performance.vue';
import BtcPerformanceRcm from './modals/btc-performance-rcm.vue';

interface IAltcoinSeasonWidgetProps {
	meta: IMeta;
}

const props = defineProps<IAltcoinSeasonWidgetProps>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing" :class="classes.altcoinSeasonWidget">
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<div :class="classes.altcoinSeasonWidgetContent">
				<btc-performance />
			</div>
		</template>

		<template #rcm>
			<btc-performance-rcm />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.altcoinSeasonWidget {
	display: flex;
}

.altcoinSeasonWidgetContent {
	padding: 0 8px 8px;
}
</style>
