<script setup lang="ts">
import { computed } from 'vue';

import { TagColor, UiTag } from '@/shared/ui/tag';
import { formatPercent } from '@/modules/charts/common/lib';
import { ChangeDirection, type EpsForecast } from '../../model';

interface IEpsForecastBadgeProps {
	forecast: EpsForecast;
}

const props = defineProps<IEpsForecastBadgeProps>();

const directionLabel = computed(() => {
	if (props.forecast.direction === ChangeDirection.Up) {
		return 'up';
	}

	if (props.forecast.direction === ChangeDirection.Down) {
		return 'down';
	}

	return undefined;
});

const badgeText = computed(() => {
	const percent = formatPercent(props.forecast.changePercent);

	if (directionLabel.value) {
		return `EPS forecast ${directionLabel.value} ${percent}%`;
	}

	return `EPS forecast ${percent}%`;
});

const tagColor = computed(() => {
	if (props.forecast.direction === ChangeDirection.Up) {
		return TagColor.Positive;
	}

	if (props.forecast.direction === ChangeDirection.Down) {
		return TagColor.Negative;
	}

	return TagColor.Neutral;
});
</script>

<template>
	<ui-tag :color="tagColor">
		{{ badgeText }}
	</ui-tag>
</template>
