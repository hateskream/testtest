<script setup lang="ts">
import { useDisplayVariant } from '../../composables';
import { TvModalDivider } from '../tv';
import { DashboardModalDivider } from '../dashboard';

const props = defineProps<{
	displayVariant?: 'default' | 'new';
}>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<dashboard-modal-divider v-if="displayVariant === 'new'" />

	<tv-modal-divider v-else />
</template>
