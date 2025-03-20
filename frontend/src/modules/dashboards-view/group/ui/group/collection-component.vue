<script setup lang="ts">
import {
	DashboardItemType,
	type IDashboardCollection,
	type IDashboardFolder,
	type IDashboardInstance,
} from '../../model';
import { getDashboardComponent } from '../../utils';

import FolderComponent from './folder-component.vue';

interface IDashboardCollectionProps {
	item: IDashboardCollection;
}

const props = defineProps<IDashboardCollectionProps>();

function getComponent(item: IDashboardInstance | IDashboardFolder) {
	if (item.type === DashboardItemType.Instance) {
		return getDashboardComponent(item.dashboardType);
	}
	return FolderComponent;
}

function getProps(item: IDashboardInstance | IDashboardFolder) {
	if (item.type === DashboardItemType.Folder) {
		return { item };
	}

	return {};
}
</script>

<template>
	<div>
		<component
			:is="getComponent(itemDashboard)"
			v-for="itemDashboard in props.item.items"
			:key="itemDashboard.id"
			v-bind="getProps(itemDashboard)"
		/>
	</div>
</template>
