<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { TickerSelectorSearchModal } from '@/modules/ticker-selector';
import { ALL_MARKET_TYPES } from '@/modules/market';
import type { ITickerItemExtended } from '../../../api';

import TickerHeaderBreadcrumbs from './ticker-header-breadcrumbs.vue';

const props = defineProps<{
	ticker: ITickerItemExtended;
	dominantColor?: string;
}>();

const emit = defineEmits<{
	onTickerSelect: [string];
}>();

const selectedTickers = computed({
	get: () => [props.ticker],
	set: ([value]) => {
		if (value) {
			emit('onTickerSelect', value.canonical_ticker_id);
		}
	},
});

const glowStyle = computed(() => ({
	'--dominant-color': props.dominantColor || 'var(--bg-100, rgb(73 73 80 / 32%))',
}));
</script>

<template>
	<header :class="classes.header">
		<div :class="classes.glowWrapper">
			<div :class="classes.glow" :style="glowStyle" />
		</div>

		<div :class="classes.inner">
			<div :class="classes.breadcrumbsMobile">
				<ticker-header-breadcrumbs :ticker="ticker" />
			</div>

			<div :class="classes.left">
				<div v-if="$slots.logo" :class="classes.logoWrapper">
					<slot name="logo" />
				</div>

				<div :class="classes.etc">
					<div :class="classes.breadcrumbs">
						<ticker-header-breadcrumbs :ticker="ticker" />
					</div>

					<div :class="classes.bottom">
						<div :class="classes.main">
							<div :class="classes.ticker">
								<ui-position placement="bottom-start">
									<template #title="{ isVisible }">
										<button :class="classes.tickerName">
											<ui-text token="title-300">
												<slot name="ticker-name">{{ ticker.name }}</slot>
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
										<ticker-selector-search-modal
											v-model:selected-tickers="selectedTickers"
											:enabled-markets="ALL_MARKET_TYPES"
										/>
									</template>
								</ui-position>

								<div v-if="$slots.description" :class="classes.description">
									<slot name="description" />
								</div>
							</div>

							<div v-if="$slots.badges" :class="classes.badges">
								<slot name="badges" />
							</div>
						</div>

						<div v-if="$slots.price" :class="classes.price">
							<slot name="price" />
						</div>
					</div>
				</div>
			</div>

			<div :class="classes.options">
				<div v-if="$slots['price-mobile']" :class="classes.leftOptions">
					<slot name="price-mobile" />
				</div>
				<div v-if="$slots.actions" :class="classes.rightOptions">
					<slot name="actions" />
				</div>
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
	background: var(--dominant-color);
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

.etc {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	padding-right: var(--padding-padding-s11, 20px);
	gap: var(--padding-padding-s4, 6px);
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
	white-space: nowrap;
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
	gap: var(--padding-padding-s2, 2px);
}

.options {
	display: flex;
	justify-content: flex-end;
}

.price {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.breadcrumbsMobile,
.leftOptions {
	display: none;
}

@media screen and (max-width: 519px) {
	.breadcrumbs,
	.price {
		display: none;
	}

	.inner {
		flex-direction: column;
		align-items: flex-start;
	}

	.breadcrumbsMobile {
		display: flex;
		padding-bottom: 4px;
	}

	.main {
		flex-direction: column;
		align-items: flex-start;
		gap: 0;
	}

	.badges {
		padding: var(--padding-padding-s3, 4px) 0;
	}

	.options {
		justify-content: space-between;
		width: 100%;
	}

	.leftOptions {
		display: flex;
	}
}
</style>
