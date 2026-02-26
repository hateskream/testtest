<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { UiDelimiter } from '@/shared/ui/delimiter';
</script>

<template>
	<div :class="classes.preloader">
		<div :class="[classes.list, classes.header]">
			<div :class="[classes.list, classes.filters]">
				<ui-skeleton width="60px" height="24px" />
				<ui-skeleton width="60px" height="24px" />
				<ui-delimiter />
				<ui-skeleton width="60px" height="24px" />
			</div>
			<div :class="[classes.list, classes.actions]">
				<ui-skeleton width="20px" height="20px" />
				<ui-skeleton width="20px" height="20px" />
				<ui-skeleton width="20px" height="20px" />
			</div>
		</div>
		<ui-skeleton :class="classes.body" width="100%" />
		<div :class="classes.dateRange">
			<ui-skeleton
				v-for="i in 6"
				:key="i"
				:class="classes.dateRangeSkeleton"
				height="32px"
			/>
			<ui-skeleton height="32px" width="32px" />
		</div>
		<ui-skeleton height="82px" width="100%" />
	</div>
</template>

<style module="classes">
.preloader {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	height: 100%;
	padding: var(--padding-s9, 16px) 0;
	gap: var(--padding-s5, 8px);
}

.list {
	display: flex;
	align-items: center;
}

.header {
	flex-shrink: 0;
	justify-content: space-between;
	align-self: stretch;
}

.filters {
	gap: var(--padding-s7, 12px);
}

.actions {
	gap: var(--padding-s5, 8px);
}

.body {
	flex: 1 0 0;
	align-self: stretch;
}

.dateRange {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	align-self: stretch;
	gap: var(--padding-s1, 1px);
	padding: var(--padding-s5, 8px) 0;
}

.dateRangeSkeleton {
	flex: 1 0 0;
}
</style>
