<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.preloader">
		<div :class="classes.header">
			<ui-skeleton height="24px" width="160px" />
		</div>
		<div :class="classes.chart">
			<ui-skeleton width="100%" height="100%" />
		</div>
		<div :class="classes.footer">
			<div>
				<ui-skeleton width="50px" height="16px" />
			</div>
			<div>
				<ui-skeleton width="60px" height="16px" />
			</div>
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
	flex-grow: 1;
	width: 100%;
	height: 202px;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px) 0 var(--padding-s11, 20px);
}

.footer {
	display: grid;
	align-items: center;
	height: 40px;
	padding-right: var(--padding-s17, 44px);
	text-align: center;
	grid-template-columns: 2fr 1fr;
}
</style>
