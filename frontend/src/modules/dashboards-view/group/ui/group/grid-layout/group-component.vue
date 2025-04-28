<script setup lang="ts">
import { computed } from 'vue';

import {
	DashboardItemType,
	type IDashboardCollection,
	type IDashboardFolder,
	type IDashboardInstance,
	type IDashboardItem,
} from '../../../model';
import {
	useDashboardGroupsStore,
	useDashboardsStore,
} from '@/modules/dashboards-view/group/stores';

import InstanceComponent from '../instance-component.vue';
import CollectionComponent from '../collection-component.vue';
import FolderComponent from '../folder-component.vue';

interface IGroupComponentProps {
	itemId: number | string;
}

const props = defineProps<IGroupComponentProps>();

const dashboardStore = useDashboardsStore();

const dashboard = computed(() => dashboardStore.getDashboardById(props.itemId as string));

const getComponent = ({ type }: IDashboardItem) => {
	switch (type) {
		case DashboardItemType.Instance:
			return InstanceComponent;
		case DashboardItemType.Collection:
			return CollectionComponent;
		case DashboardItemType.Folder:
			return FolderComponent;
		default:
			throw new Error(`Unknown dashboard item type: ${type as string}`);
	}
};

function getProps(item: IDashboardItem) {
	switch (item.type) {
		case DashboardItemType.Instance:
			return { item } as { item: IDashboardInstance };
		case DashboardItemType.Collection:
			return { item } as { item: IDashboardCollection };
		case DashboardItemType.Folder:
			return { item } as { item: IDashboardFolder };
		default:
			throw new Error(`Unknown dashboard item type: ${(item as IDashboardItem).type}`);
	}
}
</script>

<template>
	<component
		:is="getComponent(dashboard)"
		v-bind="getProps(dashboard)"
	/>
</template>
