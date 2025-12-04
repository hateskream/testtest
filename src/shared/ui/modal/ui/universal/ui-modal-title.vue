<script setup lang="ts">
import { DashboardModalTitle } from '../dashboard';
import { TvModalTitle } from '../tv';
import { useDisplayVariant } from '../../composables';

const props = defineProps<{
	displayVariant?: 'default' | 'new';
	bordered?: boolean;
}>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<tv-modal-title v-if="displayVariant === 'default'">
		<slot />
	</tv-modal-title>

	<dashboard-modal-title v-else :bordered="bordered">
		<slot />
	</dashboard-modal-title>
</template>
