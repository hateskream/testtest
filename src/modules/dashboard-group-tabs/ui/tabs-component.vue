<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type IDashboardTab } from '@/modules/dashboard-group';

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
			v-for="tab in props.tabs"
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
