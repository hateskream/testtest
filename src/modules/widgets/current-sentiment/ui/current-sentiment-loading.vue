<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { TickerBaseTabSection } from '@/modules/ticker';
</script>

<template>
	<ticker-base-tab-section>
		<template #title>
			<ui-skeleton width="150px" height="22px" />
		</template>
		<template #content>
			<div :class="classes.chart">
				<ui-skeleton width="100%" height="155px" />
			</div>
		</template>
	</ticker-base-tab-section>
</template>

<style module="classes">
.chart {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
	gap: 4px;
}
</style>
