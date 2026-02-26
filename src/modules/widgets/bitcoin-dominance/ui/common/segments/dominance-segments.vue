<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import type { IDominanceSnapshot } from '../../../model';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';
import { UiScrollFade } from '@/shared/ui/scroll-fade';
import { useHoverWheelScroll } from '@/shared/composables';

import DominanceSegmentsIndicator from './dominance-segments-indicator.vue';

interface IViewComponentProps {
	snapshots: IDominanceSnapshot[];
	isShowSegments?: boolean;
	isShowIndicator?: boolean;
}

const props = defineProps<IViewComponentProps>();

const segments = useTemplateRef('segments');

const wheelTarget = computed(() => {
	const element = segments.value;
	if (element) {
		return element.$el;
	}

	return null;
});

const { wheelIsActive } = useHoverWheelScroll(wheelTarget);
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.segmentsWrapper">
			<ui-scroll-fade
				v-if="isShowSegments"
				ref="segments"
				:class="[classes.segments, { [classes.wheel]: wheelIsActive }]"
				:size="24"
			>
				<div
					v-for="item in props.snapshots"
					:key="item.symbol"
					:class="classes.ticker"
				>
					<div :class="classes.name">
						<div :class="classes.circle" :style="{ backgroundColor: item.color }"></div>
						<ui-clamped :rows="1" :class="classes.nameText">
							<ui-text token="text-200-r">
								{{ item.symbol }}
							</ui-text>
						</ui-clamped>
					</div>
					<ui-text :class="classes.value" token="title-200">
						{{ item.dominance.current.toFixed(1) }}%
					</ui-text>
				</div>
			</ui-scroll-fade>
		</div>
		<dominance-segments-indicator
			v-if="isShowIndicator"
			:snapshots="props.snapshots"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
}

.segmentsWrapper {
	display: flex;
	overflow: hidden;
}

.segments {
	display: flex;
	flex-wrap: wrap;
	overflow-x: auto;
	overflow-y: auto;
	gap: 4px 16px;
}

.segments.wheel::-webkit-scrollbar-thumb {
	background-color: var(--scrollbar-color);
}

.ticker {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	width: 80px;
}

.name {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
	color: var(--text-color-base-300);
}

.nameText {
	max-width: 100%;
}

.circle {
	width: 6px;
	height: 6px;
	border-radius: 100%;
}

.value {
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
