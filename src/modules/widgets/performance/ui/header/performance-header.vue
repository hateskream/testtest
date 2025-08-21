<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { stockToLabel, DateRange, Stock, dateToLabel, DisplayVariant } from '../../model';

import PerformanceFilters from '../modals/performance-filters.vue';
import ViewToggle from './view-toggle.vue';

const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });
const stock = defineModel<Stock>('stock', { required: true });
const date = defineModel<DateRange>('date', { required: true });
const isCompactMode = defineModel<boolean>('isCompactMode', { required: true });

function updateStock(s: Stock) {
	stock.value = s;
}

function updateDate(v: DateRange) {
	date.value = v;
}
</script>

<template>
	<div :class="classes.performanceHeader">
		<div :class="classes.listFilters">
			<ui-position  :class="classes.iconAllFilter">
				<template #default>
					<ui-icon
						:id="IconIds.NewsFilter"
						width="20"
						height="20"
						:class="classes.icon"
					/>
				</template>

				<template #content>
					<performance-filters
						v-model:is-compact-mode="isCompactMode"
						v-model:display-variant="displayVariant"
						v-model:stock="stock"
						v-model:date="date"
					/>
				</template>
			</ui-position>

			<ui-delimiter />

			<modal-badge>
				<template #title>
					{{stock}}
					<!-- {{ stockToLabel[stock] }} -->
					<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>Stock</template>

						<template v-for="s in Stock" :key="s">
							<modal-item-selector
								:model-value="s === stock"
								@update:model-value="updateStock(s)"
							>
								{{ stockToLabel[s] }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge>
				<template #title>
					{{date}}
					<!-- {{ dateToLabel[date] }} -->
					<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>Date</template>

						<template v-for="r in DateRange" :key="r">
							<modal-item-selector
								:model-value="r === date"
								@update:model-value="updateDate(r)"
							>
								{{ dateToLabel[r] }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>
		</div>
		<view-toggle v-model:display-variant="displayVariant" />
	</div>
</template>

<style module="classes">
.performanceHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px 0 16px;
	border-bottom: 1px solid var(--border-color-base-100);
	gap: 6px;
}

.listFilters {
	display: flex;
	align-items: center;
	max-width: 100%;
	overflow-x: auto;
	gap: 6px;
}

.iconAllFilter {
	cursor: pointer;
}

.icon {
	color: var(--icon-color-base-300);
}
</style>
