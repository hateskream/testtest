<script setup lang="ts">
import { computed } from 'vue';

import { UiIcon } from '@/shared/ui/icon';
import { ModalBadge, ModalItemCheckbox } from '@/modules/widgets/base';
import { CalendarImpact, CalendarImpactToLabels } from '../model/contract';
import { IconIds } from '@/shared/ui/icon';
import { UiModalWrapper, UiModalContent } from '@/shared/ui/modal';

defineProps<{
	displayVariant: 'new' | 'default';
}>();

const model = defineModel<CalendarImpact[]>({
	required: true,
});

const isAllSelected = computed(() => {
	return model.value.length === Object.values(CalendarImpact).length;
});

const label = computed(() => {
	const item = model.value;

	if (item.length === 0) {
		return 'Impact';
	}

	if (isAllSelected.value) {
		return 'All';
	}

	const firstItem = CalendarImpactToLabels[item[0]];

	if (item.length === 1) {
		return firstItem;
	}

	return `${firstItem} +${item.length - 1}`;
});

function unselectAll(newState: boolean) {
	if (newState) {
		model.value = Object.values(CalendarImpact);
	} else {
		model.value = [];
	}
}

function toggle(newValue: CalendarImpact) {
	if (model.value.includes(newValue)) {
		model.value = model.value.filter((impact) => impact !== newValue);
	} else {
		model.value = [...model.value, newValue];
	}
}
</script>

<template>
	<modal-badge :display-variant>
		<template #title>
			{{label}}
			<ui-icon :id="IconIds.DropdownDown" />
		</template>

		<template #content>
			<ui-modal-wrapper :display-variant>
				<ui-modal-content>
					<modal-item-checkbox
						:model-value="isAllSelected"
						@update:model-value="unselectAll"
					>
						All
					</modal-item-checkbox>

					<modal-item-checkbox
						v-for="(impact, index) in Object.values(CalendarImpact)"
						:key="index"
						:model-value="model.includes(impact)"
						@click="toggle(impact)"
					>
						{{CalendarImpactToLabels[impact]}}
					</modal-item-checkbox>
				</ui-modal-content>
			</ui-modal-wrapper>
		</template>
	</modal-badge>
</template>

<style module="classes">

</style>
