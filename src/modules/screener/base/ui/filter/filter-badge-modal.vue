<script setup lang="ts">
import { computed } from 'vue';
import { notNullish } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalBadge, ModalBadgeList } from '@/modules/widgets/base';
import { FilterFieldType, type IFilterConfig, type IFilterState, type IRangeCondition } from '../../model/filter';

import FilterSelectedLabel from './filter-selected-label.vue';
import FilterField from './filter-field.vue';

const modelValue = defineModel<IFilterState>({ required: true });

interface IFilterBadgeModalProps {
	config: IFilterConfig;
}

const props = defineProps<IFilterBadgeModalProps>();

const isCheckboxGroup = computed(() => props.config.field.type === FilterFieldType.CheckboxGroup);

const checkboxGroupSelected = computed(() => {
	if (isCheckboxGroup.value) {
		return modelValue.value.selected as IRangeCondition;
	}

	return undefined;
});

const hasSelectedValue = computed(() => {
	if (isCheckboxGroup.value) {
		return notNullish(checkboxGroupSelected.value) && checkboxGroupSelected.value.right.length > 0;
	}

	return notNullish(modelValue.value.selected);
});

const badgeBackgroundColor = computed(() => hasSelectedValue.value ? 'var(--bg-color-base-300-activated)': undefined);
const badgeColor = computed(() => hasSelectedValue.value ? 'var(--text-color-base-500)': undefined);
</script>

<template>
	<modal-badge :background-color="badgeBackgroundColor" :color="badgeColor">
		<template #title>
			<span>
				<span>{{ props.config.field.label }}</span>
				<span v-if="hasSelectedValue">
					<span>: </span>
					<filter-selected-label
						:config="props.config"
						:state="modelValue"
					/>
				</span>
			</span>
			<ui-icon
				:id="IconIds.DropdownDown"
				width="20"
				height="20"
				:class="classes.iconAllFilterColor"
			/>
		</template>
		<template #content="{ isVisible }">
			<modal-badge-list :class="classes.modalBadgeList">
				<template #title>
					{{ props.config.field.description ?? props.config.field.label }}
				</template>
				<filter-field
					v-model="modelValue"
					:config="props.config"
					:key-numbers="isVisible"
				/>
			</modal-badge-list>
		</template>
	</modal-badge>
</template>

<style module="classes">
.modalBadgeList {
	min-width: 240px;
}

.iconAllFilterColor {
	color: var(--icon-color-base-300);
}
</style>
