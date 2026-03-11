<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.chart">
			<ui-skeleton height="380px" width="100%" />
		</div>
		<div :class="classes.selector">
			<ui-skeleton height="28px" width="100%" />
		</div>
		<div :class="classes.footer">
			<ui-skeleton width="40px" height="28px" />
			<ui-skeleton width="40px" height="28px" />
			<ui-skeleton width="40px" height="28px" />
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
}

.chart {
	padding: 0 var(--padding-s11, 20px);
}

.selector {
	padding: var(--padding-s4, 6px) var(--padding-s11, 20px);
}

.footer {
	display: flex;
	justify-content: flex-end;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px);
	gap: var(--padding-s14, 32px);
}
</style>
