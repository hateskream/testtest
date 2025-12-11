<script setup lang="ts">
import type { ITicker } from '@/modules/news';
import { useGoToTickerPage } from '@/modules/chart';
import { TickerIcon } from '@/shared/ui/ticker';

const { goToTickerPageLink } = useGoToTickerPage();

defineProps<{
	displayVariant: 'new' | 'default';
	stocks: ITicker[];
}>();
</script>

<template>
	<section :class="classes.tickers">
		<h3 :class="classes.subheading">Tickers</h3>
		<ul :class="[classes.tickerList, displayVariant === 'new' ? classes.new : classes.old]">
			<li v-for="ticker in stocks" :key="ticker.name">
				<router-link
					:to="goToTickerPageLink(ticker.ticker)"
					:class="classes.tickerItem"
					data-icon-glow-trigger
				>
					<ticker-icon
						:ticker="ticker.ticker"
						:src="ticker.srcImage[0]"
						:size="21"
					/>
					<span :class="classes.tickerSymbol">{{ ticker.ticker }}</span>
					<span :class="classes.tickerChange">1.10%</span>
				</router-link>
			</li>
		</ul>
	</section>
</template>

<style module="classes">
.tickers {
	display: flex;
	flex-direction: column;
	gap: 6px;
	width: 100%;
}

.tickerList {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.tickerList.new {
	gap: 2px;
}

.new .tickerItem {
	display: flex;
	align-items: center;
	width: max-content;
	height: var(--height-height-s12, 24px);
	padding:
		var(--tile-padding-md-gap, 3px) var(--tile-padding-md-out, 6px)
		var(--tile-padding-md-gap, 3px) var(--tile-padding-md-gap, 3px);
	background: var(--base-base-80, rgb(73 73 80 / 22%));
	border-radius: var(--radius-radius-s9-16, 6px);
	gap: var(--rile-padding-md-gap, 3px);
}

.old .tickerItem {
	display: flex;
	align-items: center;
	width: max-content;
	gap: 4px;
	height: 24px;
	padding: 2px 6px 2px 2px;
	background: var(--color-bg-base-300, rgb(37 37 39 / 50%));
	border-radius: 9999px;
}

.tickerSymbol {
	font-weight: 440;
	font-size: 10px;
	color: var(--color-text-base-500, #ffffff);
}

.tickerChange {
	font-weight: 440;
	font-size: 10px;
	color: var(--color-metrics-positive-copy, #04eda0);
}
</style>
