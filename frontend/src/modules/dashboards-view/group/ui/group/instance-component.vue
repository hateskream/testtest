<script setup lang="ts">
import { storeToRefs } from 'pinia';

import type { IDashboardInstance } from '../../model';
import { useDashboardsStore } from '../../stores';
import { getDashboardComponent } from '../../utils';

interface IDashboardInstanceProps {
	item: IDashboardInstance;
}

const props = defineProps<IDashboardInstanceProps>();

const { activeGroup } = storeToRefs(useDashboardsStore());
</script>

<template>
	<component
		:is="getDashboardComponent(props.item.dashboardType)"
		:market="activeGroup.market"
	/>
</template>
