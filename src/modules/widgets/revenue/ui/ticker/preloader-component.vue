<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.preloader">
		<div :class="classes.chart">
			<ui-skeleton width="100%" height="205px" />
		</div>
		<div :class="classes.footer">
			<ui-skeleton width="70px" height="28px" />
			<ui-skeleton width="50px" height="28px" />
			<ui-skeleton
				:class="classes.legend"
				width="60px"
				height="16px"
			/>
			<ui-skeleton width="60px" height="16px" />
		</div>
	</div>
</template>

<style module="classes">
.preloader {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.chart {
	flex-grow: 1;
	width: 100%;
	padding: var(--padding-s14, 32px) var(--padding-s11, 20px) 0 var(--padding-s11, 20px);
}

.footer {
	display: flex;
	align-items: center;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px);
	gap: var(--padding-s1, 1px);
}

.legend {
	margin-left: auto;
}
</style>
