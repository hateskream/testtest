<script setup lang="ts">
import DashboardTooltipWrapper from '../dashboard/dashboard-tooltip-wrapper.vue';
import TvTooltipWrapper from '../tv/tv-tooltip-wrapper.vue';

defineProps<{
	displayVariant: 'default' | 'new';
}>();
</script>

<template>
	<dashboard-tooltip-wrapper v-if="displayVariant === 'new'">
		<slot />
	</dashboard-tooltip-wrapper>

	<tv-tooltip-wrapper v-else>
		<slot />
	</tv-tooltip-wrapper>
</template>
