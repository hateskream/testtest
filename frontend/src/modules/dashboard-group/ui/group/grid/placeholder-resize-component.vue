<script setup lang="ts">
import type { IDashboardItem, IMeta } from '../../../model';
import { CurrentDashboard } from '@/modules/dashboards';

interface IPlaceholderResizeComponent {
	dashboardItem: IDashboardItem;
	meta: IMeta;
}

const props = defineProps<IPlaceholderResizeComponent>();
</script>

<template>
	<div :class="classes.root">
		<current-dashboard
			:dashboard-item="props.dashboardItem"
			:meta="props.meta"
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
