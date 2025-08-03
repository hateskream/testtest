<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import { ModalItem, ModalItemNumber } from '@/modules/widgets/base';

interface IWidgetContextMenuProps {
	title: string;
}
const props = defineProps<IWidgetContextMenuProps>();

const emits = defineEmits<{
	(e: 'duplicate'): void;
	(e: 'openFull'): void;
	(e: 'wrap'): void;
	(e: 'moveTo'): void;
	(e: 'reset'): void;
	(e: 'delete'): void;
}>();
</script>

<template>
	<div :class="classes.widgetContextMenu">
		<div :class="classes.title">{{ props.title }}</div>

		<modal-item-number :value="1" @click="emits('duplicate')">Duplicate</modal-item-number>
		<modal-item-number :value="2" @click="emits('openFull')">Open full data</modal-item-number>
		<modal-item-number :value="3" @click="emits('wrap')">Wrap in stack</modal-item-number>

		<modal-item @click="emits('moveTo')">Move to</modal-item>

		<ui-driver />

		<slot />

		<modal-item @click="emits('reset')">Reset all changes</modal-item>

		<ui-driver />
		<modal-item @click="emits('delete')">Delete</modal-item>
	</div>
</template>

<style module="classes">
.widgetContextMenu {
	min-width: 208px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}

.title {
	display: flex;
	align-items: center;
	width: max-content;
	padding: 12px;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	gap: 4px;
}
</style>
