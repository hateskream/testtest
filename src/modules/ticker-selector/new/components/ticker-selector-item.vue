<script setup lang="ts">
import { computed } from 'vue';

import { UniversalTickerIcon } from '@/shared/ui/ticker';
import type { ITickerItem } from '../../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { MarketType } from '@/modules/market';

const props = defineProps<{
	ticker: ITickerItem;
	selectionMode: 'single' | 'multiple';
	active?: boolean;
}>();

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

		<span
			:class="classes.textZone"
			class="text-300-r"
		>
			<span :class="classes.symbol">
				{{symbol}}
			</span>

			<template v-if="props.ticker.name && props.ticker.market_type !== MarketType.Forex">
				<span :class="classes.dot">
					·
				</span>

				<span :class="classes.label">
					{{props.ticker.name}}
				</span>
			</template>
		</span>

		<span :class="[classes.rightIcon, { [classes.active]: props.active }]">
			<ui-icon
				v-if="props.selectionMode === 'multiple'"
				:id="IconIds.Checkbox"
				width="12px"
				height="12px"
			/>

			<span v-else :class="classes.radio" />
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
}

.tickerItem:hover {
	background: var(--atom-base-50, rgb(73 73 80 / 52%));
}

.leftIcon {
	margin-right: 6px;
}

.rightIcon {
	color: var(--atom-contrast-50, rgb(255 255 255 / 50%));
	opacity: 0;
}

.rightIcon.active,
.tickerItem:hover .rightIcon {
	opacity: 1;
}

.rightIcon.active {
	color: var(--icon-500, #ffffff);
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

.rightIcon.active .radio {
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
