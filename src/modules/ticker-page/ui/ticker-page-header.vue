<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import {
	type IDataProvider,
	type IExchange,
	type IPriceData,
	type ITickerItemExtended,
} from '../api/get-ticker-page-meta';
import { RouteNames } from '@/types/route.d';
import { TickerIcon } from '@/shared/ui/ticker';
import { UiText } from '@/shared/ui/text';
import { UiPosition } from '@/shared/ui/position';
import { UiImage } from '@/shared/ui/image';
import { UiTooltipWrapper } from '@/shared/ui/tooltip';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useGoToTickerPage } from '@/modules/chart';
import { SelectionMode, TickerSelectorModal } from '@/modules/ticker-selector';
import { ALL_MARKET_TYPES, MarketType } from '@/modules/market';
import { isFeatureEnabled } from '@/shared/lib';
import { UiTag } from '@/shared/ui/tag';
import fmp from '@/assets/images/fmp.png';
import { UiControlIcon } from '@/shared/ui/control-icon';
import { UiClamped } from '@/shared/ui/clamped';
import { formatPercent, formatPrice } from '@/modules/lightweight-charts/model';

const props = defineProps<{
	ticker: ITickerItemExtended;
	exchange?: IExchange;
	dataProvider: IDataProvider;
	price: IPriceData;
	dominantColor: string;
}>();

const emits = defineEmits<{
	onTickerSelect: [string];
}>();

const { goToTickerPageLink } = useGoToTickerPage();

const selectedTickers = computed({
	get: () => [props.ticker],
	set: ([value]) => {
		if (!value) {
			return;
		}

		emits('onTickerSelect', value.canonical_ticker_id);
	},
});

const classes = useCssModule('classes');

const chart = computed(() => {
	const label = `${formatPrice(props.price.change)} (${ formatPercent(props.price.change_percent) }%)`;

	if (props.price.status === 'positive') {
		return {
			icon: IconIds.Gainers,
			class: classes.positive,
			label,
		};
	}

	if (props.price.status === 'negative') {
		return {
			icon: IconIds.Loosers,
			class: classes.negative,
			label,
		};
	}

	return {
		class: classes.neutral,
		label,
	};
});

const isMoreOptionsEnabled = isFeatureEnabled('TICKER_PAGE_HEADER_MORE_OPTIONS_ENABLED');

// TODO: Parse label to symbol
const currentCurrency = computed(() => {
	if (props.price.currency === 'USD') {
		return '$';
	}

	return props.price.currency;
});

const currentPrice = computed(() => formatPrice(props.price.current_price));
</script>

<template>
	<header :class="classes.header">
		<div :class="classes.glowWrapper">
			<div :class="classes.glow" :style="`--dominant-color: ${props.dominantColor}`" />
		</div>

		<div :class="classes.inner">
			<div :class="classes.left">
				<div :class="classes.logoWrapper">
					<ticker-icon
						:size="56"
						:ticker="props.ticker.symbol"
						:src="props.ticker.logo"
						disable-glow
					/>
					<ticker-icon
						v-if="props.ticker.currency && props.ticker.market_type === MarketType.Forex"
						:class="classes.secondLogo"
						:size="56"
						:ticker="props.ticker.currency"
						:src="props.ticker.currency_icon"
						disable-glow
					/>
				</div>

				<div :class="classes.etc">
					<div :class="classes.breadcrumbs">
						<router-link
							:to="{name: RouteNames.Home}"
							:class="classes.breadcrumbsItem"
						>
							<ui-text token="text-200-b">Home</ui-text>
						</router-link>

						<div :class="classes.separator">
							/
						</div>

						<router-link
							:to="goToTickerPageLink(props.ticker.canonical_ticker_id)"
							:class="classes.breadcrumbsItem"
							:active-class="classes.breadcrumbsItemActive"
						>
							<ui-text token="text-200-b">{{ props.ticker.symbol }}</ui-text>
						</router-link>
					</div>

					<div :class="classes.bottom">
						<div :class="classes.main">
							<div :class="classes.ticker">
								<ui-position placement="bottom-start">
									<template #title="{ isVisible }">
										<button :class="classes.tickerName">
											<ui-text token="title-300">
												{{props.ticker.name}}
											</ui-text>

											<ui-icon
												:id="IconIds.DropdownDown"
												width="16px"
												height="16px"
												:class="[classes.dropdownIcon, { [classes.active]: isVisible }]"
											/>
										</button>
									</template>
									<template #content>
										<ticker-selector-modal
											v-model:selected-tickers="selectedTickers"
											:enabled-markets="ALL_MARKET_TYPES"
											:selection-mode="SelectionMode.Single"
											display-variant="new"
										/>
									</template>
								</ui-position>

								<div v-if="props.ticker.description" :class="classes.description">
									<ui-clamped :rows="1">
										<ui-text token="text-100-r">{{ props.ticker.description }}</ui-text>
									</ui-clamped>
								</div>
							</div>

							<div v-if="props.exchange" :class="classes.badges">
								<ui-tag icon-position="start">
									<template #icon>
										<ui-image
											:src="props.exchange.logo_url"
											width="16px"
											height="16px"
											:class="classes.exchangeIcon"
										/>
									</template>
									<template #default>
										{{ props.exchange.title }}
									</template>
								</ui-tag>
								<ui-position
									trigger="hover"
									placement="bottom-start"
									:close-delay="200"
								>
									<template #title>
										<ui-tag>
											<ui-image
												:src="props.dataProvider.logo_url"
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
									</template>
									<template #content>
										<ui-tooltip-wrapper :class="classes.tooltip" display-variant="new">
											<div :class="classes.tooltipIcon">
												<ui-image
													:src="props.dataProvider.logo_url"
													width="16px"
													height="16px"
													:class="classes.providerIcon"
												/>
											</div>
											<div :class="classes.tooltipDescription">
												<ui-text token="text-200-b">
													A real-time {{props.ticker.name}} price <br>
													data provided by {{props.dataProvider.title}}
												</ui-text>
											</div>
										</ui-tooltip-wrapper>
									</template>
								</ui-position>
							</div>
						</div>

						<div :class="classes.price">
							<div :class="classes.current">
								<ui-text token="title-200">{{ currentCurrency }}</ui-text>
								<ui-text token="title-200">{{ currentPrice }}</ui-text>
							</div>

							<div :class="[classes.chartPrice, chart.class]">
								<ui-icon
									v-if="chart.icon"
									:id="chart.icon"
									width="8px"
									height="8px"
								/>

								<ui-text :class="classes.chartPriceLabel" token="text-100-r">
									{{chart.label}}
								</ui-text>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="isMoreOptionsEnabled" :class="classes.right">
				<ui-control-icon :icon="IconIds.ThreeDots" transparent />
			</div>
		</div>
	</header>
