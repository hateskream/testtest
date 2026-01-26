<script setup lang="ts">
import { computed } from 'vue';

import { IconIds } from '@/shared/ui/icon';
import { UiIcon } from '@/shared/ui/icon';
import { ModalBadge, ModalBadgeList, ModalItemCheckbox } from '@/modules/widgets/base';
import { CalendarCountryIds, calendarCountryData } from '../model/calendar';
import { UiText } from '@/shared/ui/text';

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
	<modal-badge :display-variant="props.displayVariant">
		<template #title>
			<ui-icon :id="marketIcon" />
			<ui-text token="text-200-r" as="div">{{marketLabel}}</ui-text>
			<ui-icon :id="IconIds.DropdownDown" />
		</template>
		<template #content>
			<modal-badge-list :display-variant="props.displayVariant">
				<template #title>Markets</template>
				<template #default>
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
							<span>
								Entire World
							</span>
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
									width="14px"
									height="14px"
								/>
							</div>
							<span>
								{{country.label}}
							</span>
						</div>
					</modal-item-checkbox>
				</template>
			</modal-badge-list>
		</template>
	</modal-badge>
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
	outline: 1px solid rgb(44 44 44 / 100%);
}
</style>
