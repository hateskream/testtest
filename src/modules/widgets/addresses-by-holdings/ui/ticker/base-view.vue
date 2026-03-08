<script setup lang="ts">
import { computed } from 'vue';

import { UiSegmentedBar } from '@/shared/ui/segmented-bar';
import type { AddressesByHoldings } from '../../model';
import { SegmentsGrid } from '../common';

interface IBaseViewProps {
	data: AddressesByHoldings;
}

const props = defineProps<IBaseViewProps>();

const segments = computed(() => props.data.segments.map(segment => {
	return {
		id: segment.key,
		color: segment.color,
		value: segment.percentage,
	};
}));
</script>

<template>
	<div :class="classes.container">
		<segments-grid :class="classes.segments" :segments="data.segments" />
		<ui-segmented-bar
			:class="classes.indicator"
			:segments="segments"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: flex-end;
	width: 100%;
	min-height: 0;
}

.segments {
	min-height: 0;
}

.indicator {
	flex-shrink: 0;
	margin: 12px 0;
}
</style>
