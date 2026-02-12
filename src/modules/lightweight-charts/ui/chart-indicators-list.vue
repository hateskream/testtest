<script setup lang="ts">
import { computed } from 'vue';

import { ModalBadgeDropdown, ModalBadgeList, ModalItemCheckbox } from '@/modules/widgets/base';
import { IndicatorsConfig, type IndicatorType } from '@/modules/indicator';
import { UiText } from '@/shared/ui/text';

interface IChartIndicatorsList {
	label?: string;
}

const props = withDefaults(defineProps<IChartIndicatorsList>(), {
	label: 'Indicators',
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
				<modal-item-checkbox
					v-for="(config, indicator) in IndicatorsConfig"
					:key="indicator"
					:model-value="isSelectedIndicator(indicator)"
					@update:model-value="toggleIndicator(indicator)"
				>
					<div :class="classes.indicatorName">
						<ui-text token="text-300-r">
							{{ config.label }}
						</ui-text>
						<ui-text :class="classes.indicatorTitle" token="text-200-r">
							{{ config.title }}
						</ui-text>
					</div>
				</modal-item-checkbox>
			</modal-badge-list>
		</template>
	</modal-badge-dropdown>
</template>

<style module="classes">
.indicatorName {
	display: flex;
	align-items: flex-end;
	gap: 5px;
}

.indicatorTitle {
	color: var(--text-color-base-300);
}
</style>
