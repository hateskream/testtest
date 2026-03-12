<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';

import { UiSkeleton } from '@/shared/ui/skeleton';
import { ListSkeleton } from '@/modules/widgets/base';

const ITEM_WIDTH = 123;
const GAP = 6;

const container = useTemplateRef('container');
const { width: containerWidth } = useElementSize(container);

const count = computed(() => {
	if (containerWidth.value <= 0) {
		return 0;
	}

	return Math.floor((containerWidth.value + GAP) / (ITEM_WIDTH + GAP));
});
</script>

<template>
	<div :class="classes.calendarPreloaderWrapper">
		<div ref="container" :class="classes.calendarPreloader">
			<ui-skeleton
				v-for="i in count"
				:key="i"
				width="123px"
				height="126px"
			/>
		</div>
		<list-skeleton />
	</div>
</template>

<style module="classes">
.calendarPreloaderWrapper {
	width: 100%;
}

.calendarPreloader {
	display: flex;
	width: 100%;
	gap: 6px;
}
</style>
