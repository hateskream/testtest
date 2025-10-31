<script setup lang="ts">
import { computed } from 'vue';

import {
	type FilterCondition as FilterConditionType,
	FilterFieldType,
	FilterOperator,
	type ICheckboxGroupFieldConfig,
	type IFilterConfig,
	type IFilterState,
	type IRangeCondition,
} from '@/modules/screener/base';

import FilterRadioGroup from './filter-radio-group.vue';
import FilterCheckboxGroup from './filter-checkbox-group.vue';
import FilterCondition from './filter-condition.vue';

const modelValue = defineModel<IFilterState>({ required: true });

interface IFilterFieldProps {
	config: IFilterConfig;
	keyNumbers?: boolean;
}

const props = defineProps<IFilterFieldProps>();

const isCheckboxGroup = computed(() => props.config.field.type === FilterFieldType.CheckboxGroup);
const isRadioGroup = computed(() => props.config.field.type === FilterFieldType.RadioGroup);
const isCondition = computed(() => props.config.field.type === FilterFieldType.Condition);

const checkboxGroupSelected = computed(() => {
	if (isCheckboxGroup.value) {
		return modelValue.value.selected as IRangeCondition;
	}

	return undefined;
});

const checkboxGroupField = computed(() => {
	if (isCheckboxGroup.value) {
		return props.config.field as ICheckboxGroupFieldConfig;
	}

	return undefined;
});

const presets = computed(() => props.config.presets ?? []);

function onUpdateCheckboxGroup(values: (string | number)[]) {
	const selected = values.length ? ({
		operator: FilterOperator.InRange,
		right: values,
	} as FilterConditionType) : null;

	modelValue.value = { selected };
}

function onUpdateFilter(state: IFilterState | undefined) {
	modelValue.value = state ?? { selected: null };
}

const hasManualSetup = computed(() => Boolean(props.config.field.operators?.length));
</script>

<template>
	<filter-checkbox-group
		v-if="isCheckboxGroup"
		:model-value="checkboxGroupSelected?.right"
		:options="checkboxGroupField!.options"
		:searchable="checkboxGroupField!.searchable"
		:search-placeholder="checkboxGroupField!.searchPlaceholder"
		@update:model-value="onUpdateCheckboxGroup"
	/>
	<filter-radio-group
		v-else-if="isRadioGroup"
		:model-value="modelValue"
		:presets="presets"
		:required="props.config.required"
		:key-numbers="props.keyNumbers"
		@update:model-value="onUpdateFilter"
	/>
	<filter-condition
		v-else-if="isCondition"
		:model-value="modelValue"
		:presets="presets"
		:required="props.config.required"
		:manual-setup="hasManualSetup"
		:key-numbers="props.keyNumbers"
		@update:model-value="onUpdateFilter"
	/>
</template>
