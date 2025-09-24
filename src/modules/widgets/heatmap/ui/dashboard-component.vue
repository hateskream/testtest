<script setup lang="ts">
import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import { BaseDashboardComponent } from '../../base/index.ts';
import { TreemapComponent } from '@/modules/treemap';
import { useHeatmap } from '../composables';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	marketSettings,
	sizeBySettings,
	colorBySettings,
	colorDepthSettings,
	displayValueSettings,
	activeColorBy,
	activeSizeBy,
	activeColorDepth,
	activeDisplayValue,
	isShowLogo,
	titleSetting,
	activeMarket,
	activeGroupBy,
	groupBySettings,
} = useHeatmap();

</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<div :class="classes.heatmap">
				<treemap-component
					v-model:market="marketSettings"
					v-model:size-by="sizeBySettings"
					v-model:color-by="colorBySettings"
					v-model:color-depth="colorDepthSettings"
					v-model:display-value="displayValueSettings"
					v-model:group-by="groupBySettings"
					v-model:is-show-logo="isShowLogo"
					v-model:title="titleSetting"
					:active-market="activeMarket"
					:active-color-by="activeColorBy"
					:active-color-depth="activeColorDepth"
					:active-size-by="activeSizeBy"
					:active-display-value="activeDisplayValue"
					:active-group-by="activeGroupBy"
				/>
			</div>
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.heatmap {
	position: relative;
	display: flex;
	height: 100%;
}
</style>
