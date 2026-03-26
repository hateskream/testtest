<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.content">
		<div :class="classes.chart">
			<ui-skeleton width="100%" height="170px" />
		</div>
		<div :class="classes.footer">
			<ui-skeleton width="80px" height="18px" />
			<ui-skeleton width="80px" height="18px" />
		</div>
	</div>
</template>

<style module="classes">
.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.chart {
	flex-grow: 1;
	padding: var(--padding-s18, 52px) 20px 0;
}

.footer {
	display: flex;
	justify-content: flex-end;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px);
	gap: var(--padding-s14, 32px);
}
</style>
