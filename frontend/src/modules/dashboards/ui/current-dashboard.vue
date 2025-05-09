<script setup lang="ts">
import {
	DashboardItemType,
	type IDashboardStack,
	type IDashboardFolder,
	type IDashboardInstance,
	type IDashboardItem,
	type IMeta,
} from '@/modules/dashboard-group';

import InstanceComponent from './instance-component.vue';
import StackComponent from './stack-component.vue';
import FolderComponent from './folder-component.vue';

interface IInstanceComponentProps {
	item: IDashboardInstance;
	meta: IMeta;
}

interface IFolderComponentProps {
	item: IDashboardFolder;
	meta: IMeta;
}

interface IStackComponentProps {
	item: IDashboardStack;
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
		case DashboardItemType.Stack:
			return StackComponent;
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
		case DashboardItemType.Stack:
			return { item, meta: props.meta } as IStackComponentProps;
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
