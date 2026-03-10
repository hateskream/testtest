<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.preloader">
		<div :class="classes.header">
			<ui-skeleton height="24px" width="60px" />
		</div>
		<div :class="classes.chart">
			<ui-skeleton width="100%" height="170px" />
		</div>
	</div>
</template>

<style module="classes">
.preloader {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.header {
	display: flex;
	justify-content: flex-end;
	padding: var(--padding-s5, 8px) var(--padding-s11, 20px);
}

.chart {
	display: flex;
	justify-content: center;
	padding: 34px var(--padding-s11, 20px);
}
</style>
