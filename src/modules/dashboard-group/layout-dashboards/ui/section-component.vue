<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';

import type { ISection } from '../model';
import { calcSizeSideGridCell } from '../model/widget';
import { MIN_COL_WIDTH, MAX_COL_WIDTH } from '../../tv';

import WidgetComponent from './widget-component.vue';

const WIDGET_GAP = 6;
const WIDGET_GAP_PX = `${WIDGET_GAP}px`;

const HEIGHT_TITLE = 50;

const HEIGHT_ROUNDING_BOTTOM = 25;

interface ISectionComponentProps {
	section: ISection;
	parentHeight: number;
}

const props = defineProps<ISectionComponentProps>();

const widgetRefs = ref<InstanceType<typeof WidgetComponent>[]>([]);

const scrollRef = useTemplateRef('scroll');

const lastWidget = computed(() => widgetRefs.value[widgetRefs.value.length - 1]);

const cardStyle = computed(() => ({ width: `${props.section.width}px`, maxWidth: `${props.section.width}px` }));

const cellSize = computed(() => calcSizeSideGridCell(props.section.width, MIN_COL_WIDTH, MAX_COL_WIDTH));

const isOneInSection = computed(() => props.section.widgets.length === 1);
const heightWithoutLastWidget = computed(() =>
	props.section.widgets
		.slice(0, -1)
		.reduce((acc, num) => acc + num.height + WIDGET_GAP, HEIGHT_TITLE),
);

const isLastWidgetHasInfinityHeight = computed(() =>
	props.section.widgets[props.section.widgets.length - 1].height === Infinity,
);

const hasPaddingBottom = computed(() => !isOneInSection.value && !isLastWidgetHasInfinityHeight.value );

const height = computed(() =>
	isLastWidgetHasInfinityHeight.value
		? props.parentHeight + HEIGHT_ROUNDING_BOTTOM
		: props.parentHeight,
);

function onWheel(event: WheelEvent) {
	if (!scrollRef.value) {
		return;
	}

	const { target, deltaY } = event;
	if (target === null || target instanceof HTMLElement === false) {
		return;
	}

	if (isOneInSection.value) {
		event.preventDefault();

		lastWidget.value?.scrollBy(deltaY);
		return;
	}

	if (scrollRef.value.scrollTop < heightWithoutLastWidget.value) {
		event.preventDefault();

		scrollRef.value.scrollTop += deltaY;
		return;
	}
}
</script>

<template>
	<section
		:class="classes.section"
		:style="cardStyle"
	>
		<div
			:class="classes.scroll"
		>
			<div
				ref="scroll"
				:class="classes.widgetsContainer"
				:style="{
					'padding-bottom': hasPaddingBottom ? '25px' : 0
				}"
				@wheel.capture="onWheel"
			>
				<h2 :class="classes.sectionTitle">{{ props.section.name }}</h2>

				<div :class="classes.widgets">
					<widget-component
						v-for="widget in props.section.widgets"
						ref="widgetRefs"
						:key="widget.id"
						:widget="widget"
						:col-count="cellSize.count"
						:column-width="cellSize.size"
						:parent-height="height"
						:active-display-variant="widget.displayVariant"
						:all-display-variants="widget.displayVariants"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<style module="classes">
.section {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	overflow: auto;
	color: #ffffff;
}

.sectionTitle {
	padding: 12px 0;
	font-style: normal;
	font-weight: 440;
	font-size: 16.8px;
	line-height: 160%; /* 26.88px */
	color: #ffffff;
	letter-spacing: 0.134px;
}

.scroll {
	position: relative;
	flex-grow: 1;
	overflow: hidden;
}

.widgetsContainer {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow-y: auto;
	scrollbar-width: none;
	overscroll-behavior: contain;
}

.widgets {
	display: flex;
	flex-direction: column;
	border-radius: 24px;
	gap: v-bind(WIDGET_GAP_PX);
	/* stylelint-disable-next-line color-named */
	mask-image:
		radial-gradient(circle 24px at top left, transparent 0, black 0),
		radial-gradient(circle 24px at top right, transparent 0, black 0),
		linear-gradient(black, black);
	mask-composite: intersect;
}

@media (max-width: 768px) {
	.section {
		padding: 12px 12px 0;
	}
}
</style>
