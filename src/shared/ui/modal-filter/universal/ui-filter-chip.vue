<script setup lang="ts">
import { useDisplayVariant } from '@/shared/ui/modal';

import DashboardFilterChip from '../dashboard/dashboard-filter-chip.vue';
import TvFilterChip from '../tv/tv-filter-chip.vue';

const props = defineProps<{
	isActive?: boolean;
	isEditing?: boolean;
	displayVariant?: 'new' | 'default';
}>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<dashboard-filter-chip
		v-if="displayVariant === 'new'"
		:is-active="isActive"
		:is-editing="isEditing"
	>
		<slot />
	</dashboard-filter-chip>

	<tv-filter-chip
		v-else
		:is-active="isActive"
		:is-editing="isEditing"
	>
		<slot />
	</tv-filter-chip>
</template>
