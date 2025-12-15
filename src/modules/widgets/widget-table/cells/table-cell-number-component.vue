<script setup lang="ts">
import { computed } from 'vue';

import { prettyNumberWithKey } from '@/shared/lib';
import { UiPositionTooltip } from '@/shared/ui/position/ui/tooltip';
import { getNumberTrendClass } from '../model';
import { UiText } from '@/shared/ui/text';

export interface INumberCell {
	value?: string;
	trend?: string;
	currencySymbol?: string;
	magnitude?: string;
}

interface IProps {
	data: INumberCell;
	format?: 'pretty-with-key' | 'default';
}

const props = defineProps<IProps>();

const formattedValue = computed(() => {
	if (!props.data.value || props.data.value === 'N/A' || isNaN(+props.data.value)) {
		return {
			prefix: props.data.currencySymbol || '',
			value: props.data.value,
			suffix: props.data.magnitude || '',
			default: props.data.value,
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
		default: isNaN(Number(props.data.value))? props.data.value : numFormat.format(+props.data.value),
		trend: props.data.trend,
	};
});

const trendClass = computed(() => {
	return getNumberTrendClass(props.data.value, formattedValue.value.trend);
});
</script>

<template>
	<div class="wrapper">
		<ui-position-tooltip :open-delay="100">
			<template #default>
				<div :class="[classes.number, classes[trendClass]]" class="paragraph-p-00">
					<ui-text token="text-300-r" :class="classes.prefix">{{ formattedValue.prefix }}</ui-text>
					<ui-text token="text-300-r" :class="classes.formatted">{{ formattedValue.value }}</ui-text>
					<ui-text token="text-300-r" :class="classes.suffix">{{ formattedValue.suffix }}</ui-text>
				</div>
			</template>

			<template #content>
				<div :class="classes.number" class="paragraph-p-00">
					<ui-text token="text-300-r">{{ formattedValue.prefix }}</ui-text>
					<ui-text token="text-300-r">{{ formattedValue.default }}</ui-text>
					<ui-text token="text-300-r">{{ formattedValue.suffix }}</ui-text>
				</div>
			</template>
		</ui-position-tooltip>
	</div>
</template>

<style module="classes">
.prefix {
	margin-right: 2px;
	color: var(--text-color-base-500);
}

.suffix {
	margin-left: 4px;
	color: var(--text-color-base-300);
}

.formatted {
	color: var(--text-color-base-500);
}

.number {
	display: flex;
	justify-content: flex-end;
	align-items: center;
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

.wrapper {
	flex: 1;
	width: 100%;
}
</style>
