<script setup lang="ts">
import type { ITableRow } from '../model';
import { UiImage } from '@/shared/ui/image';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useMarketStore } from '../stores';
import { UiTooltip } from '@/shared/ui/tooltip';

import TableRowNumberComponent from './table-row-number-component.vue';
import TableRowPercentComponent from './table-row-percent-component.vue';
import TableRowDateComponent from './table-row-date-component.vue';

interface IProps {
	rows: ITableRow[][];
}

const props = defineProps<IProps>();

const marketStore = useMarketStore();
</script>

<template>
	<tbody :class="classes.tbody">
		<tr
			v-for="(items, idx) in props.rows"
			:key="`${idx}-table-tr`"
		>
			<td
				v-for="item in items"
				:key="item.value + item.id"
			>
				<div :class="classes.rowColumnWrapper">
					<div
						v-if="['image-string', 'image'].includes(item.type)"
						:class="classes.tableIcon"
					>
						<div :class="classes.imageWrapper">
							<ui-image :src="item.srcValue" />
						</div>

						<div>{{ item.value }}</div>
					</div>

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
			</td>

			<td :class="classes.favoriteIconWrapper">
				<ui-tooltip :show-in-ms="100">
					<template #default>
						<div
							:class="classes.favoriteIcon"
							@click="marketStore.toggleFavoriteItem(items[items.length - 1].id)"
						>
							<ui-icon
								:id="IconIds.Favorite"
								width="20px"
								height="20px"
							/>
						</div>
					</template>

					<template #content> Add to favorites </template>
				</ui-tooltip>
			</td>
		</tr>
	</tbody>
</template>

<style module="classes">
.rowColumnWrapper {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 50px;
	padding: 8px 0;
	font-size: 13px;
	text-align: right;
	color: #ffffff;
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
	width: max-content;
	min-width: 100%;
	max-height: 450px;
}

.tbody > tr {
	display: table;
	width: max-content;
	min-width: 100%;
}

tbody tr:hover {
	background-color: var(--border-color-surface-02-effect);
	border-radius: 16px;
}

tbody tr:hover td:first-child .rowColumnWrapper {
	background-color: var(--border-color-surface-02-effect);
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

tbody tr td:first-child {
	position: sticky;
	top: 0;
	left: 0;
	background-color: var(--bg-color-surface-01);
}

tbody tr td:first-child .rowColumnWrapper {
	position: relative;
	justify-content: flex-start;
}

tbody tr td:first-child .rowColumnWrapper::after {
	content: '';
	position: absolute;
	right: 0;
	width: 100%;
	height: 100%;
}

.tbody td {
	min-width: 100px;
}

.favoriteIconWrapper {
	min-width: 50px !important;
	padding-right: 8px;
}

.favoriteIcon {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	color: var(--icon-color-base-300);
	cursor: pointer;
	transition: color 0.3s ease;
}

.favoriteIcon:hover {
	color: var(--icon-color-base-300-effect);
}
</style>
