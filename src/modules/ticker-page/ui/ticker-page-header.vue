<script setup lang="ts">
import { type IDataProvider, type IExchange, type IPriceData, type ITickerItemExtended } from '../api';
import { TickerIcon } from '@/shared/ui/ticker';
import { UiText } from '@/shared/ui/text';
import { UiPositionTooltip } from '@/shared/ui/position';
import { UiImage } from '@/shared/ui/image';
import { UiTooltipWrapper } from '@/shared/ui/tooltip';
import { IconIds } from '@/shared/ui/icon';
import { MarketType } from '@/modules/market';
import { UiTag } from '@/shared/ui/tag';
import fmp from '@/assets/images/fmp.png';
import { UiClamped } from '@/shared/ui/clamped';
import { isFeatureEnabled } from '@/shared/lib';
import { UiControlIcon } from '@/shared/ui/control-icon';

import TickerHeaderPrice from './components/header/ticker-header-price.vue';
import TickerHeaderLayout from './components/header/ticker-header-layout.vue';

const props = defineProps<{
	ticker: ITickerItemExtended;
	exchange?: IExchange;
	dataProvider: IDataProvider;
	price: IPriceData;
	dominantColor: string;
}>();

const emits = defineEmits<{
	onTickerSelect: [ITickerItemExtended];
}>();

const isMoreOptionsEnabled = isFeatureEnabled('TICKER_PAGE_HEADER_MORE_OPTIONS_ENABLED');

function handleTickerSelect(canonicalId: string) {
	emits('onTickerSelect', { ...props.ticker, canonical_ticker_id: canonicalId });
}
</script>

<template>
	<ticker-header-layout
		:ticker="ticker"
		:dominant-color="dominantColor"
		@on-ticker-select="handleTickerSelect"
	>
		<template #logo>
			<ticker-icon
				:size="56"
				:ticker="ticker.symbol"
				:src="ticker.logo"
				disable-glow
			/>
			<ticker-icon
				v-if="ticker.currency && ticker.market_type === MarketType.Forex"
				:class="classes.secondLogo"
				:size="56"
				:ticker="ticker.currency"
				:src="ticker.currency_icon"
				disable-glow
			/>
		</template>

		<template #ticker-name>
			{{ ticker.name }}
		</template>

		<template #description v-if="ticker.description">
			<ui-position-tooltip placement="bottom-start" :close-delay="200">
				<ui-clamped :rows="1">
					<ui-text token="text-100-r">{{ ticker.description }}</ui-text>
				</ui-clamped>

				<template #content>
					<ui-tooltip-wrapper
						display-variant="new"
						:class="classes.descriptionTooltip"
					>
						{{ ticker.description }}
					</ui-tooltip-wrapper>
				</template>
			</ui-position-tooltip>
		</template>

		<template #badges>
			<ui-tag v-if="exchange" icon-position="start">
				<template #icon>
					<ui-image
						:src="exchange.logo_url"
						width="16px"
						height="16px"
						:class="classes.exchangeIcon"
					/>
				</template>
				<template #default>
					{{ exchange.title }}
				</template>
			</ui-tag>
			<ui-position-tooltip
				placement="bottom-start"
				:close-delay="200"
			>
				<ui-tag :class="classes.provider">
					<ui-image
						:src="dataProvider.logo_url"
						width="16px"
						height="16px"
						show-loader
						:class="classes.providerIcon"
					>
						<template #error>
							<ui-image
								:src="fmp"
								width="16px"
								height="16px"
								:class="classes.providerIcon"
							/>
						</template>
					</ui-image>
				</ui-tag>

				<template #content>
					<ui-tooltip-wrapper :class="classes.tooltip" display-variant="new">
						<div :class="classes.tooltipIcon">
							<ui-image
								:src="dataProvider.logo_url"
								width="16px"
								height="16px"
								:class="classes.providerIcon"
							/>
						</div>
						<div :class="classes.tooltipDescription">
							<ui-text token="text-200-b">
								A real-time {{ ticker.name }} price <br>
								data provided by {{ dataProvider.title }}
							</ui-text>
						</div>
					</ui-tooltip-wrapper>
				</template>
			</ui-position-tooltip>
		</template>

		<template #price>
			<ticker-header-price :price="price" />
		</template>

		<template #price-mobile>
			<ticker-header-price :price="price" />
		</template>

		<template #actions>
			<ui-control-icon
				v-if="isMoreOptionsEnabled"
				:icon="IconIds.ThreeDots"
				transparent
			/>
		</template>
	</ticker-header-layout>
</template>

<style module="classes">
.secondLogo {
	margin-left: -20px;
}

.descriptionTooltip {
	max-width: 608px;
}

.exchangeIcon {
	border-radius: 50%;
}

.provider {
	cursor: pointer;
}

.providerIcon {
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	aspect-ratio: 1/1;
}

.tooltip {
	display: flex;
	align-items: start;
	padding: var(--padding-padding-s6, 10px) var(--padding-padding-s8, 14px);
	gap: 6px;
}

.tooltipIcon {
	display: flex;
	align-items: center;
	padding: var(--padding-padding-s3, 4px) 0;
}
</style>
