<script setup lang="ts">
import { useDisplayVariant } from '@/shared/ui/modal';

import DashboardPillWrapper from '../dashboard/dashboard-pill-wrapper.vue';
import TvPillWrapper from '../tv/tv-pill-wrapper.vue';

const props = defineProps<{
	displayVariant?: 'default' | 'new';
}>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<dashboard-pill-wrapper v-if="displayVariant === 'new'">
		<slot />
	</dashboard-pill-wrapper>

	<tv-pill-wrapper v-else>
		<slot />
	</tv-pill-wrapper>
</template>

<style scoped>

</style>
