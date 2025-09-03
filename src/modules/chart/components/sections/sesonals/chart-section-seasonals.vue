<script setup lang="ts">

import { onMounted, onUnmounted, ref } from 'vue';

import type { ISectionProps } from '@/modules/chart/models';
import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import { ChartSeasonals } from '@/modules/lightweight-charts';


const props = defineProps<ISectionProps>();


const itemRef = ref<HTMLElement | null>(null);

// Register the ref when component mounts
onMounted(() => {
	if (itemRef.value) {
		props.registerItemRef(props.section.id, itemRef.value);
		props.section.items?.forEach((item) => {
			props.registerItemRef(item.id, itemRef.value);
		});

	}
});
onUnmounted(() => {
	props.registerItemRef(props.section.id, null);
	props.section.items?.forEach((item) => {
		props.registerItemRef(item.id, null);
	});
});

</script>

<template>
	<chart-common-section-layout>
		<template #refAnchor>
			<div ref="itemRef"></div>
		</template>
		<template #title>{{ props.section?.title }}</template>
		<template #body>
			<chart-seasonals />
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">


</style>
