<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import type { IDashboardInstance, IMeta } from '../../../model';
import { useDashboardsStore } from '../../../stores';
import { getDashboardComponent } from '../../../utils';

interface IDashboardInstanceProps {
	item: IDashboardInstance;
}

const props = defineProps<IDashboardInstanceProps>();

const { activeGroup } = storeToRefs(useDashboardsStore());

const meta = computed(
	(): IMeta => ({
		market: activeGroup.value.market,
		isResizing: props.item.isResizing || false,
		name: props.item.name,
	}),
);
</script>

<template>
	<component
		:is="getDashboardComponent(props.item.dashboardType)"
		:meta="meta"
	/>
</template>
