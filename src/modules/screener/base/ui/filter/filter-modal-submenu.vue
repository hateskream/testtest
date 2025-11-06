<script setup lang="ts">
import { computed } from 'vue';
import { notNullish } from '@vueuse/core';

import { FilterFieldType, type IFilterConfig, type IFilterState, type IRangeCondition } from '../../model/filter';
import { ModalSubmenu, ModalSubmenuContent } from '@/modules/widgets/base';
import { ModalTitle } from '@/shared/ui/modal-title';

import FilterSelectedLabel from './filter-selected-label.vue';
import FilterField from './filter-field.vue';

const modelValue = defineModel<IFilterState>({ required: true });

interface IFilterModalSubmenuProps {
	config: IFilterConfig;
}

const props = defineProps<IFilterModalSubmenuProps>();

const isCheckboxGroup = computed(() => props.config.field.type === FilterFieldType.CheckboxGroup);

const hasSelectedValue = computed(() => {
	if (isCheckboxGroup.value) {
		const selected = modelValue.value.selected as (IRangeCondition | null);

		return notNullish(selected) && selected.right.length > 0;
	}

	return notNullish(modelValue.value.selected);
});
</script>

<template>
	<modal-submenu
		:position-offset="12"
		trigger="hover"
	>
		<template #title>
			<span :class="classes.label">
				<span>{{ props.config.field.label }}</span>
				<template v-if="hasSelectedValue">
					<span :class="classes.selectedLabel">·</span>
					<filter-selected-label
						:config="props.config"
						:state="modelValue"
						:class="classes.selectedLabel"
					/>
				</template>
			</span>
		</template>
		<template #content>
			<modal-submenu-content>
				<template #content>
					<modal-title>
						{{ props.config.field.description ?? props.config.field.label }}
					</modal-title>
					<filter-field
						v-model="modelValue"
						:config="props.config"
					/>
				</template>
			</modal-submenu-content>
		</template>
	</modal-submenu>
</template>
<style module="classes">
.label {
	display: inline-flex;
	gap: 6px;
	margin-right: 16px;
}

.selectedLabel {
	color: var(--text-color-base-300);
}
</style>
