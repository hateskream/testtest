<script setup lang="ts">
import { computed } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import { ModalBadge, ModalBadgeList } from '@/modules/widgets/base';
import { CalendarImpact, CalendarImpactToLabels } from '../model/calendar';

import CalendarImpactList from './common/calendar-impact-list.vue';

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
</script>

<template>
	<modal-badge :display-variant>
		<template #title>
			{{ label }}
			<ui-icon :id="IconIds.DropdownDown" />
		</template>

		<template #content>
			<modal-badge-list :display-variant="displayVariant">
				<template #title>
					Impact
				</template>

				<template #default>
					<calendar-impact-list v-model="model" />
				</template>
			</modal-badge-list>
		</template>
	</modal-badge>
</template>

<style module="classes">
</style>
