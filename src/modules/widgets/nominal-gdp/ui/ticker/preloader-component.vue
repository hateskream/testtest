<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.preloader">
		<div :class="classes.filters">
			<ui-skeleton height="24px" width="67px" />
		</div>
		<div :class="classes.chart">
			<ui-skeleton width="100%" height="100%" />
		</div>
		<div :class="classes.footer">
			<ui-skeleton width="40px" height="28px" />
			<ui-skeleton width="40px" height="28px" />
			<ui-skeleton width="40px" height="28px" />
			<ui-skeleton width="40px" height="28px" />
			<ui-skeleton
				:class="classes.legend"
				width="40px"
				height="28px"
			/>
			<ui-skeleton width="40px" height="28px" />
		</div>
	</div>
</template>

<style module="classes">
.preloader {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.filters {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 40px;
	padding: var(--padding-s5, 8px) var(--padding-s11, 20px);
}

.chart {
	flex-grow: 1;
	width: 100%;
	padding: 0 var(--padding-s11, 20px);
}

.footer {
	display: flex;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px);
	gap: var(--padding-s1, 1px);
}

.legend {
	margin-left: auto;
}
</style>
