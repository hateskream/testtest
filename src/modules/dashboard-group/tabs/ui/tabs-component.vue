<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTimeoutFn } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type IDashboardTab } from '@/modules/dashboard-group/tv';
import type { ITab } from '../model';

import TabItem from './tab-item.vue';
import TabWrapper from './tab-wrapper.vue';
import SettingsDashboards from './settings-dashboards.vue';
import UndoDelete from './undo-delete.vue';

interface ITabsComponentProps {
	tabs: IDashboardTab[];
	isUndo: boolean;
}

const props = defineProps<ITabsComponentProps>();

const emit = defineEmits<{
	(event: 'add-tab'): void;
	(event: 'switch-tab', id: string): void;
	(event: 'rename-tab', id: string, name: string): void;
	(event: 'delete', id: string): void;
	(event: 'undo'): void;
}>();

const localTabs = ref<ITab[]>([]);

const visible = ref(false);

const { start } = useTimeoutFn(() => {
	visible.value = false;
}, 10_000);

watch(
	() => props.tabs,
	(newTabs, oldTabs) => {
		if (JSON.stringify(newTabs) === JSON.stringify(oldTabs)) {
			return;
		}

		if (localTabs.value.length === 0 || props.isUndo) {
			localTabs.value = initTabs(newTabs);
			return;
		}

		const tabs = newTabs.map(tab => ({
			...tab,
			isEditing: !localTabs.value.find(localTab => localTab.id === tab.id),
		}));

		localTabs.value = tabs;
	},
);

function initTabs(tabs: IDashboardTab[]): ITab[] {
	return tabs.map(tab => ({
		...tab,
		isEditing: false,
	}));
}

function onDelete() {
	visible.value = true;
	start();
	emit('delete', props.tabs.find(tab => tab.isActive)!.id);
}

function onUndo() {
	visible.value = false;
	emit('undo');
}

function onAddTab() {
	emit('add-tab');
}

function onSwitchTab(id: string) {
	emit('switch-tab', id);
}

function onRenameTab(id: string, name: string) {
	emit('rename-tab', id, name);
}
</script>

<template>
	<div :class="classes.tabs">
		<tab-item
			v-for="tab in localTabs"
			:key="tab.id"
			:tab="tab"
			@switch="onSwitchTab"
			@rename="onRenameTab"
		/>

		<tab-wrapper @click="onAddTab">
			<ui-icon
				:id="IconIds.Plus"
				width="12px"
				height="12px"
			/>
			New
		</tab-wrapper>

		<settings-dashboards
			:class="classes.settings"
			@delete="onDelete"
		/>

		<undo-delete
			v-if="visible"
			:class="classes.undo"
			@undo="onUndo"
		/>
	</div>
</template>

<style module="classes">
.tabs {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	gap: 10px;
}

.settings {
	position: absolute;
	right: 0;
}

.undo {
	position: fixed;
	bottom: 0;
	margin-bottom: 12px;
}
</style>
