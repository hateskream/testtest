<script setup lang="ts">

import { onMounted, onUnmounted, ref } from 'vue';


import { ChartCommonSectionLayout } from '@/modules/chart/components/shared/ui';
import type { ISectionProps } from '@/modules/chart/models';
import { WidgetHoldingsDiagram } from '../../widgets';
import { UiBanner } from '@/shared/ui/banner';

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
			<div :class="classes.diagram">
				<widget-holdings-diagram />
				<ui-banner>
					<template #title>
						Allocation Analysis
					</template>
					<template #text>
						<ul>
							<li>
								Top three sectors:
							</li>

							<li>
								• Financial Services
							</li>
							<li>
								• Technology
							</li>
							<li>
								• HealthcareThey represent nearly 60% of the total allocation.
							</li>
						</ul>

						<p>
							This appears to be a diversified but growth-oriented allocation,
							with significant emphasis on financial services and technology
							sectors while maintaining exposure across multiple economic segments.
						</p>

						<p>
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni cum omnis,
							eligendi esse fuga, ex aut quam rem numquam obcaecati minus nesciunt illum
							corporis inventore eaque.
						</p>

						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit.
							Veritatis, provident recusandae! Iste soluta omnis sapiente fugiat!
						</p>

						<p>
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni cum omnis,
							eligendi esse fuga, ex aut quam rem numquam obcaecati minus nesciunt illum
							corporis inventore eaque.
						</p>
					</template>
				</ui-banner>
			</div>
		</template>
	</chart-common-section-layout>
</template>

<style module="classes">
.section {
	display: flex;
	gap: 3px;
}

.diagram {
	display: flex;
}

.diagram > * {
	flex: 1 1 50%;
}
</style>
