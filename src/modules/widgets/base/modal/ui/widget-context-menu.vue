<script setup lang="ts">
import { useSlots } from 'vue';

import { ModalBadgeList, ModalItem, ModalItemNumber } from '@/modules/widgets/base';
import { UiModalContent, UiModalDivider, UiModalTitle, UiModalWrapper } from '@/shared/ui/modal';

import ModalSubmenuComponent from './modal-submenu-component.vue';

interface IWidgetContextMenuProps {
	title: string;
	dashboards: {
		id: string;
		name: string;
	}[];
	hasReset?: boolean;
	displayVariant: 'new' | 'default';
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
	<ui-modal-wrapper :display-variant :class="classes.widgetContextMenu">
		<ui-modal-title>
			{{ props.title }}
		</ui-modal-title>

		<ui-modal-content>
			<modal-item-number :value="1" @click="emits('duplicate')">Duplicate</modal-item-number>
			<modal-item-number :value="2" @click="emits('openFull')">Open full data</modal-item-number>

			<modal-submenu-component>
				<template #title>
					Move to
				</template>
				<template #content>
					<modal-badge-list :display-variant>
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

			<ui-modal-divider />

			<modal-submenu-component v-if="slots.filter">
				<template #title>Filter</template>
				<template #content>
					<modal-badge-list :display-variant>
						<slot name="filter" />
					</modal-badge-list>
				</template>
			</modal-submenu-component>

			<modal-submenu-component v-if="slots['change-display']">
				<template #title>Change display</template>
				<template #content>
					<modal-badge-list :display-variant>
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

			<ui-modal-divider />

			<modal-item @click="emits('delete')">Delete</modal-item>
		</ui-modal-content>
	</ui-modal-wrapper>
</template>

<style module="classes">
.widgetContextMenu {
	min-width: 208px;
}

.item {
	cursor: pointer;
}
</style>
