<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useDashboardGroupsStore } from '../stores';

import TabItem from './tab-item.vue';
import TabWrapper from './tab-wrapper.vue';

const dashboardStore = useDashboardGroupsStore();
const { addTab, switchTab, renameTab } = dashboardStore;
const { tabs } = storeToRefs(dashboardStore);
</script>

<template>
	<div :class="classes.tabs">
		<tab-item
			v-for="tab in tabs"
			:key="tab.id"
			:tab="tab"
			@switch="switchTab"
			@rename="renameTab"
		/>
		<tab-wrapper @click="addTab">
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
