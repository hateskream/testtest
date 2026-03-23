<script setup lang="ts">
import { computed } from 'vue';

import { TagColor, UiTag } from '@/shared/ui/tag';
import { IconIds } from '@/shared/ui/icon';
import { PriceTargetChart } from '../common';
import { getPotentialDirection, getPotentialPercent, PotentialDirection, type PriceTarget } from '../../model';
import { formatPercent, formatPrice } from '@/modules/charts/common/lib';

interface IViewComponentProps {
	data: PriceTarget;
}

const props = defineProps<IViewComponentProps>();

const potentialPercent = computed(() => getPotentialPercent(props.data));
const potentialDirection = computed(() => getPotentialDirection(props.data));

const potentialFormatted = computed(() => {
	const sign = potentialPercent.value >= 0 ? '+' : '−';
	const priceLabel = `$${formatPrice(props.data.target.average)}`;
	const percentLabel = `${sign}${formatPercent(Math.abs(potentialPercent.value))}%`;

	return `${priceLabel} (${percentLabel}) potential`;
});

const tagColor = computed(() => {
	return potentialDirection.value === PotentialDirection.Up ? TagColor.Positive : TagColor.Negative;
});

const tagIcon = computed(() => {
	return potentialDirection.value === PotentialDirection.Up ? IconIds.Gainers : IconIds.Loosers;
});
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<ui-tag
				:color="tagColor"
				:icon="tagIcon"
				:icon-size="8"
			>
				{{ potentialFormatted }}
			</ui-tag>
		</div>
		<div :class="classes.chart">
			<price-target-chart
				:history="props.data.history"
				:target-high="props.data.target.high"
				:target-average="props.data.target.average"
				:target-low="props.data.target.low"
				:height="230"
			/>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	align-self: stretch;
	padding: var(--padding-s5, 8px) var(--padding-s11, 20px);
	gap: 10px;
}

.chart {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px) 0 var(--padding-s11, 20px);
}
</style>
