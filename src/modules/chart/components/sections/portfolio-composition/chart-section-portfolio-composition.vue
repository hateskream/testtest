<script setup lang="ts">

import { onMounted, onUnmounted, ref } from 'vue';


import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import { ChartWidgetPortfolioTable, ChartWidgetStylebox } from '@/modules/chart/components/widgets';
import type { ISectionProps } from '@/modules/chart/models';

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
			<div :class="classes.wrapper">
				<chart-widget-stylebox :class="classes.stylebox" />
				<chart-widget-portfolio-table :class="classes.table" />
			</div>
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.section {
	display: flex;
	gap: 3px;
}

.wrapper {
	display: flex;
}

.stylebox {
	flex: 0 0 50%;
}
</style>
