<script setup lang="ts">
import { useSlots } from 'vue';

import { ModalBadgeList, ModalItem } from '@/modules/widgets/base';

import ModalSubmenuComponent from './modal-submenu-component.vue';

interface IWidgetContextMenuProps {
	hasReset?: boolean;
}

const props = withDefaults(defineProps<IWidgetContextMenuProps>(), {
	hasReset: true,
});


const emits = defineEmits<{
	(e: 'apply-changes'): void;
	(e: 'reset'): void;
}>();

const slots = useSlots();
</script>

<template>
	<div :class="classes.widgetContextMenu">
		<modal-submenu-component v-if="slots.filter">
			<template #title>Filter</template>
			<template #content>
				<modal-badge-list display-variant="default">
					<slot name="filter" />
				</modal-badge-list>
			</template>
		</modal-submenu-component>

		<modal-item
			@click="emits('apply-changes')"
		>
			Apply changes to widget
		</modal-item>

		<modal-item
			v-if="props.hasReset"
			@click="emits('reset')"
		>
			Reset all changes
		</modal-item>
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
	height: 40px;
	padding-inline: 12px;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	gap: 4px;
}

.item {
	cursor: pointer;
}
</style>
