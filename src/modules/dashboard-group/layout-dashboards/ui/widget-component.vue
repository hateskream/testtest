<script setup lang="ts">
import { computed, defineAsyncComponent, ref, shallowRef, watch } from 'vue';

import { getWidgetComponent, type IMeta } from '../../dashboards/model';
import type { DisplayVariant, IWidget } from '../model';
import { MIN_ROW_HEIGHT, MAX_ROW_HEIGHT } from '../../tv';
import { calcSizeSideGridCell } from '../model/widget';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { useDelayedLoading } from '@/shared/composables';

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

const { loading, triggerLoading } = useDelayedLoading({ immediate: false });

const loaded = ref(false);
const component = shallowRef(null);

const refComponent = ref<IWidgetExposed | null>(null);

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

function scrollBy(px: number) {
	if (!refComponent.value) {
		return;
	}

	refComponent.value.scrollBy(px);
}

defineExpose({ scrollBy });
</script>

<template>
	<div
		:style="{
			height: height + 'px',
		}"
	>
		<suspense v-if="loaded">
			<template #default>
				<component
					:is="component"
					ref="refComponent"
					:meta="meta"
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
</template>
