<script setup lang="ts">
import { computed } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import { ModalItemCheckbox } from '@/modules/widgets/base';
import { CalendarCountryIds, calendarCountryData } from '../../model/calendar';

const model = defineModel<CalendarCountryIds[]>({
	required: true,
});

const isAllSelected = computed(() => {
	return model.value.length === Object.values(CalendarCountryIds).length;
});

function unselectAll(newState: boolean) {
	if (newState) {
		model.value = Object.values(CalendarCountryIds);
	} else {
		model.value = [];
	}
}

function toggle(newValue: CalendarCountryIds) {
	if (model.value.includes(newValue)) {
		model.value = model.value.filter((country) => country !== newValue);
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
		<div :class="classes.modalItem">
			<div :class="classes.iconWrapper">
				<ui-icon
					:id="IconIds.Globus"
					width="14px"
					height="14px"
				/>
			</div>
			<span>Entire World</span>
		</div>
	</modal-item-checkbox>

	<modal-item-checkbox
		v-for="country in calendarCountryData"
		:key="country.label"
		:model-value="model.includes(country.id)"
		@update:model-value="toggle(country.id)"
	>
		<div :class="classes.modalItem">
			<div :class="classes.iconWrapper">
				<ui-icon
					:id="country.icon"
					width="16px"
					height="16px"
				/>
			</div>
			<span>{{ country.label }}</span>
		</div>
	</modal-item-checkbox>
</template>

<style module="classes">
.modalItem {
	display: flex;
	align-items: center;
	gap: 6px;
}

.iconWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 16px;
	height: 16px;
	border-radius: 50%;
}
</style>
