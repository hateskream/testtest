<script setup lang="ts">
import { computed } from 'vue';
import { notNullish } from '@vueuse/core';

import { FilterFieldType, type IFilterConfig, type IFilterState, type IRangeCondition } from '../../model/filter';
import { UiSubposition } from '@/shared/ui/position';
import { UiModalWrapper, UiModalContent, UiModalTitle } from '@/shared/ui/modal';
import { ModalItemInteraction } from '@/modules/widgets/base';

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
	<ui-subposition
		:trigger="['hover', 'click']"
	>
		<template #title>
			<modal-item-interaction>
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
			</modal-item-interaction>
		</template>
		<template #content>
			<ui-modal-wrapper display-variant="new">
				<ui-modal-title>
					{{ props.config.field.description ?? props.config.field.label }}
				</ui-modal-title>
				<ui-modal-content>
					<filter-field
						v-model="modelValue"
						:config="props.config"
					/>
				</ui-modal-content>
			</ui-modal-wrapper>
		</template>
	</ui-subposition>
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
