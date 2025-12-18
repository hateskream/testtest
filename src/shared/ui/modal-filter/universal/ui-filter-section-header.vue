<script setup lang="ts">
import { useDisplayVariant } from '@/shared/ui/modal';

import DashboardFilterSectionHeader from '../dashboard/dashboard-filter-section-header.vue';
import TvFilterSectionHeader from '../tv/tv-filter-section-header.vue';

const props = defineProps<{
	isActive?: boolean;
	displayVariant?: 'new' | 'default';
}>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<dashboard-filter-section-header
		v-if="displayVariant === 'new'"
		:is-active="isActive"
	>
		<slot />

		<template #right>
			<slot name="right" />
		</template>
	</dashboard-filter-section-header>

	<tv-filter-section-header
		v-else
		:is-active="isActive"
	>
		<slot />

		<template #right>
			<slot name="right" />
		</template>
	</tv-filter-section-header>
</template>
