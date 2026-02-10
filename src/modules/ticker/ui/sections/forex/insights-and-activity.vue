<script setup lang="ts">
import { ActivityMetricsTickerWidget } from '@/modules/widgets/activity-metrics';
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';

import EmptyTickerWidget from '../empty-ticker-widget.vue';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId } = useTickerContext();
</script>

<template>
	<div :class="classes.section">
		<activity-metrics-ticker-widget :meta="{ tickerId, name: 'Activity Metrics' }" />
		<empty-ticker-widget style="height: 700px;" :meta="{ tickerId, name: 'News' }" />
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	align-self: stretch;
}
</style>
