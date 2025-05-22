<script setup lang="ts">
import { inject } from 'vue';

import type { IDashboardItem, IMeta } from '@/modules/dashboard-group';
import { CurrentDashboardSymbol } from '../model';

interface IPlaceholderResizeComponent {
	dashboardItem: IDashboardItem;
	meta: IMeta;
}

const props = defineProps<IPlaceholderResizeComponent>();

const CurrentDashboard = inject(CurrentDashboardSymbol);
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
