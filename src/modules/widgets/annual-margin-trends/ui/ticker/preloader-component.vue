<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.chart">
			<ui-skeleton height="190px" width="100%" />
		</div>
		<div :class="classes.footer">
			<ui-skeleton width="80px" height="20px" />
			<ui-skeleton width="50px" height="20px" />
			<ui-skeleton width="70px" height="20px" />
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	height: 100%;
}

.chart {
	padding: 0 var(--padding-s11, 20px);
}

.footer {
	display: flex;
	justify-content: flex-end;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px);
	gap: var(--padding-s14, 32px);
}
</style>
