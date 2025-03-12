<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useDashboardGroupsStore } from '../model/dashboard-group-store';

const dashboardStore = useDashboardGroupsStore();

const { addTab, renameTab, switchTab } = dashboardStore;
const { tabs } = storeToRefs(dashboardStore);

const editingTab = ref<string | null>(null);
const tabName = ref<string>('');

function startEditing(tabId: string, name: string) {
	editingTab.value = tabId;
	tabName.value = name;
}

function finishEditing(tabId: string) {
	if (tabName.value.trim()) {
		renameTab(tabId, tabName.value.trim());
	}
	editingTab.value = null;
}
</script>

<template>
	<div :class="classes.tabs">
		<div
			v-for="tab in tabs"
			:key="tab.id"
			:class="[classes.tab, { [classes.active]: tab.isActive }]"
		>
			<input
				v-if="editingTab === tab.id"
				v-model="tabName"
				autofocus
				@blur="finishEditing(tab.id)"
				@keyup.enter="finishEditing(tab.id)"
			/>
			<span
				v-else
				@click="switchTab(tab.id)"
				@dblclick="startEditing(tab.id, tab.name)"
			>
				{{ tab.name }}
			</span>
		</div>
		<button @click="addTab">+ Add Tab</button>
	</div>
</template>

<style module="classes">
.tabs {
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
}

.tab {
	padding: 8px 16px;
	border: 1px solid #cccccc;
	border-radius: 4px;
	cursor: pointer;
}

.tab.active {
	color: #ffffff;
	background-color: #007bff;
}
</style>
