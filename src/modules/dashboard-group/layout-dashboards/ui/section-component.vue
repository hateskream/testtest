<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import type { ISection } from '../model';
import { calcSizeSideGridCell } from '../model/widget';
import { MIN_COL_WIDTH, MAX_COL_WIDTH } from '../../tv';

import WidgetComponent from './widget-component.vue';

interface ISectionComponentProps {
	section: ISection;
}

const props = defineProps<ISectionComponentProps>();

const containerRef = useTemplateRef<HTMLDivElement>('container');

const cardStyle = computed(() => ({ width: `${props.section.width}px` }));

const cellSize = computed(() => calcSizeSideGridCell(props.section.width, MIN_COL_WIDTH, MAX_COL_WIDTH));
</script>

<template>
	<section :class="classes.section" :style="cardStyle">
		<h2 :class="classes.sectionTitle">{{ props.section.name }} </h2>

		<div ref="container" :class="classes.scroll">
			<div :class="classes.widgetsContainer">
				<widget-component
					v-for="widget in props.section.widgets"
					:key="widget.id"
					:widget="widget"
					:col-count="cellSize.count"
					:column-width="cellSize.size"
					:parent-height="containerRef?.offsetHeight || 0"
				/>
			</div>
		</div>
	</section>
</template>

<style module="classes">
.section {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding: 12px 16px;
	overflow: auto;
	color: #ffffff;
	border-right: 1px solid #1d1d1e;
}

.sectionTitle {
	margin-bottom: 12px;
	font-style: normal;
	font-weight: 410;
	font-size: 15.5px;
	line-height: 26px;
	letter-spacing: 0.124px;
}

.scroll {
	position: relative;
	flex-grow: 1;
	margin-top: 8px;
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
}

.widgetsContainer > *:not(:last-child) {
	margin-bottom: 16px;
}

@media (max-width: 768px) {
	.section {
		padding: 12px 12px 0;
	}
}
</style>
