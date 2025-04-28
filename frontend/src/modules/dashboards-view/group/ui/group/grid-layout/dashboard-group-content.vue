<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDashboardsStore } from '@/modules/dashboards-view/group/stores';

import TestComponent from './test-component.vue';

const { widgets } = storeToRefs(useDashboardsStore());
</script>

<template>
	<test-component :dashboards="widgets" />
</template>
