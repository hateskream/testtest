<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDashboardsStore } from '@/modules/dashboards-view/group/stores';
import { GridComponent } from './grid';

// import GridComponent from '';

const { activeGroup } = storeToRefs(useDashboardsStore());
</script>

<template>
	<grid-component :dashboards="activeGroup" />
</template>
