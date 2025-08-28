<script setup lang="ts">

import { onMounted, onUnmounted, ref } from 'vue';

import { type ISectionProps } from '@/modules/chart/models';
import { ChartWidgetValuation, ChartWidgetsCapitalStructure } from '@/modules/chart/components/widgets';
import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';


const props = defineProps<ISectionProps>();


const valuationData = {
	pe: { ltm: '161.4', ntm: '132.7' },
	evSales: { ltm: '9.3', ntm: '8.8' },
	evEbitda: { ltm: '62.7', ntm: '54.5' },
	priceBook: { ltm: '12.2', ntm: null },
};

const capitalStructureData = {
	marketCap: '920.81B',
	totalDebt: '161.4x',
	cashAndInv: '9.3x',
	enterpriseValue: '62.7x',
};

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
			<div :class="classes.container">
				<div :class="classes.section">
					<chart-widget-valuation :values="valuationData" />
					<chart-widgets-capital-structure :values="capitalStructureData" />
				</div>
			</div>
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.container {
	container-type: inline-size;
}

.section {
	display: flex;
	gap: 3px;
}

@container (max-width: 599px) {
	.section {
		flex-direction: column;
	}
}
</style>
