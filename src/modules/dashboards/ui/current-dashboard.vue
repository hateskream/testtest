<script setup lang="ts">
import {
	type IDashboardItem,
	type IMeta,
} from '@/modules/dashboard-group';
import { getWidgetComponent } from '../utils';

interface IGroupComponentProps {
	dashboardItem: IDashboardItem;
	meta: IMeta;
}

const props = defineProps<IGroupComponentProps>();
</script>

<template>
	<component
		:is="getWidgetComponent(props.dashboardItem.dashboardType)"
		:meta="props.meta"
	/>
</template>
