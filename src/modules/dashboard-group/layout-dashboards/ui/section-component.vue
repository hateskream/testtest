<script setup lang="ts">
import { computed } from 'vue';

import type { ISection } from '../model';
import { calcSizeSideGridCell } from '../model/widget';
import { MIN_COL_WIDTH, MAX_COL_WIDTH } from '../../tv';

import WidgetComponent from './widget-component.vue';

interface ISectionComponentProps {
	section: ISection;
	parentHeight: number;
}

const props = defineProps<ISectionComponentProps>();

const cardStyle = computed(() => ({ width: `${props.section.width}px`, maxWidth: `${props.section.width}px` }));

const cellSize = computed(() => calcSizeSideGridCell(props.section.width, MIN_COL_WIDTH, MAX_COL_WIDTH));
</script>

<template>
	<section
		:class="classes.section"
		:style="cardStyle"
	>
		<div :class="classes.scroll">
			<div :class="classes.widgetsContainer">

				<h2 :class="classes.sectionTitle">{{ props.section.name }} </h2>

				<div :class="classes.widgets">
					<widget-component
						v-for="widget in props.section.widgets"
						:key="widget.id"
						:widget="widget"
						:col-count="cellSize.count"
						:column-width="cellSize.size"
						:parent-height="props.parentHeight"
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
	padding-bottom: 25px;
	overflow-y: auto;
	scrollbar-width: none;
}

.widgets {
	display: flex;
	flex-direction: column;
	gap: 6px;
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
