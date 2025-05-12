<script setup lang="ts">
import type { IDashboardInstance, IMeta } from '@/modules/dashboard-group';
import { getWidgetComponent } from '../utils';

interface IDashboardInstanceProps {
	item: IDashboardInstance;
	meta: IMeta;
}

const props = defineProps<IDashboardInstanceProps>();
</script>

<template>
	<component
		:is="getWidgetComponent(props.item.dashboardType)"
		:meta="props.meta"
	/>
</template>
