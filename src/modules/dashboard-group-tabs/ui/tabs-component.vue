<script setup lang="ts">
import { ref, watch } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type IDashboardTab } from '@/modules/dashboard-group';
import type { ITab } from '../model';

import TabItem from './tab-item.vue';
import TabWrapper from './tab-wrapper.vue';

interface ITabsComponentProps {
	tabs: IDashboardTab[];
}

const props = defineProps<ITabsComponentProps>();

const emit = defineEmits<{
	(event: 'add-tab'): void;
	(event: 'switch-tab', id: string): void;
	(event: 'rename-tab', id: string, name: string): void;
}>();

const localTabs = ref<ITab[]>(initTabs(props.tabs));

watch(
	() => [...props.tabs],
	(newTabs) => {
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
	</div>
</template>

<style module="classes">
.tabs {
	display: flex;
	gap: 10px;
	justify-content: center;
}
</style>
