<script setup lang="ts">
import { computed } from 'vue';

import { UiDriver } from '@/shared/ui/driver';
import { ModalBadgeList, ModalItem, ModalItemInteraction, ModalItemNumber } from '@/modules/widgets/base';
import { type IPositionProps, UiPosition } from '@/shared/ui/position';

interface IWidgetContextMenuProps {
	title: string;
	dashboards: {
		id: string;
		name: string;
	}[];
	hasReset?: boolean;
	uiPositionProps?: IPositionProps;
}

const props = withDefaults(defineProps<IWidgetContextMenuProps>(), {
	hasReset: true,
	uiPositionProps: () => ({}),
});

const uiPropsWithDefaults = computed<IPositionProps>(() => ({
	trigger: 'hover',
	teleport: false,
	...props.uiPositionProps,
}));

const emits = defineEmits<{
	(e: 'duplicate'): void;
	(e: 'openFull'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'reset'): void;
	(e: 'delete'): void;
}>();
</script>

<template>
	<div :class="classes.widgetContextMenu">
		<div :class="classes.title">{{ props.title }}</div>

		<modal-item-number :value="1" @click="emits('duplicate')">Duplicate</modal-item-number>
		<modal-item-number :value="2" @click="emits('openFull')">Open full data</modal-item-number>

		<ui-position v-bind="uiPropsWithDefaults">
			<template #default>
				<modal-item-interaction>
					Move to
				</modal-item-interaction>
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
		</ui-position>

		<ui-driver />

		<slot />

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
