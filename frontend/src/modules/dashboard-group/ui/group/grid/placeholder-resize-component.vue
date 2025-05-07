<script setup lang="ts">
import type { IDashboardItem } from '../../../model';

import CurrentDashboard from '../dashboard/current-dashboard.vue';

interface IPlaceholderResizeComponent {
	dashboardItem: IDashboardItem;
	isResizing: boolean;
}

const props = defineProps<IPlaceholderResizeComponent>();
</script>

<template>
	<div :class="classes.root">
		<current-dashboard
			:dashboard-item="props.dashboardItem"
			:is-resizing="props.isResizing"
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
