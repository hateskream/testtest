<script setup lang="ts">
import {
	ModalFilter,
	ModalFilterTabWrapper,
	ModalItemSwitch,
} from '@/modules/widgets/base/modal';
import { UiIcon, IconIds } from '@/shared/ui/icon';
import { DateRange, dateToLabel, DisplayVariant, Stock, stockToLabel } from '../../model';

const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });
const stock = defineModel<Stock>('stock', { required: true });
const date = defineModel<DateRange>('date', { required: true });
const isCompactMode = defineModel<boolean>('isCompactMode', { required: true });

function updateDisplayVariant(value: DisplayVariant) {
	displayVariant.value = value;
}

function updateStock(value: Stock) {
	stock.value = value;
}

function updateDate(value: DateRange) {
	date.value = value;
}
</script>

<template>
	<modal-filter>
		<template #title>
			Filter
		</template>

		<template #content>
			<div :class="classes.content">
				<!-- Stock Section -->
				<div :class="classes.row">
					<div :class="classes.rowTitle">Stock</div>
					<div :class="classes.tabs">
						<modal-filter-tab-wrapper
							:is-active="stock === Stock.Industry"
							@click="updateStock(Stock.Industry)"
						>
							{{ stockToLabel[Stock.Industry] }}
						</modal-filter-tab-wrapper>
						<modal-filter-tab-wrapper
							:is-active="stock === Stock.Sector"
							@click="updateStock(Stock.Sector)"
						>
							{{ stockToLabel[Stock.Sector] }}
						</modal-filter-tab-wrapper>
					</div>
				</div>

				<!-- Date Section -->
				<div :class="classes.row">
					<div :class="classes.rowTitle">Date</div>
					<div :class="classes.tabs">
						<modal-filter-tab-wrapper
							:is-active="date === DateRange.Today"
							@click="updateDate(DateRange.Today)"
						>
							{{ dateToLabel[ DateRange.Today] }}
						</modal-filter-tab-wrapper>
						<modal-filter-tab-wrapper
							:is-active="date === DateRange.Yesterday"
							@click="updateDate(DateRange.Yesterday)"
						>
							{{ dateToLabel[ DateRange.Yesterday] }}
						</modal-filter-tab-wrapper>
						<modal-filter-tab-wrapper
							:is-active="date === DateRange.Week"
							@click="updateDate(DateRange.Week)"
						>
							<div :class="classes.dateOption">
								{{ dateToLabel[ DateRange.Week] }}
								<ui-icon :id="IconIds.Calendar" :class="classes.calendarIcon" />
							</div>
						</modal-filter-tab-wrapper>
					</div>
				</div>

				<!-- Display Section -->
				<div :class="classes.row">
					<div :class="classes.rowTitle">Display</div>
					<div :class="classes.tabs">
						<modal-filter-tab-wrapper
							:is-active="displayVariant === DisplayVariant.Bar"
							@click="updateDisplayVariant(DisplayVariant.Bar)"
						>
							<div :class="classes.displayOption">
								<ui-icon :id="IconIds.Bars" :class="classes.displayIcon" />
								Bar
							</div>
						</modal-filter-tab-wrapper>
						<modal-filter-tab-wrapper
							:is-active="displayVariant === DisplayVariant.List"
							@click="updateDisplayVariant(DisplayVariant.List)"
						>
							<div :class="classes.displayOption">
								<ui-icon :id="IconIds.List" :class="classes.displayIcon" />
								List
							</div>
						</modal-filter-tab-wrapper>
					</div>
				</div>

				<!-- Settings Section -->
				<div :class="classes.row">
					<div :class="classes.rowTitle">Settings</div>
					<div :class="classes.settingsContent">
						<modal-item-switch
							v-model="isCompactMode"
						>
							Compact mode
						</modal-item-switch>
					</div>
				</div>
			</div>
		</template>
	</modal-filter>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 12px 0;
}

.row {
	display: flex;
	align-items: center;
	padding: 4px 12px;
}

.rowTitle {
	flex: 0 0 80px;
	font-weight: 500;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
}

.tabs {
	display: flex;
	flex: 1;
	align-items: center;
	gap: 8px;
}

.settingsContent {
	flex: 1;
}

.dateOption {
	display: flex;
	align-items: center;
	gap: 6px;
}

.displayOption {
	display: flex;
	align-items: center;
	gap: 6px;
}

.calendarIcon {
	width: 12px;
	height: 12px;
	color: var(--icon-color-base-500);
}

.displayIcon {
	width: 12px;
	height: 12px;
	color: var(--icon-color-base-500);
}
</style>
