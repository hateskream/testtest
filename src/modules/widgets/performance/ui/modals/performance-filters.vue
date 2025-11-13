<script setup lang="ts">
import { computed } from 'vue';

import {
	BaseSwitch,
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base/';
import { UiIcon, IconIds } from '@/shared/ui/icon';
import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	Currency,
	type DateRange,
	DateRangeStock,
	DateRangeForex,
	DisplayVariant,
	isDataRangeStock,
	Stock,
	dateToLabel,
} from '../../model';
import { MarketType } from '@/modules/market';

const stock = defineModel<Stock>('stock');
const date = defineModel<DateRange>('date', { required: true });
const quoteCurrency = defineModel<Currency>('quoteCurrency');

const activeMarket = defineModel<MarketType>('activeMarket', { required: true });
const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });

interface IFiltersPanelProps {
	displaySource?: 'default' | 'new';
}

const props = defineProps<IFiltersPanelProps>();

const isStock = computed((): boolean => isDataRangeStock(date.value));
</script>

<template>

	<div :class="classes.content">
		<div :class="classes.label">Market</div>
		<div :class="classes.switchGroup">
			<button
				:class="[
					classes.switch,
					activeMarket === MarketType.Stock && classes.active
				]"
				@click="activeMarket = MarketType.Stock"
			>
				Stock
			</button>
			<button
				:class="[
					classes.switch,
					activeMarket === MarketType.Forex && classes.active
				]"
				@click="activeMarket = MarketType.Forex"
			>
				Forex
			</button>
		</div>

		<ui-delimiter v-if="props.displaySource === 'default'" />

		<div :class="classes.label">Filter</div>

		<template v-if="isStock">
			<div :class="classes.subBlock">
				<div :class="classes.subLabel">Category</div>
				<div :class="classes.switchGroup">
					<button
						:class="[
							classes.switch,
							stock === Stock.Industry && classes.active
						]"
						@click="stock = Stock.Industry"
					>
						Industry
					</button>
					<button
						:class="[
							classes.switch,
							stock === Stock.Sector && classes.active
						]"
						@click="stock = Stock.Sector"
					>
						Sector
					</button>
				</div>
			</div>

			<ui-delimiter v-if="props.displaySource === 'default'" />

			<div :class="classes.subBlock">
				<div :class="classes.subLabel">Period</div>
				<div :class="classes.switchGroup">
					<button
						:class="[
							classes.switch,
							date === DateRangeStock.Today && classes.active
						]"
						@click="date = DateRangeStock.Today"
					>
						Today
					</button>
					<button
						:class="[
							classes.switch,
							date === DateRangeStock.Yesterday && classes.active
						]"
						@click="date = DateRangeStock.Yesterday"
					>
						Yesterday
					</button>
					<button
						:class="[
							classes.switch,
							date === DateRangeStock.Week && classes.active
						]"
						@click="date = DateRangeStock.Week"
					>
						A week ago
					</button>
				</div>
			</div>
		</template>
		<template v-else>
			<ui-delimiter v-if="props.displaySource === 'default'" />

			<modal-badge :display-variant="props.displaySource">
				<template #title>
					<div :class="classes.forexGroup">
						<div :class="classes.right">
							<div :class="classes.subLabel">Quote currency</div>
							<div :class="classes.secondaryColor">·</div>
							<div :class="classes.secondaryColor">{{ quoteCurrency }}</div>
						</div>
						<ui-icon
							:id="IconIds.RcmArrowRight"
							:class="classes.secondaryColor"
							width="6"
							height="20"
						/>
					</div>
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>Quote currency</template>
						<template v-for="c in Currency" :key="c">
							<modal-item-selector
								:model-value="c === quoteCurrency"
								@update:model-value="quoteCurrency = c"
							>
								{{ c }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<ui-delimiter v-if="props.displaySource === 'default'" />

			<modal-badge :display-variant="props.displaySource">
				<template #title>
					<div :class="classes.forexGroup">
						<div :class="classes.right">
							<div :class="classes.subLabel">Period</div>
							<div :class="classes.secondaryColor">·</div>
							<div :class="classes.secondaryColor">{{ dateToLabel[date] }}</div>
						</div>
						<ui-icon
							:id="IconIds.RcmArrowRight"
							:class="classes.secondaryColor"
							width="6"
							height="20"
						/>
					</div>
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>Date</template>

						<template v-for="r in DateRangeForex" :key="r">
							<modal-item-selector
								:model-value="r === date"
								@update:model-value="date = r"
							>
								{{ dateToLabel[r] }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>
		</template>

		<template v-if="props.displaySource === 'new'">
			<div :class="classes.subBlock">
				<div :class="classes.subLabel">Display</div>
				<div :class="classes.switchGroup">
					<button
						:class="[
							classes.switch,
							displayVariant === DisplayVariant.Bar && classes.active
						]"
						@click="displayVariant = DisplayVariant.Bar"
					>
						<ui-icon
							:id="IconIds.Bars"
							width="16"
							height="16"
						/>
						Bar
					</button>
					<button
						:class="[
							classes.switch,
							displayVariant === DisplayVariant.List && classes.active
						]"
						@click="displayVariant = DisplayVariant.List"
					>
						<ui-icon
							:id="IconIds.List"
							width="16"
							height="16"
						/>
						List
					</button>
				</div>
			</div>
		</template>

		<ui-delimiter v-if="props.displaySource === 'default'" />

		<div :class="[classes.label, classes.settings]">Settings</div>

	</div>
