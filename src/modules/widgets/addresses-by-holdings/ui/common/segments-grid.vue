<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { UiText } from '@/shared/ui/text';
import { UiScrollFade } from '@/shared/ui/scroll-fade';
import { useHoverWheelScroll } from '@/shared/composables';
import type { AddressesByHoldingsSegment } from '../../model';

interface IBaseViewProps {
	segments: AddressesByHoldingsSegment[];
}

const props = defineProps<IBaseViewProps>();

const segmentsRef = useTemplateRef('segments');

const wheelTarget = computed(() => {
	const element = segmentsRef.value;
	if (element) {
		return element.$el;
	}

	return null;
});

const { wheelIsActive } = useHoverWheelScroll(wheelTarget);
</script>

<template>
	<ui-scroll-fade ref="segments" :class="[classes.segments, { [classes.wheel]: wheelIsActive }]">
		<div
			v-for="segment in props.segments"
			:key="segment.key"
			:class="classes.segment"
		>
			<span
				:class="classes.dot"
				:style="{ backgroundColor: segment.color }"
			/>
			<ui-text token="text-200-r" :class="classes.label">
				{{ segment.label }}
			</ui-text>
			<ui-text token="title-200" :class="classes.percentage">
				{{ segment.percentage }}%
			</ui-text>
		</div>
	</ui-scroll-fade>
</template>

<style module="classes">
.segments {
	display: flex;
	flex-wrap: wrap;
	gap: 12px 16px;
	overflow-y: auto;
}

.segments.wheel::-webkit-scrollbar-thumb {
	background-color: var(--scrollbar-color);
}

.segment {
	display: flex;
	flex-direction: column;
	width: 80px;
}

.dot {
	display: inline-block;
	width: 6px;
	height: 6px;
	margin-bottom: 4px;
	border-radius: 50%;
}

.label {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.percentage {
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
