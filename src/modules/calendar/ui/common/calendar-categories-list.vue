<script setup lang="ts">
import { computed } from 'vue';

import { ModalItemCheckbox } from '@/modules/widgets/base';
import { CalendarCategory, type CalendarCategoryType, CalendarCategoryToLabels } from '../../model/calendar';

const model = defineModel<CalendarCategoryType[]>({
	required: true,
});

const isAllSelected = computed(() => {
	return model.value.length === Object.values(CalendarCategory).length;
});

function unselectAll(newState: boolean) {
	if (newState) {
		model.value = Object.values(CalendarCategory);
	} else {
		model.value = [];
	}
}

function toggle(newValue: CalendarCategoryType) {
	if (model.value.includes(newValue)) {
		model.value = model.value.filter((category) => category !== newValue);
	} else {
		model.value = [...model.value, newValue];
	}
}
</script>

<template>
	<modal-item-checkbox
		:model-value="isAllSelected"
		@update:model-value="unselectAll"
	>
		All
	</modal-item-checkbox>

	<modal-item-checkbox
		v-for="(category, index) in Object.values(CalendarCategory)"
		:key="index"
		:model-value="model.includes(category)"
		@click="toggle(category)"
	>
		{{ CalendarCategoryToLabels[category] }}
	</modal-item-checkbox>
</template>

<style module="classes">
</style>
