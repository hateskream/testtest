<script setup lang="ts">
import { computed } from 'vue';

import { isNumber } from '@/shared/lib';
import { ActivityMetricsTickerWidget } from '@/modules/widgets/activity-metrics';
import { useTickerContext } from '../../../composables';
import type { ISectionItem, LayoutType } from '../../../models';
import { TickerAboutWidget } from '@/modules/widgets/ticker-about';

interface ISectionProps {
	section: ISectionItem;
	layout: LayoutType;
}

const props = defineProps<ISectionProps>();

const { tickerId, aboutText } = useTickerContext();

const minHeight = computed(() => {
	if (isNumber(props.section.height)) {
		return `${props.section.height}px`;
	}

	const current = props.section.height[props.layout];
	return `${current}px`;
});
</script>

<template>
	<div :class="classes.section" :style="{ minHeight }">
		<activity-metrics-ticker-widget :meta="{ tickerId, name: 'Activity Metrics' }" :class="classes.metrics" />
		<ticker-about-widget
			v-if="aboutText"
			:meta="{ tickerId, name: 'About' }"
			:text="aboutText"
		/>
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	align-self: stretch;
	height: 100%;
}

.metrics {
	flex-grow: 1;
}
</style>
