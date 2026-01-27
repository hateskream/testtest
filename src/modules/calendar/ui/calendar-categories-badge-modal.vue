<script setup lang="ts">
import { computed } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import { ModalBadge, ModalBadgeList } from '@/modules/widgets/base';
import { CalendarCategory, type CalendarCategoryType, CalendarCategoryToLabels } from '../model/calendar';

import CalendarCategoriesList from './common/calendar-categories-list.vue';

defineProps<{
	displayVariant: 'new' | 'default';
}>();

const model = defineModel<CalendarCategoryType[]>({
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
					<calendar-categories-list v-model="model" />
				</template>
			</modal-badge-list>
		</template>
	</modal-badge>
</template>

<style module="classes">
</style>
