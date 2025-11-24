<script setup lang="ts">
import { computed, ref } from 'vue';

import { getWidgetComponent, type IMeta } from '../../dashboards';
import type { DisplayVariant, IWidget } from '../model';
import { useDelayedLoading } from '@/shared/composables';
import { MIN_ROW_HEIGHT, MAX_ROW_HEIGHT } from '../../tv';
import { calcSizeSideGridCell } from '../model/widget';

interface IWidgetExposed {
	scrollBy: (px: number) => void;
}

interface IWidgetComponentProps {
	widget: IWidget;
	columnWidth: number;
	colCount: number;
	parentHeight: number;
	activeDisplayVariant: DisplayVariant;
	allDisplayVariants: DisplayVariant[];
}

const props = defineProps<IWidgetComponentProps>();

const refComponent = ref<IWidgetExposed | null>(null);

const { loading } = useDelayedLoading();

const height = computed(() =>
	Number.isFinite(props.widget.height)
		? props.widget.height
		: props.parentHeight,
);

const cellSize = computed(() => calcSizeSideGridCell(height.value, MIN_ROW_HEIGHT, MAX_ROW_HEIGHT));

const meta = computed((): IMeta => ({
	market: '',
	widgetId: props.widget.id,
	isResizing: false,
	size: {
		h: cellSize.value.count,
		w: props.colCount,
	},
	maxSize: {
		h: 0,
		w: 0,
	},
	name: props.widget.name,
	defaultStateType: props.widget.defaultStateType,
	isLoading: loading.value,
	dashboards: [],
	widgetType: props.widget.widgetType,
	isOpenFull: false,
	columnWidth: props.columnWidth,
	rowHeight: cellSize.value.size,
	maxCountRowTable: props.widget.maxCountRow,
	activeDisplayVariant:  props.activeDisplayVariant,
	allDisplayVariants: props.allDisplayVariants,
}));

function scrollBy(px: number) {
	if (!refComponent.value) {
		return;
	}

	refComponent.value.scrollBy(px);
}

defineExpose({ scrollBy });
</script>

<template>
	<component
		:is="getWidgetComponent('dashboard',props.widget.widgetType)"
		ref="refComponent"
		:meta="meta"
		:style="{
			height: `${height}px`
		}"
	/>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: rgb(20 20 21 / 92%);
	border: 1px solid  #1d1d1e;
	border-radius: 18px;
}

.header {
	padding: 8px 8px 6px 10px;
}

.content {
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	padding: 4px 16px 16px;
}
</style>
