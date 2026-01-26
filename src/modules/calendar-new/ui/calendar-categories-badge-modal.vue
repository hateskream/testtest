<script setup lang="ts">
import { computed } from 'vue';

import { UiIcon } from '@/shared/ui/icon';
import { ModalBadge, ModalBadgeList, ModalItemCheckbox } from '@/modules/widgets/base';
import { CalendarCategory, CalendarCategoryToLabels } from '../model/calendar';
import { IconIds } from '@/shared/ui/icon';

defineProps<{
	displayVariant: 'new' | 'default';
}>();

const model = defineModel<CalendarCategory[]>({
	required: true,
});

const isAllSelected = computed(() => {
	return model.value.length === Object.values(CalendarCategory).length;
});

const label = computed(() => {
	const item = model.value;

	if (item.length === 0) {
		return 'Event type';
	}

	if (isAllSelected.value) {
		return 'All';
	}

	const firstItem = CalendarCategoryToLabels[item[0]];

	if (item.length === 1) {
		return firstItem;
	}

	return `${firstItem} +${item.length - 1}`;
});

function unselectAll(newState: boolean) {
	if (newState) {
		model.value = Object.values(CalendarCategory);
	} else {
		model.value = [];
	}
}

function toggle(newValue: CalendarCategory) {
	if (model.value.includes(newValue)) {
		model.value = model.value.filter((category) => category !== newValue);
	} else {
		model.value = [...model.value, newValue];
	}
}
</script>

<template>
	<modal-badge :display-variant>
		<template #title>
			{{ label }}
			<ui-icon :id="IconIds.DropdownDown" />
		</template>
		<template #content>
			<modal-badge-list :display-variant>
				<template #title>
					Event Type
				</template>

				<template #default>
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
						{{CalendarCategoryToLabels[category]}}
					</modal-item-checkbox>
				</template>
			</modal-badge-list>
		</template>
	</modal-badge>
</template>

<style module="classes">

</style>
