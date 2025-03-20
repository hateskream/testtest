<script setup lang="ts">
import { computed, ref } from 'vue';

import { dashboardTypeToFolderNameMapping, type IDashboardFolder } from '../../model';
import { getDashboardComponent } from '../../utils';

interface ITab {
	id: string;
	name: string;
}

interface IDashboardFolderProps {
	item: IDashboardFolder;
}

const props = defineProps<IDashboardFolderProps>();

const activeTab = ref(getInitialActiveTab());

const activeDashboardInstance = computed(() => {
	const dashboardInstance = props.item.items.find(item => item.id === activeTab.value);

	if (!dashboardInstance) {
		throw new Error('Dashboard instance not found');
	}

	return dashboardInstance;
});

const tabs = computed((): ITab[] =>
	props.item.items.map(item => ({
		id: item.id,
		name: dashboardTypeToFolderNameMapping[item.dashboardType],
	})),
);

function switchTab(id: string) {
	activeTab.value = id;
}

function getInitialActiveTab() {
	if (!props.item.items.length) {
		throw new Error('Folder is empty');
	}

	return props.item.items[0].id;
}
</script>

<template>
	<div :class="classes.root">
		<div
			v-for="tab in tabs"
			:key="tab.id"
			@click="switchTab(tab.id)"
		>
			{{ tab.name }}
		</div>

		<component :is="getDashboardComponent(activeDashboardInstance.dashboardType)" />
	</div>
</template>

<style module="classes">
.root {
	flex-grow: 1;
	flex-basis: 0;
}
</style>
