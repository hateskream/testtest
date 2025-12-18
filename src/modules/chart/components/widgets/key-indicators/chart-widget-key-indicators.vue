<script setup lang="ts">

import { ChartCommonWidgetLayout } from '../../shared/ui';
import { IconIds, UiIcon } from '@/shared/ui/icon';


interface IIndicator {
	icon: IconIds;
	text: string;
}

interface IChartSectionProps {
	indicators: IIndicator[];
	time: string;
}

const props = defineProps<IChartSectionProps>();
</script>

<template>
	<chart-common-widget-layout>
		<template #header>Key indicators</template>
		<template #body>
			<div :class="classes.bodyWrapper">
				<div v-for="indicator in props.indicators" :class="classes.row">
					<ui-icon
						:id="indicator.icon"
						width="18"
						height="18"
					/>
					<div class="text-200-r">
						{{ indicator.text }}
					</div>
				</div>
				<div class="text-100-r" :class="classes.summarized">Summarized at{{props.time}}</div>
			</div>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.row {
	display: flex;
	align-items: center;
	height: 20px;
	overflow: hidden;
	color: var(--text-color-base-500);
	gap: 4px;
}

.bodyWrapper {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding-bottom: 5px;
}

.summarized {
	color: var(--text-color-base-300);
}
</style>
