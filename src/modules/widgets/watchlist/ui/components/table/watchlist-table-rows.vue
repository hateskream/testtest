<script setup lang="ts">
import type { ITableRow } from '../../../model';
import { useResizeBackground } from '@/modules/widgets/base/common/composables/use-resize-background';
import { tickerIcon, forexTickerIcon } from '@/shared/ui/ticker';

import WatchlistCellNumber from './cells/watchlist-cell-number.vue';
import WatchlistCellPercent from './cells/watchlist-cell-percent.vue';
import WatchlistCellDate from './cells/watchlist-cell-date.vue';

interface IProps {
	rows: ITableRow[][];
}

const props = defineProps<IProps>();

const { backgroundStyle } = useResizeBackground();
</script>

<template>
	<tbody :class="classes.tbody">
		<tr
			v-for="(items, idx) in props.rows"
			:key="`${idx}-table-tr`"
		>
			<td
				v-for="(item, index) in items"
				:key="item.value + item.id"
				:style="index === 0 ? backgroundStyle : {}"
			>
				<div
					:class="classes.rowColumnWrapper"
				>
					<div
						v-if="['image-string', 'image'].includes(item.type)"
						:class="classes.tableIcon"
					>
						<ticker-icon
							v-if="item.market?.toLowerCase() !== 'forex' && !Array.isArray(item.srcValue)"
							:src="item.srcValue"
							:ticker="item.value"
							:size="32"
						/>

						<forex-ticker-icon
							v-if="item.market?.toLowerCase() === 'forex' && item.domain && Array.isArray(item.srcValue)"
							:src="item.srcValue"
							:ticker="item.value"
							:domain="item.domain"
							:size="40"
						/>

						<div :class="classes.tickerName">
							<span>{{ item.value }}</span>
							<span
								v-if="item.market?.toLowerCase() === 'forex'"
								:class="classes.domainName"
							>
								{{ item.domain }}
							</span>
						</div>
					</div>

					<watchlist-cell-number
						v-else-if="item.type === 'number'"
						is-fiat
						format="pretty-with-key"
						:value="item.value"
					/>

					<watchlist-cell-percent
						v-else-if="item.type === 'percent'"
						:value="item.value"
					/>

					<watchlist-cell-date
						v-else-if="item.type === 'date'"
						:value="item.value"
					/>
				</div>
			</td>

			<td :class="classes.fixTertiaryIcon" />
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

.tableIcon {
	display: flex;
	align-items: center;
	gap: 8px;
}

.tbody {
	display: block;
	width: max-content;
	min-width: 100%;
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

.fixTertiaryIcon {
	min-width: 50px !important;
	padding-right: 8px;
}

.tickerName {
	display: inline-flex;
	gap: 2px;
}

.domainName {
	color: var(--text-color-base-300, #9a9a9d);
}
</style>
