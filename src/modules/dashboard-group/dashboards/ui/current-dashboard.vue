<script setup lang="ts">
import {
	type IWidget,
	type IMeta,
} from '@/modules/dashboard-group';
import { getWidgetComponent } from '../utils';

interface IGroupComponentProps {
	dashboardItem: IWidget;
	meta: IMeta;
}

const props = defineProps<IGroupComponentProps>();
</script>

<template>
	<component
		:is="getWidgetComponent(props.dashboardItem.widgetType)"
		:meta="props.meta"
	/>
</template>
