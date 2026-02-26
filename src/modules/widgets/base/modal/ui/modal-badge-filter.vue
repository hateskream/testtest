<script setup lang="ts" generic="T extends string | number">
import { useTemplateRef } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
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
	icon?: IconIds;
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
		<template #title>
			<ui-icon
				v-if="props.icon"
				:id="props.icon"
				width="16"
				height="16"
			/>
			<span :class="classes.label">{{ props.label }}</span>
		</template>
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
.label {
	line-height: 1;
}
</style>