</template>

<style module="classes">
.forexGroup {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}

.right {
	display: flex;
	align-items: center;
	font-style: normal;
	font-weight: 300;
	font-size: var(--typography-menu-menu-item, 12px);
	line-height: 18px;
	color: var(--color-text-base-300, #9a9a9d);
	gap: 6px;
}

.secondaryColor {
	color: #646568;
}

.content {
	display: flex;
	flex-direction: column;
	padding: 6px 16px;
}

.label {
	padding: 10px 0;
	font-style: normal;
	font-weight: 300;
	font-size: var(--typography-menu-menu-title, 13px);
	line-height: 22px;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.052px;
}

.subBlock {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 6px;
}

.subLabel {
	padding: 10px 0;
	overflow: hidden;
	font-style: normal;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01, 12px);
	line-height: 20px;
	color: var(--color-text-base-500, #ffffff);
	letter-spacing: 0.096px;
	text-overflow: ellipsis;
}

.switchGroup {
	display: flex;
	min-width: 284px;
	padding: 2px;
	background: #1c1c1c;
	border-radius: 9999px;
	gap: 3px;
}

.switch {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
	padding: 6px 0;
	font-size: 14px;
	color: #777777;
	background: transparent;
	border: none;
	border-radius: 9999px;
	cursor: pointer;
	transition: all 0.2s ease;
	gap: 2px;
}

.active {
	color: #ffffff;
	background: #2a2a2a;
}

.switch:hover:not(.active) {
	color: #cccccc;
	background: #1f1f1f;
}

.toggleRow {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 13px;
	color: #aaaaaa;
}

.toggle {
	position: relative;
	display: inline-block;
	width: 36px;
	height: 18px;
}

.toggle input {
	width: 0;
	height: 0;
	opacity: 0;
}

.slider {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: #2a2a2a;
	border-radius: 34px;
	cursor: pointer;
	transition: 0.3s;
}

.slider::before {
	content: '';
	position: absolute;
	bottom: 2px;
	left: 2px;
	width: 14px;
	height: 14px;
	background-color: #777777;
	border-radius: 50%;
	transition: 0.3s;
}

.toggle input:checked + .slider {
	background-color: #007aff;
}

.toggle input:checked + .slider::before {
	background-color: #ffffff;
	transform: translateX(18px);
}

.settings {
	margin-top: 24px;
}
</style>