</template>

<style module="classes">
.header {
	position: relative;
	display: flex;
	align-items: center;
	align-self: stretch;
	padding: 16px 0;
	border-bottom: 1px solid var(--color-border-surface-01, rgb(199 199 199 / 6%));
	gap: 4px;
	container: header / inline-size;
}

.glowWrapper {
	position: absolute;
	bottom: -61px;
	left: -56px;
	display: flex;
	justify-content: center;
	align-items: center;
	pointer-events: none;
	touch-action: none;
}

.glow {
	flex-shrink: 0;
	width: 264px;
	height: 199px;
	background: var(--dominant-color, #ffffff);
	border-radius: 264px;
	filter: blur(88px);
}

.inner {
	z-index: 1;
	display: flex;
	flex: 1 0 0;
	justify-content: space-between;
	align-items: flex-end;
	gap: 8px;
}

.left {
	display: flex;
	flex: 1 0 0;
	align-items: flex-end;
	gap: 12px;
}

.logoWrapper {
	display: flex;
	align-items: center;
}

.secondLogo {
	margin-left: -20px;
}

.etc {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	padding-right: var(--padding-padding-s11, 20px);
	gap: var(--padding-padding-s4, 6px);
}

.breadcrumbs {
	display: flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	color: var(--text-300, rgb(255 255 255 / 62%));
	gap: var(--padding-padding-s4, 6px);
}

.breadcrumbsItem {
	font-size: var(--font-text-200-b-size, 12.2px);
}

.breadcrumbsItem:hover {
	color: var(--text-500, rgb(255 255 255 / 96%));
	text-decoration: underline;
}

.breadcrumbsItemActive {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.separator {
	pointer-events: none;
}

.bottom {
	display: flex;
	flex: 0 0 0;
	align-items: end;
	gap: 32px;
}

.main {
	display: flex;
	align-items: end;
	gap: 12px;
}

.tickerName {
	display: flex;
	align-items: center;
	padding: 0;
	color: var(--text-500, rgb(255 255 255 / 96%));
	cursor: pointer;
	gap: var(--padding-padding-s2, 2px);
}

.dropdownIcon {
	box-sizing: unset;
	padding: 4px;
	color: var(--text-300, rgb(255 255 255 / 62%));
	transition: color 0.25s ease-in-out;
}

.tickerName:hover .dropdownIcon,
.dropdownIcon.active {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.description {
	padding-bottom: var(--padding-padding-s2, 2px);
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.badges {
	display: flex;
	align-items: center;
	padding: var(--padding-padding-s0, 0) 0;
	gap: var(--padding-padding-s2, 2px);
}

.exchangeIcon {
	border-radius: 50%;
}

.provider {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: var(--height-height-s12, 24px);
	background: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s12-24, 9.2px);
	cursor: pointer;
	transition: background-color 0.25s ease-in-out;
	gap: var(--padding-padding-s0, 0);
	aspect-ratio: 1/1;
}

.provider:hover {
	background: var(--bg-300, rgb(73 73 80 / 52%));
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

.price {
	display: flex;
	align-items: center;
}

.current {
	display: flex;
	gap: 2px;
}

.chartPrice {
	display: flex;
	justify-content: center;
	align-items: center;
	padding:
		var(--padding-padding-s2, 2px) var(--padding-padding-s5, 8px)
		var(--padding-padding-s2, 2px) var(--padding-padding-s4, 6px);
	gap: var(--padding-padding-s3, 4px);
}

.negative {
	color: var(--atom-warning-00, #fc1d4d);
}

.positive {
	color: var(--atom-success-00, #04eda0);
}

.tickerName,
.current,
.chartPrice {
	white-space: nowrap;
}

@container header (max-width: 524px) {
	.price {
		flex-direction: column;
		align-items: flex-start;
	}

	.chartPrice {
		padding:
			var(--padding-padding-s2, 2px) 0;
	}
}
</style>
