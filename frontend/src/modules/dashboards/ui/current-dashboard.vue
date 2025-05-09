<script setup lang="ts">
import {
	DashboardItemType,
	type IDashboardCollection,
	type IDashboardFolder,
	type IDashboardInstance,
	type IDashboardItem,
	type IMeta,
} from '@/modules/dashboard-group';

import InstanceComponent from './instance-component.vue';
import CollectionComponent from './collection-component.vue';
import FolderComponent from './folder-component.vue';

interface IInstanceComponentProps {
	item: IDashboardInstance;
	meta: IMeta;
}

interface IFolderComponentProps {
	item: IDashboardFolder;
	meta: IMeta;
}

interface ICollectionComponentProps {
	item: IDashboardCollection;
	meta: IMeta;
}

interface IGroupComponentProps {
	dashboardItem: IDashboardItem;
	meta: IMeta;
}

const props = defineProps<IGroupComponentProps>();

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
			return { item, meta: props.meta } as IInstanceComponentProps;
		case DashboardItemType.Collection:
			return { item, meta: props.meta } as ICollectionComponentProps;
		case DashboardItemType.Folder:
			return { item, meta: props.meta } as IFolderComponentProps;
		default:
			throw new Error(`Unknown dashboard item type: ${(item as IDashboardItem).type}`);
	}
}
</script>

<template>
	<component
		:is="getComponent(props.dashboardItem)"
		v-bind="getProps(props.dashboardItem)"
	/>
</template>
