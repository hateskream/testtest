<script setup lang="ts">
import type { IDashboardInstance } from '../../model';
import { getDashboardComponent } from '../../utils';

interface IDashboardInstanceProps {
	item: IDashboardInstance;
}

const props = defineProps<IDashboardInstanceProps>();
</script>

<template>
	<component :is="getDashboardComponent(props.item.dashboardType)" />
</template>
