<script setup lang="ts">
import type { IWidget } from '@/modules/dashboard-group/core';
import { CurrentDashboard } from '@/modules/dashboard-group/dashboards';

interface IPlaceholderResizeComponent {
	dashboardItem: IWidget;
}

const props = defineProps<IPlaceholderResizeComponent>();
</script>

<template>
	<div :class="classes.root">
		<current-dashboard
			:dashboard-item="props.dashboardItem"
			is-resizing
		/>
	</div>
</template>

<style module="classes">
.root {
	width: 100%;
	height: 100%;
	padding: 7px;
}
</style>
