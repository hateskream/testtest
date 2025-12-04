<script setup lang="ts">
import { DashboardModalContent } from '../dashboard';
import { TvModalContent } from '../tv';
import { useDisplayVariant } from '../../composables';

const props = defineProps<{
	displayVariant?: 'default' | 'new';
}>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<dashboard-modal-content v-if="displayVariant === 'new'">
		<slot />
	</dashboard-modal-content>

	<tv-modal-content v-else>
		<slot />
	</tv-modal-content>
</template>

<style scoped>

</style>
