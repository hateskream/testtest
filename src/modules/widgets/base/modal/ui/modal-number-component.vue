<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

import ModalItemComponent from './modal-item-component.vue';

interface IProps {
	value: string | number;
}

defineProps<IProps>();
</script>

<template>
	<modal-item-component :class="classes.content">
		<ui-text token="text-300-r" as="div">
			<slot name="default" />
		</ui-text>
		<ui-text token="text-200-r" :class="classes.number">{{ value }}</ui-text>
	</modal-item-component>
</template>

<style module="classes">
.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}

.number {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	color: var(--text-color-base-300);
	border: 1px solid var(--border-color-surface-02);
	border-radius: 9px;
}
</style>
