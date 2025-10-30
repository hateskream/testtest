<script setup lang="ts">
import { computed } from 'vue';
import { notNullish } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalBadge, ModalBadgeList } from '@/modules/widgets/base';
import {
	FilterFieldType,
	FilterOperator,
	filterOperatorToSymbol,
	type ICheckboxGroupFieldConfig,
	type IFilterConfig,
	type IFilterState,
	type IRangeCondition,
} from '../../model/filter';

import FilterCheckboxGroup from './filter-checkbox-group.vue';
import FilterRadioGroup from './filter-radio-group.vue';
import FilterCondition from './filter-condition.vue';

const emit = defineEmits<{
	(e: 'update', state: IFilterState): void;
}>();

const props = defineProps<{
	filter: IFilterConfig;
	state: IFilterState;
}>();

const isCheckboxGroup = computed(() => props.filter.field.type === FilterFieldType.CheckboxGroup);
const isRadioGroup = computed(() => props.filter.field.type === FilterFieldType.RadioGroup);
const isCondition = computed(() => props.filter.field.type === FilterFieldType.Condition);

const checkboxGroupSelected = computed(() => {
	if (isCheckboxGroup.value) {
		return props.state.selected as IRangeCondition;
	}

	return undefined;
});

const checkboxGroupField = computed(() => {
	if (isCheckboxGroup.value) {
		return props.filter.field as ICheckboxGroupFieldConfig;
	}

	return undefined;
});

const presets = computed(() => props.filter.presets ?? []);

const hasSelectedValue = computed(() => {
	if (isCheckboxGroup.value) {
		return notNullish(checkboxGroupSelected.value) && checkboxGroupSelected.value.right.length > 0;
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
		const option = checkboxGroupField.value!.options.find(
			opt => opt.value === checkboxGroupSelected.value!.right[0],
		)!;

		if (checkboxGroupSelected.value!.right.length > 1) {
			return `${option.label} + ${checkboxGroupSelected.value!.right.length - 1}`;
		}

		return option.label;
	}

	const currentPresets = props.filter.presets ?? [];

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

function onUpdateCheckboxGroup(values: (string | number)[]) {
	const selected = values.length ? {
		operator: FilterOperator.InRange,
		right: values,
	} : null;

	emit('update', { selected } as IFilterState);
}

function onUpdateFilter(state: IFilterState | undefined) {
	emit('update', state ? state : { selected: null });
}

const hasManualSetup = computed(() => Boolean(props.filter.field.operators?.length));

const badgeBackgroundColor = computed(() => hasSelectedValue.value ? 'var(--bg-color-base-300-activated)': undefined);
const badgeColor = computed(() => hasSelectedValue.value ? 'var(--text-color-base-500)': undefined);
</script>

<template>
	<modal-badge :background-color="badgeBackgroundColor" :color="badgeColor">
		<template #title>
			<span :class="classes.label">
				<span>{{ filter.field.label }}</span>
				<span v-if="hasSelectedValue">: {{selectedLabel}}</span>
			</span>
			<ui-icon
				:id="IconIds.DropdownDown"
				width="20"
				height="20"
				:class="classes.iconAllFilterColor"
			/>
		</template>
		<template #content="{isVisible}">
			<modal-badge-list :class="classes.modalBadgeList">
				<template #title>
					{{ filter.field.description ?? filter.field.label }}
				</template>
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
					:model-value="props.state"
					:presets="presets"
					:required="props.filter.required"
					:key-numbers="isVisible"
					@update:model-value="onUpdateFilter"
				/>
				<filter-condition
					v-else-if="isCondition"
					:model-value="props.state"
					:presets="presets"
					:required="props.filter.required"
					:manual-setup="hasManualSetup"
					:key-numbers="isVisible"
					@update:model-value="onUpdateFilter"
				/>
			</modal-badge-list>
		</template>
	</modal-badge>
</template>

<style module="classes">
.label {
	display: inline-flex;
}

.modalBadgeList {
	min-width: 240px;
}

.iconAllFilterColor {
	color: var(--icon-color-base-300);
}
</style>
