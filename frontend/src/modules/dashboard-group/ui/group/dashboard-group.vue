<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDashboardsStore } from '@/modules/dashboard-group/stores';
import { DashboardGrid } from '@/modules/dashboard-grid';

const { activeGroup } = storeToRefs(useDashboardsStore());
</script>

<template>
	<dashboard-grid :dashboards="activeGroup" />
</template>
