<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { type IDataProvider, type IExchange, type ITickerItemExtended, type IPriceData } from '../api/ticker-data';
import { RouteNames } from '@/types/route.d';
import { TickerIcon } from '@/shared/ui/ticker';
import { UiText } from '@/shared/ui/text';
import { UiPosition } from '@/shared/ui/position';
import { UiImage } from '@/shared/ui/image';
import { UiTooltipWrapper } from '@/shared/ui/tooltip';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useGoToTickerPage } from '@/modules/chart';
import { SelectionMode, TickerSelectorModal } from '@/modules/ticker-selector';
import { ALL_MARKET_TYPES } from '@/modules/market';
import { isFeatureEnabled } from '@/shared/lib';

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
	const label = `${props.price.change_24h} (${props.price.change_24h_percent}%)`;

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
						v-if="props.ticker.currency"
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
							<ui-text token="text-200-b">{{props.ticker.symbol}}</ui-text>
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
									<ui-text token="text-100-r">
										{{props.ticker.description}}
									</ui-text>
								</div>
							</div>

							<div :class="classes.badges">
								<div v-if="props.exchange" :class="classes.exchange">
									<ui-image
										:src="props.exchange.logo_url"
										width="16px"
										height="16px"
										:class="classes.exchangeIcon"
									/>

									<ui-text token="text-200-r">
										{{props.exchange.title}}
									</ui-text>
								</div>

								<ui-position
									trigger="hover"
									placement="bottom-start"
									:close-delay="200"
								>
									<template #title>
										<div :class="classes.provider">
											<ui-image
												:src="props.dataProvider.logo_url"
												width="16px"
												height="16px"
												:class="classes.providerIcon"
											/>
										</div>
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
								<ui-text token="title-200">
									{{props.price.currency}}
								</ui-text>
								<ui-text token="title-200">
									{{props.price.current_price}}
								</ui-text>
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
				<button :class="classes.moreIcon">
					<ui-icon
						:id="IconIds.ThreeDots"
						width="16px"
						height="16px"
					/>
				</button>
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
	background: var(--dominant-color, #FFFFFF);
	border-radius: 264px;
	filter: blur(88px);
	opacity: .16;
}

.inner {
	display: flex;
	flex: 1 0 0;
	justify-content: space-between;
	align-items: flex-end;
	gap: 8px;
	z-index: 1;
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

.exchange {
	display: flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding:
		var(--tile-padding-md-gap, 3px) var(--tile-padding-md-out, 6px)
		var(--tile-padding-md-gap, 3px) var(--tile-padding-md-gap, 3px);
	background: var(--base-base-80, rgb(73 73 80 / 22%));
	border-radius: var(--radius-radius-s9-16, 6px);
	cursor: default;
	gap: var(--tile-padding-md-gap, 3px);
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

.moreIcon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: var(--height-height-s12, 24px);
	color: var(--contrast-contrast-60, rgb(255 255 255 / 40%));
	cursor: pointer;
	transition: color 0.25s ease-in-out;
	gap: var(--padding-padding-s0, 0);
	aspect-ratio: 1/1;
}

.moreIcon:hover {
	color: var(--contrast-contrast-80, rgb(255 255 255 / 80%));
}
</style>
