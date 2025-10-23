<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';

import { UiSkeletonGroup } from '@/shared/ui/skeleton';

interface IBaseLoaderComponentProps {
	rowHeight?: number;
	rowCount?: number;
	rowGap?: number;
}

const props = withDefaults(defineProps<IBaseLoaderComponentProps>(), {
	rowCount: 0,
	rowHeight: 64,
	rowGap: 10,
});

const { height: contentHeight } = useElementSize(useTemplateRef('contentRef'));

const calculatedLinesCount = computed(() => {
	return Math.floor(contentHeight.value / (props.rowHeight + props.rowGap));
});

const optimizedLinesCount = computed(() => {
	return Math.max(2, props.rowCount || calculatedLinesCount.value);
});

const lineHeight = computed(() => props.rowHeight + 'px');
const rowGapInPx = computed(() => props.rowGap + 'px');
</script>

<template>
	<div :class="classes.container">
		<slot name="before"></slot>
		<div ref="contentRef" :class="classes.content">
			<slot :lines-count="optimizedLinesCount">
				<ui-skeleton-group
					:count="optimizedLinesCount"
					:height="lineHeight"
					:gap="rowGapInPx"
				/>
			</slot>
		</div>
		<slot name="after"></slot>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 16px;
}

.content {
	flex-grow: 1;
	overflow-y: hidden;
}
</style>
