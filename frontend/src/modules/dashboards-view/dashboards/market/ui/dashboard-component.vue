<script setup lang="ts">
import { useQueryMarket } from '../queries';
import { UiImage } from '@/shared/ui/image';

import BaseDashboardComponent from '../../base/ui/base-dashboard-component.vue';
import NumberComponent from './number-component.vue';

const { data } = useQueryMarket();

function positiveOrNegativeStyles(val: string) {
	if (+val === 0) {
		return {};
	}

	if (+val > 0) {
		return {
			color: 'rgb(178 242 211 / 100%)',
		};
	}

	return {
		color: 'rgb(255 175 106 / 100%)',
	};
}
</script>

<template>
	<base-dashboard-component>
		<template #title> Market </template>

		<table :class="classes.table">
			<thead :class="classes.thead">
				<tr>
					<th>Symbol</th>
					<th>Price</th>
					<th>Chg 24h%</th>
					<th>Volume 24h</th>
					<th>Market cap</th>
				</tr>
			</thead>

			<tbody :class="classes.tbody">
				<tr
					v-for="item in data?.list ?? []"
					:key="item.symbol"
				>
					<td>
						<div :class="classes.tableIcon">
							<div :class="classes.imageWrapper">
								<ui-image :src="`/images/market/${item.symbol}.png`" />
							</div>

							<div>{{ item.symbol }}</div>
						</div>
					</td>

					<td>
						<number-component
							:is-fiat="true"
							format="pretty-with-key"
							:value="item.price"
						/>
					</td>

					<td>
						<div :style="positiveOrNegativeStyles(item.chg24h)">{{ item.chg24h }}%</div>
					</td>

					<td>
						<number-component
							:is-fiat="true"
							format="pretty-with-key"
							:value="item.volume24h"
						/>
					</td>

					<td>
						<number-component
							:is-fiat="true"
							format="pretty-with-key"
							:value="item.marketCap"
						/>
					</td>
				</tr>
			</tbody>
		</table>
	</base-dashboard-component>
</template>

<style module="classes">
.imageWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 4px;
	border: 1px solid var(--border-color-base-300);
	border-radius: 100px;
}

.tableChgNegative {
	color: rgb(255 175 106 / 100%);
}

.tableChgPositive {
	color: rgb(178 242 211 / 100%);
}

.tableIcon {
	display: flex;
	align-items: center;
	gap: 8px;
}

.table {
	width: 100%;
}

.thead {
	display: table;
	width: 100%;
	table-layout: fixed;
}

.thead th {
	padding: 4px 0;
	font-weight: 440;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-100);
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
	padding: 8px;
	table-layout: fixed;
}

.tbody > tr:hover {
	background-color: var(--border-color-surface-02-effect);
	border-radius: 16px;
}

.tbody td {
	font-size: 13px;
	color: #ffffff;
}
</style>
