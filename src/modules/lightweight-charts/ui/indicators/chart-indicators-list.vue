<script setup lang="ts">
import { computed } from 'vue';

import { ModalBadgeDropdown, ModalBadgeList } from '@/modules/widgets/base';
import { IndicatorsConfig, type IndicatorType } from '@/modules/indicator';

import ChartIndicatorsListItem from './chart-indicators-list-item.vue';

interface IChartIndicatorsListProps {
	label?: string;
	availablePoints?: number;
}

const props = withDefaults(defineProps<IChartIndicatorsListProps>(), {
	label: 'Indicators',
	availablePoints: 0,
});

const selectedIndicators = defineModel<IndicatorType[]>({ default: () => [] });

function isSelectedIndicator(indicator: IndicatorType) {
	return selectedIndicators.value.includes(indicator);
}

function toggleIndicator(indicator: IndicatorType) {
	if (isSelectedIndicator(indicator)) {
		selectedIndicators.value = selectedIndicators.value.filter(id => id !== indicator);
	} else {
		selectedIndicators.value = [...selectedIndicators.value, indicator];
	}
}

const label = computed(() => {
	if (selectedIndicators.value.length === 0) {
		return props.label;
	}

	const raw = selectedIndicators.value
		.slice(0, 3)
		.map(indicator => IndicatorsConfig[indicator].label)
		.join(', ');

	if (selectedIndicators.value.length > 3) {
		return `${raw}..`;
	}

	return raw;
});
</script>

<template>
	<modal-badge-dropdown display-variant="new">
		<template #title>{{ label }}</template>
		<template #content>
			<modal-badge-list display-variant="new">
				<template #title>Indicators</template>
				<template #default>
					<chart-indicators-list-item
						v-for="(config, indicator) in IndicatorsConfig"
						:key="indicator"
						:title="config.title"
						:label="config.label"
						:disabled="config.minPoints > props.availablePoints"
						:model-value="isSelectedIndicator(indicator)"
						@update:model-value="toggleIndicator(indicator)"
					/>
				</template>
			</modal-badge-list>
		</template>
	</modal-badge-dropdown>
</template>
