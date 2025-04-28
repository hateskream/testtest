<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDashboardsStore } from '../../stores';

import GroupComponent from './group-component.vue';
import DashboardGroupContent from './grid-layout/dashboard-group-content.vue';

const { activeGroup } = storeToRefs(useDashboardsStore());
</script>

<template>
	<!-- <group-component :items="activeGroup.items" /> -->
	<dashboard-group-content />
</template>
