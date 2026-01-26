<script setup lang="ts">
import { computed } from 'vue';

import { ModalItemCheckbox } from '@/modules/widgets/base';
import { CalendarImpact, CalendarImpactToLabels } from '../../model/calendar';

const model = defineModel<CalendarImpact[]>({
	required: true,
});

const isAllSelected = computed(() => {
	return model.value.length === Object.values(CalendarImpact).length;
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
		{{ CalendarImpactToLabels[impact] }}
	</modal-item-checkbox>
</template>

<style module="classes">
</style>
