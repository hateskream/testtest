<script setup lang="ts">

import { UiSkeleton } from '@/shared/ui/skeleton';

const ITEM_WIDTH = 110;

const skeletonStyle = {
	flex: `1 0 ${ITEM_WIDTH}px`,
	minWidth: `${ITEM_WIDTH}px`,
};
</script>

<template>
	<div :class="classes.calendarPreloader">
		<ui-skeleton
			v-for="i in 7"
			:key="i"
			:style="skeletonStyle"
			height="144px"
		/>
	</div>
</template>

<style module="classes">
.calendarPreloader {
	display: flex;
	width: 100%;
	gap: 8px;
	overflow: hidden;
}
</style>
