<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import { prettyNumberWithKey } from '@/shared/lib';
import { TradingVolumeSentiment, type TradingVolumeSentimentType } from '../model';

interface ITradingVolumeLabelProps {
	period: string;
	change: number;
	status: TradingVolumeSentimentType;
}

const props = defineProps<ITradingVolumeLabelProps>();

const FRACTION_DIGITS = 2;

const formattedValue = computed((): string => {
	const sign = props.change < 0 ? '−' : '';
	const { row } = prettyNumberWithKey(Math.abs(props.change), FRACTION_DIGITS);

	return `${sign}${row}`;
});
</script>

<template>
	<div :class="classes.row">
		<ui-text token="text-200-r">{{ props.period }}</ui-text>
		<ui-text
			token="text-200-r"
			:class="{
				[classes.positive]: props.status === TradingVolumeSentiment.Positive,
				[classes.negative]: props.status === TradingVolumeSentiment.Negative,
			}"
		>
			{{ formattedValue }}
		</ui-text>
	</div>
</template>

<style module="classes">
.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
}

.positive {
	color: #04eda0;
}

.negative {
	color: #fc1d4d;
}
</style>
