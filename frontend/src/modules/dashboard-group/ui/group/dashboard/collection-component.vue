<script setup lang="ts">
import { storeToRefs } from 'pinia';

import {
	DashboardItemType,
	type IDashboardCollection,
	type IDashboardFolder,
	type IDashboardInstance,
} from '../../../model';
import { getDashboardComponent } from '../../../utils';
import { useDashboardsStore } from '../../../stores';

import FolderComponent from './folder-component.vue';

interface IDashboardCollectionProps {
	item: IDashboardCollection;
}

const props = defineProps<IDashboardCollectionProps>();

const { activeGroup } = storeToRefs(useDashboardsStore());

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

	return { market: activeGroup.value.market };
}
</script>

<template>
	<div :class="clasese.root">
		<div :class="clasese.name">
			{{ item.name }}
		</div>
		<div :class="clasese.content">
			<component
				:is="getComponent(itemDashboard)"
				v-for="itemDashboard in props.item.items"
				:key="itemDashboard.id"
				v-bind="getProps(itemDashboard)"
			/>
		</div>
	</div>
</template>

<style module="clasese">
.root {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.name {
	padding: 8px 24px 0 16px;
	font-weight: 440;
	font-size: 13px;
	line-height: 170%;
	color: var(--text-color-base-100);
}

.content {
	display: flex;
	gap: 6px;
}

/* .content > * {
	flex-grow: 1;
	flex-basis: 0;
} */
</style>
