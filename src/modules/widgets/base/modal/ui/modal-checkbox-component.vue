<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

import ModalItemComponent from './modal-item-component.vue';

export interface IModalCheckboxProps {
	disabled?: boolean;
}

const props = defineProps<IModalCheckboxProps>();

const modelValue = defineModel<boolean>({ default: false });

function toggle() {
	if (props.disabled) {
		return;
	}

	modelValue.value = !modelValue.value;
}
</script>

<template>
	<modal-item-component
		:disabled="props.disabled"
		:class="[
			classes.content,
			{
				[classes.disabled]: props.disabled
			}
		]"
		@click="toggle"
	>
		<slot name="default" />
		<div v-if="!props.disabled" :class="[classes.icon, { [classes.iconActive]: modelValue }]">
			<ui-icon
				v-if="modelValue"
				:id="IconIds.RcmCheckbox"
				width="12px"
			/>
		</div>
	</modal-item-component>
</template>

<style module="classes">
.icon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 18px;
	height: 18px;
	padding: 4px;
	color: var(--icon-color-base-500);
	border-radius: 6px;
	transition: color 0.2s ease;
}

.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 5px;
}

.content:not(.disabled) {
	cursor: pointer;
}

.content.disabled {
	opacity: 0.6;
}

.content:hover .icon {
	color: var(--icon-color-base-300);
}
</style>
