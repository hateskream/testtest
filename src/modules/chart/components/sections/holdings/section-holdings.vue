<script setup lang="ts">

import { onMounted, onUnmounted, ref } from 'vue';


import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import type { ISectionProps } from '@/modules/chart/models';

import WidgetAddressesHoldings from '../../widgets/holdings/widget-addresses-holdings.vue';
import WidgetHeldHoldings from '../../widgets/holdings/widget-held-holdings.vue';
import WidgetWhaleHoldings from '../../widgets/holdings/widget-whale-holdings.vue';


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
		<template #refAnchor><div ref="itemRef"></div></template>
		<template #title>{{props.section?.title}}</template>
		<template #body>
			<div :class="classes.addresses">
				<widget-addresses-holdings />
				<widget-whale-holdings />
			</div>
			<widget-held-holdings />
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.section {
	display: flex;
	gap: 3px;
}

.addresses {
	display: flex;
	align-items: center;
	gap: 4px;
}


</style>
