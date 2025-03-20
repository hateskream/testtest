<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDashboardsStore } from '../../stores';

import GroupComponent from './group-component.vue';

const { activeGroup } = storeToRefs(useDashboardsStore());
</script>

<template>
	<group-component :items="activeGroup.items" />
</template>
