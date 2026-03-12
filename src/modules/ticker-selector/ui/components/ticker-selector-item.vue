<script setup lang="ts">
import { computed } from 'vue';

import { UniversalTickerIcon } from '@/shared/ui/ticker';
import type { ITickerItem } from '../../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { MarketType } from '@/modules/market';
import { UiClamped } from '@/shared/ui/clamped';

interface ITickerSelectorItemProps {
	ticker: ITickerItem;
	selectionMode: 'single' | 'multiple';
	active?: boolean;
	shortcutNumber?: number;
}

const props = defineProps<ITickerSelectorItemProps>();

const symbol = computed(() => {
	if (props.ticker.market_type === MarketType.Forex) {
		return props.ticker.name;
	}

	return props.ticker.symbol;
});
</script>

<template>
	<button :class="classes.tickerItem">
		<universal-ticker-icon
			:symbol-type="props.ticker.market_type"
			:src="props.ticker.logo"
			:right-src="props.ticker.currency_icon"
			:size="20"
			:ticker="props.ticker.symbol"
			:right-ticker="props.ticker.currency"
			:class="classes.leftIcon"
		/>

		<span :class="classes.textZone" class="text-300-r">
			<ui-clamped
				as="span"
				:rows="1"
				:class="classes.symbol"
			>
				{{ symbol }}
			</ui-clamped>

			<template v-if="props.ticker.name && props.ticker.market_type !== MarketType.Forex">
				<span :class="classes.dot">
					·
				</span>

				<span :class="classes.label">
					{{ props.ticker.name }}
				</span>
			</template>
		</span>

		<span :class="[classes.rightZone, { [classes.active]: props.active }]">
			<span
				v-if="props.shortcutNumber"
				:class="classes.shortcut"
				class="text-200-r"
			>
				{{ props.shortcutNumber }}
			</span>

			<span :class="classes.rightIcon">
				<ui-icon
					v-if="props.selectionMode === 'multiple'"
					:id="IconIds.Checkbox"
					width="12px"
					height="12px"
				/>

				<span v-else :class="classes.radio" />
			</span>
		</span>
	</button>
</template>

<style module="classes">
.tickerItem {
	display: flex;
	align-items: center;
	width: 100%;
	min-height: 32px;
	padding: 0 12px;
	border-radius: var(--radius-radius-s14-32, 12.4px);
	cursor: pointer;
	gap: 6px;
}

.tickerItem:hover {
	background: var(--atom-base-50, rgb(73 73 80 / 52%));
}

.rightZone {
	position: relative;
	display: grid;
	flex-shrink: 0;
	place-items: center;
	width: 20px;
	height: 20px;
}

.rightIcon,
.shortcut {
	grid-area: 1 / 1;
}

.rightIcon {
	color: var(--atom-contrast-50, rgb(255 255 255 / 50%));
	opacity: 0;
}

.rightZone.active .rightIcon,
.tickerItem:hover .rightIcon {
	opacity: 1;
}

.rightZone.active .rightIcon {
	color: var(--icon-500, #ffffff);
}

.shortcut {
	color: var(--text-100, rgb(255 255 255 / 30%));
}

.tickerItem:hover .shortcut,
.rightZone.active .shortcut {
	opacity: 0;
}

.radio {
	display: block;
	flex-shrink: 0;
	width: 20px;
	height: 20px;
	color: var(--icon-color-base-500);
	border-width: 1px;
	border-style: solid;
	border-color: var(--atom-contrast-50, rgb(255 255 255 / 50%));
	border-radius: 100px;
	opacity: 0.4;
}

.rightZone.active .radio {
	box-sizing: border-box;
	border-width: 6px !important;
	border-color: rgb(245 245 245 / 90%);
	opacity: 1;
}

.textZone {
	display: flex;
	flex: 1 1 auto;
	flex-wrap: nowrap;
	align-content: center;
	align-items: center;
	min-width: 0;
	height: 100%;
	overflow: hidden;
	gap: 6px var(--control-md-padding-icon-left-right, 6px);
}

.symbol {
	flex-shrink: 0;
	max-width: 60%;
	color: var(--text-500, rgb(255 255 255 / 96%));
	white-space: nowrap;
}

.dot {
	flex-shrink: 0;
	color: var(--text-300, rgb(255 255 255 / 62%));
	white-space: nowrap;
}

.label {
	flex: 1 1 auto;
	min-width: 0;
	overflow: hidden;
	text-align: left;
	color: var(--text-300, rgb(255 255 255 / 62%));
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
