<script setup lang="ts">
import { computed } from 'vue';
import { notNullish } from '@vueuse/core';

import {
	FilterFieldType,
	FilterOperator,
	filterOperatorToSymbol,
	type ICheckboxGroupFieldConfig,
	type IFilterConfig,
	type IFilterState,
	type IRangeCondition,
} from '../../model/filter';

interface IFilterSelectedLabelProps {
	config: IFilterConfig;
	state: IFilterState;
}

const props = defineProps<IFilterSelectedLabelProps>();

const isCheckboxGroup = computed(() => props.config.field.type === FilterFieldType.CheckboxGroup);
const isRadioGroup = computed(() => props.config.field.type === FilterFieldType.RadioGroup);

const hasSelectedValue = computed(() => {
	if (isCheckboxGroup.value) {
		const selected = props.state.selected as (IRangeCondition | null);

		return notNullish(selected) && selected.right.length > 0;
	}

	return notNullish(props.state.selected);
});

const rangeOperators = new Set([
	FilterOperator.InRange,
	FilterOperator.InMonthRange,
	FilterOperator.InDayRange,
	FilterOperator.InWeekRange,
]);

function isRange(operator: FilterOperator) {
	return rangeOperators.has(operator);
}

const selectedLabel = computed(() => {
	if (!hasSelectedValue.value) {
		return null;
	}

	if (isCheckboxGroup.value) {
		const field = props.config.field as ICheckboxGroupFieldConfig;
		const selected = props.state.selected as IRangeCondition;

		const option = field.options.find(
			opt => opt.value === selected.right[0],
		)!;

		if (selected.right.length > 1) {
			return `${option.label}, +${selected.right.length - 1}`;
		}

		return option.label;
	}

	const currentPresets = props.config.presets ?? [];

	if (isRadioGroup.value) {

		const preset = currentPresets.find(p => p.id === props.state.presetId);

		return preset?.label;
	}

	const selected = props.state.selected!;
	const preset = currentPresets.find(p => p.id === props.state.presetId);

	if (preset) {
		return preset.label;
	}

	if (isRange(selected.operator)) {
		const right = selected.right as (number | string)[];

		return `${right[0]} to ${right[1]}`;
	}

	const symbol = filterOperatorToSymbol[selected.operator];

	return [symbol, selected.right.toString()].filter(notNullish).join(' ');
});
</script>

<template>
	<span>{{selectedLabel}}</span>
</template>
