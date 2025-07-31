<script setup lang="ts">
import { computed } from 'vue';

import { prettyNumberWithKey } from '@/shared/lib';
import { UiTooltip } from '@/shared/ui/tooltip';
import { type IWatchlistNumberCell } from '@/modules/widgets/watchlist/model';
import { getNumberTrendClass } from '@/modules/widgets/watchlist/const';

interface IProps {
	data: IWatchlistNumberCell;
	format?: 'pretty-with-key' | 'default';
}

const props = defineProps<IProps>();

const formattedValue = computed(() => {
	if (!props.data.value || props.data.value === 'N/A' || isNaN(+props.data.value)) {
		return {
			prefix: '',
			value: '—',
			suffix: '',
			default: '—',
			trend: props.data.trend,
		};
	}

	const { value, suffix } =
		props.format === 'pretty-with-key'
			? prettyNumberWithKey(props.data.value)
			: { value: props.data.value, suffix: props.data.magnitude || '' };

	const prefix = props.data.currencySymbol || '';

	const numFormat = new Intl.NumberFormat('en', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	return {
		prefix,
		value,
		suffix,
		default: numFormat.format(+props.data.value),
		trend: props.data.trend,
	};
});

const trendClass = computed(() => {
	return getNumberTrendClass(props.data.value, formattedValue.value.trend);
});
</script>

<template>
	<ui-tooltip :show-in-ms="100">
		<template #default>
			<div :class="[classes.number, classes[trendClass]]">
				<span :class="classes.prefix">{{ formattedValue.prefix }}</span>
				<span :class="classes.formatted">{{ formattedValue.value }}</span>
				<span :class="classes.suffix">{{ formattedValue.suffix }}</span>
			</div>
		</template>

		<template #content>
			<div :class="classes.number">
				<span>{{ formattedValue.prefix }}</span>
				<span>{{ formattedValue.default }}</span>
				<span>{{ formattedValue.suffix }}</span>
			</div>
		</template>
	</ui-tooltip>
</template>

<style module="classes">
.prefix {
	margin-right: 1px;
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-100);
}

.suffix {
	margin-left: 4px;
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-300);
}

.formatted {
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-500);
	letter-spacing: 0.143px;
}

.number {
	display: flex;
	width: 100%;
}

.positive {
	color: var(--metrics-color-positive);
}

.negative {
	color: var(--metrics-color-negative-500);
}

.neutral {
	color: var(--text-color-base-500);
}
</style>
