<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import type { IPriceData } from '../../../api';

const props = defineProps<{
	price: IPriceData;
}>();

const classes = useCssModule('classes');

const chart = computed(() => {
	const label = `${props.price.change_24h} (${ props.price.change_24h_percent }%)`;

	if (props.price.status === 'positive') {
		return {
			icon: IconIds.Gainers,
			class: classes.positive,
			label,
		};
	}

	if (props.price.status === 'negative') {
		return {
			icon: IconIds.Loosers,
			class: classes.negative,
			label,
		};
	}

	return {
		class: classes.neutral,
		label,
	};
});

const currentCurrency = computed(() => props.price.currency);

const currentPrice = computed(() => props.price.current_price);
</script>

<template>
	<div :class="classes.price">
		<div :class="classes.current">
			<ui-text token="title-200">{{ currentCurrency }}</ui-text>
			<ui-text token="title-200">{{ currentPrice }}</ui-text>
		</div>

		<div :class="[classes.chartPrice, chart.class]">
			<ui-icon
				v-if="chart.icon"
				:id="chart.icon"
				width="8px"
				height="8px"
			/>

			<ui-text :class="classes.chartPriceLabel" token="text-100-r">
				{{chart.label}}
			</ui-text>
		</div>
	</div>
</template>

<style module="classes">
.price {
	display: flex;
	align-items: center;
}

.current {
	display: flex;
	gap: 2px;
}

.chartPrice {
	display: flex;
	justify-content: center;
	align-items: center;
	padding:
		var(--padding-padding-s2, 2px) var(--padding-padding-s5, 8px)
		var(--padding-padding-s2, 2px) var(--padding-padding-s4, 6px);
	gap: var(--padding-padding-s3, 4px);
}

.current,
.chartPrice {
	white-space: nowrap;
}

.negative {
	color: var(--atom-warning-00, #fc1d4d);
}

.positive {
	color: var(--atom-success-00, #04eda0);
}
</style>
