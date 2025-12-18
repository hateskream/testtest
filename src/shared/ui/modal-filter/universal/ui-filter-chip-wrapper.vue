<script setup lang="ts">
import { useDisplayVariant } from '@/shared/ui/modal';

import DashboardFilterChipWrapper from '../dashboard/dashboard-filter-chip-wrapper.vue';
import TvFilterChipWrapper from '../tv/tv-filter-chip-wrapper.vue';

const props = defineProps<{
	isActive?: boolean;
	displayVariant?: 'new' | 'default';
}>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<dashboard-filter-chip-wrapper
		v-if="displayVariant === 'new'"
	>
		<slot />
	</dashboard-filter-chip-wrapper>

	<tv-filter-chip-wrapper
		v-else
	>
		<slot />
	</tv-filter-chip-wrapper>
</template>
