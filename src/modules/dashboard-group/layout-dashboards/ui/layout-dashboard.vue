<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

import { useDashboardList } from '../composables';

import DashboardContent from './dashboard-content.vue';
import HeaderDesktop from './header-desktop.vue';
import HeaderMobile from './header-mobile.vue';
import LayoutDashboardError from './layout-dashboard-error.vue';
import LayoutDashboardLoader from './layout-dashboard-loader.vue';

interface ILayoutDashboardEmits {
	close: [];
}

const emit = defineEmits<ILayoutDashboardEmits>();

const {
	tabs,
	activeDashboardId,
	changeActiveDashboard,
	isLoading,
	isError,
	refetch,
} = useDashboardList();

const { width } = useElementSize(useTemplateRef('viewport'));

const viewportWidth = computed(() => width.value);
const isMobile = computed(() => viewportWidth.value < 768 - 72 * 2);
</script>

<template>
	<div ref="viewport" :class="classes.root">
		<layout-dashboard-error v-if="isError" @retry="refetch" />
		<layout-dashboard-loader v-else-if="isLoading" :is-mobile="isMobile" />
		<div v-else-if="activeDashboardId" :class="classes.container">
			<header-desktop
				v-if="!isMobile"
				:tabs="tabs"
				@change-active="changeActiveDashboard"
			/>
			<dashboard-content
				:key="activeDashboardId"
				:dashboard-id="activeDashboardId"
				:is-mobile="isMobile"
			/>
			<header-mobile
				v-if="isMobile"
				:tabs="tabs"
				@close="emit('close')"
			/>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	overflow-x: hidden;
}

.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	margin: 8px 0;
	overflow: hidden;
	border: 1px solid #1d1d1e;
	border-radius: 18px;
}

@media (max-width: 768px) {
	.container {
		border-radius: 34px;
	}
}
</style>
