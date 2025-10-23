<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';

import { UiSkeletonGroup } from '@/shared/ui/skeleton';

interface IBaseLoaderComponentProps {
	rowHeight?: number;
	minLines?: number;
	maxLines?: number;
	rowCount?: number;
	gap?: number;
	fitMode?: 'shrink' | 'expand';
}

const props = withDefaults(defineProps<IBaseLoaderComponentProps>(), {
	minLines: 2,
	maxLines: Infinity,
	rowCount: undefined,
	rowHeight: 64,
	gap: 10,
	fitMode: 'shrink',
});

const { height: contentHeight } = useElementSize(useTemplateRef('contentRef'));

const calculatedLinesCount = computed(() => {
	const rawCount = contentHeight.value / (props.rowHeight + props.gap);

	if (props.fitMode === 'shrink') {
		return Math.floor(rawCount);
	}

	return Math.ceil(rawCount);
});

const optimizedLinesCount = computed(() => {
	return Math.max(
		props.minLines,
		Math.min(props.maxLines, props.rowCount || calculatedLinesCount.value),
	);
});

const lineHeight = computed(() => props.rowHeight + 'px');
</script>

<template>
	<div :class="classes.container">
		<slot name="before"></slot>
		<div ref="contentRef" :class="classes.content">
			<slot :lines-count="optimizedLinesCount">
				<ui-skeleton-group :count="optimizedLinesCount" :height="lineHeight" />
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
	height: 100%;
	overflow-y: hidden;
}
</style>
