<script setup lang="ts">
import { computed } from 'vue';

import type { ISegmentedBarProps } from './types.ts';

const DELIMITER_OFFSET = 2;

const props = withDefaults(defineProps<ISegmentedBarProps>(), {
	segmentHeight: 14,
	gap: 1,
	minSegmentWidth: 2,
	delimiterWidth: 1,
});

const segmentHeightInPx = computed(() => `${props.segmentHeight}px`);
const delimiterHeightInPx = computed(() => `${props.segmentHeight + DELIMITER_OFFSET * 2}px`);
const gapInPx = computed(() => `${props.gap}px`);
const delimiterWidthInPx = computed(() => `${props.delimiterWidth}px`);

const total = computed(() => props.segments.reduce((acc, segment) => acc + segment.value, 0));

const preparedSegments = computed(() => {
	return props.segments.map(segment => {
		return {
			id: segment.id,
			color: segment.color,
			width: `max(${segment.value / total.value * 100}%, ${props.minSegmentWidth}px)`,
		};
	});
});
</script>

<template>
	<div :class="classes.segmentedBar" :style="{ gap: gapInPx }">
		<template
			v-for="(segment, index) in preparedSegments"
			:key="segment.id"
		>
			<div
				:class="classes.segment"
				:style="{
					background: segment.color,
					width: segment.width,
					height: segmentHeightInPx,
				}"
			/>
			<div
				v-if="props.showDelimiter && index < preparedSegments.length - 1"
				:class="classes.delimiter"
				:style="{
					height: delimiterHeightInPx,
					width: delimiterWidthInPx,
					background: props.delimiterColor ?? segment.color,
				}"
			></div>
		</template>
	</div>
</template>

<style module="classes">
.segmentedBar {
	display: flex;
	align-items: center;
	padding: 1px;
	border-radius: 4px;
}

.segment:first-child {
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}

.segment:last-child {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}

.delimiter {
	width: 1px;
}
</style>
