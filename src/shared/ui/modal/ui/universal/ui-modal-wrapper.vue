<script setup lang="ts">
import { DashboardModalWrapper } from '../dashboard';
import { TvModalWrapper } from '../tv';

defineProps<{
	displayVariant: 'default' | 'new';
}>();
</script>

<template>
	<tv-modal-wrapper v-if="displayVariant === 'default'">
		<slot />
	</tv-modal-wrapper>

	<dashboard-modal-wrapper v-else>
		<slot />
	</dashboard-modal-wrapper>
</template>
