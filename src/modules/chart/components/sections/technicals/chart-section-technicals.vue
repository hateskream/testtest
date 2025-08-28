<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import { ChartWidgetOscillators, ChartWidgetOscillatorsTable } from '@/modules/chart/components/widgets/oscillators';
import { ChartWidgetMovingAverages } from '@/modules/chart/components/widgets/moving-averages';
import type { ISectionProps } from '@/modules/chart/models';


const props = defineProps<ISectionProps>();


const itemRef = ref<HTMLElement | null>(null);


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
			<div :class="classes.container">
				<div :class="classes.peGroup">
					<chart-widget-oscillators />
					<chart-widget-moving-averages />
				</div>
				<div>
					<chart-widget-oscillators-table />
				</div>
			</div>
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.peGroup {
	display: flex;
	flex-direction: row;
	gap: 4px;
}

.container {
	container-type: inline-size;
}

@container (max-width: 599px) {
	.peGroup {
		flex-direction: column;
	}
}
</style>
