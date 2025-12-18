<script setup lang="ts">
import { useDisplayVariant } from '@/shared/ui/modal';

import DashboardFilterSectionLabel from '../dashboard/dashboard-filter-section-label.vue';
import TvFilterSectionLabel from '../tv/tv-filter-section-label.vue';

const props = defineProps<{
	isActive?: boolean;
	displayVariant?: 'new' | 'default';
}>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<dashboard-filter-section-label
		v-if="displayVariant === 'new'"
		:is-active="isActive"
	>
		<slot />
	</dashboard-filter-section-label>

	<tv-filter-section-label
		v-else
		:is-active="isActive"
	>
		<slot />
	</tv-filter-section-label>
</template>
