<script setup lang="ts">
import { DashboardType } from '../model/types';
import { useDashboardsStore } from '../model/dashboards-store';

const dashboardTypes = Object.values(DashboardType);

const dashboardStore = useDashboardsStore();

const { addDashboard } = dashboardStore;

function addNewDashboard(event: Event) {
	const target = event.target as HTMLSelectElement;
	const type = target.value;

	if (type) {
		addDashboard(type as DashboardType);
	}
}
</script>

<template>
	<select @change="addNewDashboard">
		<option value="">Add Dashboard</option>
		<option
			v-for="type in dashboardTypes"
			:key="type"
			:value="type"
		>
			{{ type }}
		</option>
	</select>
</template>
