<script setup lang="ts">
import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import { BaseDashboardComponent } from '../../base/index.ts';
import { TreemapComponent } from '@/modules/treemap';
import { useHeatmap } from '../composables';
import { BaseErrorComponent } from '@/modules/widgets/base';

import ContextMenu from './context-menu.vue';
import SkeletonGroup from '@/shared/ui/skeleton/skeleton-group.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const {
	isError,
	isLoading,

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
	resetAllChanges,
	refetch,
} = useHeatmap(props.meta.widgetId);

</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<skeleton-group v-if="isLoading || props.meta.isLoading" />
			<base-error-component v-else-if="isError" @retry="refetch" />

			<div v-else :class="classes.heatmap">
				<treemap-component
					v-else
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
					:is-show-dots="false"
					:is-negative-color-market="false"
					is-no-group-stock
				/>
			</div>
		</template>
		<template #rcm>
			<context-menu
				v-model:market="marketSettings"
				v-model:size-by="sizeBySettings"
				v-model:color-by="colorBySettings"
				v-model:color-depth="colorDepthSettings"
				v-model:display-value="displayValueSettings"
				v-model:group-by="groupBySettings"
				v-model:is-show-logo="isShowLogo"
				v-model:title-variant="titleSetting"
				:title="props.meta.name"
				:active-market="activeMarket!"
				:active-color-by="activeColorBy!"
				:active-color-depth="activeColorDepth!"
				:active-size-by="activeSizeBy!"
				:active-display-value="activeDisplayValue!"
				:active-group-by="activeGroupBy!"
				@delete="emit('delete')"
				@reset="resetAllChanges"
			/>
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
