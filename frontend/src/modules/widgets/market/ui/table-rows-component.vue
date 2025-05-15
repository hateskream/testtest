<script setup lang="ts">
import type { ITableRow } from '../model';

import TableRowNumberComponent from './table-row-number-component.vue';
import TableRowPercentComponent from './table-row-percent-component.vue';
import TableRowDateComponent from './table-row-date-component.vue';
import TableRowImageComponent from './table-row-image-component.vue';

interface IProps {
	rows: ITableRow[][];
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.gridBody">
		<div
			v-for="(items, idx) in props.rows"
			:key="`${idx}-body-wrapper-items`"
			:class="classes.gridBodyWrapperItems"
		>
			<div
				v-for="item in items"
				:key="item.value + item.id"
				:class="classes.gridBodyItem"
			>
				<table-row-image-component
					v-if="['image-string', 'image'].includes(item.type)"
					:value="item.value"
					:src="item.srcValue"
					:class="classes.tableIcon"
				/>

				<table-row-number-component
					v-else-if="item.type === 'number'"
					is-fiat
					format="pretty-with-key"
					:value="item.value"
				/>

				<table-row-percent-component
					v-else-if="item.type === 'percent'"
					:value="item.value"
				/>

				<table-row-date-component
					v-else-if="item.type === 'date'"
					:value="item.value"
				/>
			</div>

			<!-- Icon with settings -->
			<div />
		</div>
	</div>
</template>

<style module="classes">
.gridBody,
.gridBodyWrapperItems {
	position: relative;
	z-index: 1;
	display: grid;
	grid-column: 1 / -1;
	grid-template-columns: subgrid;
}

.gridBodyItem {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 50px;
	font-size: 13px;
	color: #ffffff;
}

.gridBodyItem:first-child {
	position: sticky;
	left: 0;
	justify-content: flex-start;
	background-color: var(--bg-color-surface-01);
}

.gridBodyItem:first-child::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: transparent;
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

.gridBodyWrapperItems:hover {
	background-color: var(--border-color-surface-02-effect);
	border-radius: 16px;
}

.gridBodyWrapperItems:hover .gridBodyItem:first-child::after {
	background-color: var(--border-color-surface-02-effect);
}
</style>
