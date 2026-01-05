<script setup lang="ts" generic="T extends string | number">
import { useTemplateRef } from 'vue';

import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import type { IFilterOption } from '../model';

const emit = defineEmits<{
	select: [value: IFilterOption<T>];
}>();

const props = defineProps<{
	displayVariant: 'default' | 'new';
	label?: string;
	title?: string;
	options: IFilterOption<T>[];
	selectedValue?: T;
	closeOnSelect?: boolean;
}>();

const dropdownRef = useTemplateRef('dropdown');

function closeDropdown() {
	dropdownRef.value?.close?.();
}

function select(option: IFilterOption<T>) {
	emit('select', option);

	if (props.closeOnSelect) {
		closeDropdown();
	}
}
</script>

<template>
	<modal-badge-dropdown ref="dropdown" :display-variant="props.displayVariant">
		<template #title>{{ props.label }}</template>
		<template #content>
			<modal-badge-list :display-variant="props.displayVariant">
				<template #title>{{ props.title }}</template>
				<modal-item-selector
					v-for="option in props.options"
					:key="option.value"
					:model-value="option.value === props.selectedValue"
					@update:model-value="select(option)"
				>
					{{ option.label }}
				</modal-item-selector>
			</modal-badge-list>
		</template>
	</modal-badge-dropdown>
</template>

<style module="classes">
</style>
