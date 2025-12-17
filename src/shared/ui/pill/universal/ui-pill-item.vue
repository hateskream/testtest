<script setup lang="ts">
import { useDisplayVariant } from '@/shared/ui/modal';

import TvPillItem from '../tv/tv-pill-item.vue';
import DashboardPillItem from '../dashboard/dashboard-pill-item.vue';

const props = defineProps<{
	displayVariant?: 'default' | 'new';
}>();

const model = defineModel<boolean>();

const { displayVariant } = useDisplayVariant(() => props.displayVariant);
</script>

<template>
	<dashboard-pill-item v-if="displayVariant === 'new'" v-model="model">
		<slot />
	</dashboard-pill-item>

	<tv-pill-item v-else v-model="model">
		<slot />
	</tv-pill-item>
</template>
