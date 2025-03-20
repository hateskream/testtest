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
		<div :class="classes.tabsContainer">
			<div
				v-for="tab in tabs"
				:key="tab.id"
				:class="[classes.tab, { [classes.activeTab]: tab.id === activeTab }]"
				@click="switchTab(tab.id)"
			>
				{{ tab.name }}
			</div>
		</div>

		<div :class="classes.content">
			<component :is="getDashboardComponent(activeDashboardInstance.dashboardType)" />
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
	flex-basis: 0;
	flex-direction: column;
}

.tabsContainer {
	display: flex;
	justify-content: flex-start;
	overflow: hidden;
}

.tab {
	position: relative;
	padding: 10px 16px;
	font-size: 16px;
	line-height: 140%;
	color: var(--text-color-base-300);
	letter-spacing: 0.104px;
}

.tab:not(.activeTab) {
	background-color: var(--bg-color-surface-00);
	cursor: pointer;
}

.tab:hover:not(.activeTab) {
	background-color: var(--bg-color-surface-03);
	border-radius: 18px;
}

.activeTab {
	position: relative;
	z-index: 1;
	background-color: var(--bg-color-surface-01);
	border-top-left-radius: 18px;
	border-top-right-radius: 18px;
	pointer-events: none;
}

.activeTab::before,
.activeTab::after {
	content: '';
	position: absolute;
	bottom: 0;
	width: 16px;
	height: 16px;
}

.activeTab::before {
	left: -16px;
	/* stylelint-disable-next-line declaration-colon-newline-after */
	background: radial-gradient(
		circle at top left,
		transparent 16px,
		var(--bg-color-surface-01) 16px
	);
}

.activeTab::after {
	right: -16px;
	/* stylelint-disable-next-line declaration-colon-newline-after */
	background: radial-gradient(
		circle at top right,
		transparent 16px,
		var(--bg-color-surface-01) 16px
	);
}

.content {
	flex: 1;
	padding: 16px;
	background-color: var(--bg-color-surface-01);
	border-radius: 0 18px 18px;
}
</style>
