<script setup lang="ts">
import { useDisplayVariant } from '@/shared/ui/modal';

import DashboardModalItem from '../dashboard/dashboard-modal-item.vue';
import TvModalItem from '../tv/tv-modal-item.vue';

const props = defineProps<{
	displayVariant?: 'default' | 'new';
}>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<dashboard-modal-item v-if="displayVariant === 'new'">
		<slot />
	</dashboard-modal-item>

	<tv-modal-item v-else>
		<slot />
	</tv-modal-item>
</template>

<style scoped>

</style>
