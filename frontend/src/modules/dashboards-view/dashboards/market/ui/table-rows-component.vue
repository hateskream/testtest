<script setup lang="ts">
import { getCurrencyImage } from '@/shared/lib';
import type { ITableRow } from '../model';
import { UiImage } from '@/shared/ui/image';

import TableRowNumberComponent from './table-row-number-component.vue';
import TableRowPercentComponent from './table-row-percent-component.vue';
import TableRowDateComponent from './table-row-date-component.vue';

defineProps<{
	rows: ITableRow[][];
}>();
</script>

<template>
	<tbody :class="classes.tbody">
		<tr
			v-for="(items, idx) in rows"
			:key="`${idx}-table-row`"
		>
			<td
				v-for="item in items"
				:key="item.value"
			>
				<div
					v-if="item.type === 'image'"
					:class="classes.tableIcon"
				>
					<div :class="classes.imageWrapper">
						<ui-image :src="getCurrencyImage(item.value)" />
					</div>

					<div>{{ item.value }}</div>
				</div>

				<table-row-number-component
					v-else-if="item.type === 'number'"
					:is-fiat="true"
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
			</td>
			<td :class="classes.tertiaryFix" />
		</tr>
	</tbody>
</template>

<style module="classes">
.tertiaryFix {
	width: 20px;
}

.imageWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 4px;
	border: 1px solid var(--border-color-base-300);
	border-radius: 100px;
}

.tableChgNegative {
	color: var(--metrics-color-negative-500);
}

.tableChgPositive {
	color: rgb(178 242 211 / 100%);
}

.tableIcon {
	display: flex;
	align-items: center;
	gap: 8px;
}

.tbody {
	display: block;
	width: 100%;
	max-height: 450px;
	overflow-y: auto;
}

.tbody > tr {
	display: table;
	width: 100%;
	table-layout: fixed;
}

.tbody > tr > td:first-child {
	position: sticky;
	top: 0;
	left: 0;
}

.tbody > tr:hover {
	background-color: var(--border-color-surface-02-effect);
	border-radius: 16px;
}

.tbody td {
	height: 50px;
	padding: 8px 0;
	font-size: 13px;
	color: #ffffff;
}
</style>
