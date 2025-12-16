<script setup lang="ts">
import { computed, defineAsyncComponent, ref, shallowRef, useTemplateRef, watch } from 'vue';

import { getWidgetComponent, type IMeta } from '../../dashboards/model';
import type { DisplayVariant, IWidget } from '../model';
import { MIN_ROW_HEIGHT, MAX_ROW_HEIGHT } from '../../tv';
import { calcSizeSideGridCell } from '../model/widget';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { useDelayedLoading } from '@/shared/composables';
import { useResizable } from '../composables';

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
	isVisible: boolean;
}

const props = defineProps<IWidgetComponentProps>();

const emits = defineEmits<{
	'set-widget-state-type': [string, string];
	'change-height': [string, number];
	'change-max-count-row': [string, number];
}>();

const titleWidgetHeight = props.widget.hasFilters ? 76 : 40;

const { size } = useResizable(
	useTemplateRef('sizer'),
	useTemplateRef('widget'),
	{
		minHeight: titleWidgetHeight + (props.widget.snapStep || 0),
		axis: 'vertical',
		cbOnPointerUp: () => snapToNearestStep(size.value),
	},
);

const { loading, triggerLoading } = useDelayedLoading({ immediate: false });

const loaded = ref(false);
const component = shallowRef(null);

const refComponent = ref<IWidgetExposed | null>(null);

const isFiniteWidget = computed(() => Number.isFinite(props.widget.height));

const heightWidget = computed(() =>
	isFiniteWidget.value
		? props.widget.height
		: props.parentHeight,
);

const cellSize = computed(() => calcSizeSideGridCell(heightWidget.value, MIN_ROW_HEIGHT, MAX_ROW_HEIGHT));

const meta = computed((): IMeta => ({
	market: '',
	widgetId: props.widget.id,
	isResizing: false,
	size: {
		h: cellSize.value.count,
		w: props.colCount,
	},
	maxSize: {
		h: cellSize.value.count,
		w: props.colCount,
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

watch(
	() => props.isVisible,
	async visible => {
		if (visible && !loaded.value) {
			component.value = await defineAsyncComponent({
				loader: getWidgetComponent('dashboard', props.widget.widgetType),
			});
			loaded.value = true;

			triggerLoading();
		}
	},
	{ immediate: true },
);

watch(
	size,
	newHeight => {
		const { widget: { maxCountRow } } = props;

		emits('change-height', props.widget.id, newHeight);
		if (maxCountRow) {
			emits('change-max-count-row', props.widget.id, calcMaxCountRowVisible(newHeight));
		}
	},
);

function scrollBy(px: number) {
	if (!refComponent.value) {
		return;
	}

	refComponent.value.scrollBy(px);
}

function setWidgetStateType(widgetId: string, stateType: string) {
	emits('set-widget-state-type', widgetId, stateType);
}

function calcMaxCountRowVisible(widgetHeight: number) {
	const { widget: { snapStep = 1 } } = props;

	return Math.floor((widgetHeight - titleWidgetHeight) / snapStep);
}

function snapToNearestStep(height: number) {
	const { widget: { snapStep } } = props;
	if (!snapStep) {
		return;
	}

	const newHeightContent = height - titleWidgetHeight;

	const remainder = newHeightContent % snapStep;

	let snappedHeightContent;

	if (remainder >= snapStep / 2) {
		snappedHeightContent = Math.ceil(newHeightContent / snapStep) * snapStep;
	} else {
		snappedHeightContent = Math.floor(newHeightContent / snapStep) * snapStep;
	}

	const snappedHeight = snappedHeightContent + titleWidgetHeight;

	emits('change-height', props.widget.id, snappedHeight);
	emits('change-max-count-row', props.widget.id, calcMaxCountRowVisible(snappedHeight));
}

defineExpose({ scrollBy });
</script>

<template>
	<div
		:class="classes.root"
	>
		<div
			ref="widget"
			:class="classes.widget"
			:style="{
				height: heightWidget + 'px',
			}"
		>
			<suspense v-if="loaded">
				<template #default>
					<component
						:is="component"
						ref="refComponent"
						:meta="meta"
						@set-widget-state-type="setWidgetStateType"
					/>
				</template>
				<template #fallback>
					<ui-skeleton
						border-radius="12px"
						width="100%"
						height="100%"
					/>
				</template>
			</suspense>

			<ui-skeleton
				v-else
				border-radius="12px"
				width="100%"
				height="100%"
			/>
		</div>
		<div
			v-if="isFiniteWidget"
			ref="sizer"
			:class="classes.sizer"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.widget {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.sizer {
	width: 32px;
	height: 4px;
	margin: 1px auto;
	background: #d9d9d9;
	border-radius: 4px;
	cursor: grab;
	opacity: 0.3;
}
</style>
