<script setup lang="ts">
import { useSlots } from 'vue';

import { UiDriver } from '@/shared/ui/driver';
import { ModalBadgeList, ModalItem, ModalItemNumber } from '@/modules/widgets/base';

import ModalSubmenuComponent from './modal-submenu-component.vue';

interface IWidgetContextMenuProps {
	title: string;
	dashboards: {
		id: string;
		name: string;
	}[];
	hasReset?: boolean;
}

const props = withDefaults(defineProps<IWidgetContextMenuProps>(), {
	hasReset: true,
});


const emits = defineEmits<{
	(e: 'duplicate'): void;
	(e: 'openFull'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'reset'): void;
	(e: 'delete'): void;
}>();

const slots = useSlots();
</script>

<template>
	<div :class="classes.widgetContextMenu">
		<div :class="classes.title">{{ props.title }}</div>

		<modal-item-number :value="1" @click="emits('duplicate')">Duplicate</modal-item-number>
		<modal-item-number :value="2" @click="emits('openFull')">Open full data</modal-item-number>

		<modal-submenu-component>
			<template #title>
				Move to
			</template>
			<template #content>
				<modal-badge-list>
					<template #default>
						<modal-item
							v-for="d in props.dashboards"
							:key="d.id"
							:class="classes.item"
							@click="emits('moveTo', d.id)"
						>
							{{ d.name }}
						</modal-item>
					</template>
				</modal-badge-list>
			</template>
		</modal-submenu-component>

		<ui-driver />

		<modal-submenu-component v-if="slots.filter">
			<template #title>Filter</template>
			<template #content>
				<modal-badge-list>
					<slot name="filter" />
				</modal-badge-list>
			</template>
		</modal-submenu-component>

		<modal-submenu-component v-if="slots['change-display']">
			<template #title>Change display</template>
			<template #content>
				<modal-badge-list>
					<slot name="change-display" />
				</modal-badge-list>
			</template>
		</modal-submenu-component>

		<template v-if="slots.other">
			<slot name="other" />
		</template>

		<modal-item
			v-if="props.hasReset"
			@click="emits('reset')"
		>
			Reset all changes
		</modal-item>

		<ui-driver v-if="props.hasReset" />
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
