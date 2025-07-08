<script setup lang="ts">
import { BaseDashboardComponent } from '../../base/index.ts';
import type { IMeta } from '@/modules/dashboard-group/model';

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
			<!-- <btc-performance-rank-widget :meta="props.meta" /> -->
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.altcoinSeasonWidget {
	display: flex;
}
</style>
