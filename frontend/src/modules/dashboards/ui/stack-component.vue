<script setup lang="ts">
import type { Component } from 'vue';

import {
	DashboardItemType,
	type IDashboardStack,
	type IDashboardFolder,
	type IDashboardInstance,
	type IMeta,
} from '@/modules/dashboard-group';
import { getWidgetComponent } from '../utils';

import FolderComponent from './folder-component.vue';

interface IDashboardStackProps {
	item: IDashboardStack;
	meta: IMeta;
}

const props = defineProps<IDashboardStackProps>();

function getComponent(item: IDashboardInstance | IDashboardFolder): Component {
	if (item.type === DashboardItemType.Instance) {
		return getWidgetComponent(item.dashboardType);
	}
	return FolderComponent;
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
				:meta="props.meta"
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
