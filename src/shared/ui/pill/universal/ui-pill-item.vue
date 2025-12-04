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

<style module="classes">
.pill {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px 12px;
	font-style: normal;
	font-weight: 380;
	font-size: var(--typography-headers-size-h-02, 10px);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.04px;
	background: var(--color-bg-base-300, rgb(37 37 39 / 50%));
	border-radius: var(--radius-full, 9999px);
	cursor: pointer;
	gap: 6px;
	user-select: none;
}

.active {
	color: var(--color-text-base-500, #ffffff);
	background: var(--color-bg-active-base-300-active, rgb(51 51 51 / 80%));
}
</style>
