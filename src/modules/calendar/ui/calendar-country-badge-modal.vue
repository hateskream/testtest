<script setup lang="ts">
import { computed } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import { ModalBadge, ModalBadgeList } from '@/modules/widgets/base';
import { CalendarCountryIds, calendarCountryData } from '../model/calendar';

import CalendarCountryList from './common/calendar-country-list.vue';

const props = defineProps<{
	displayVariant: 'new' | 'default';
}>();

const model = defineModel<CalendarCountryIds[]>({
	required: true,
});

const isAllSelected = computed(() => {
	return model.value.length === Object.values(CalendarCountryIds).length;
});

const marketIcon = computed(() => {
	if (isAllSelected.value) {
		return IconIds.Globus;
	}

	return calendarCountryData.find(v => v.id === model.value[0])?.icon || IconIds.Globus;
});

const marketLabel = computed(() => {
	const notAnySelectedItem = model.value.length === 0;

	if (notAnySelectedItem || isAllSelected.value) {
		return 'Entire World';
	}

	const firstItemLabel = calendarCountryData.find(v => v.id === model.value[0])!.label;

	if (model.value.length === 1) {
		return firstItemLabel;
	}

	return `${firstItemLabel} +${model.value.length - 1}`;
});
</script>

<template>
	<modal-badge :display-variant="props.displayVariant">
		<template #title>
			<ui-icon :id="marketIcon" />
			<ui-text token="text-200-r" as="div">{{ marketLabel }}</ui-text>
			<ui-icon :id="IconIds.DropdownDown" />
		</template>
		<template #content>
			<modal-badge-list :display-variant="props.displayVariant">
				<template #title>Markets</template>
				<template #default>
					<calendar-country-list v-model="model" />
				</template>
			</modal-badge-list>
		</template>
	</modal-badge>
</template>

<style module="classes">
</style>
