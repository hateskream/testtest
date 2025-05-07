<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDashboardsStore } from '@/modules/dashboard-group/stores';
import { GridComponent } from './grid';

const { activeGroup } = storeToRefs(useDashboardsStore());
</script>

<template>
	<grid-component :dashboards="activeGroup" />
</template>
