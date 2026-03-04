<script setup lang="ts">
import { useGoToTickerPage } from '@/modules/chart';
import { TickerIcon } from '@/shared/ui/ticker';
import { UiTag } from '@/shared/ui/tag';
import { UiText } from '@/shared/ui/text';
import type { INewsTicker } from '@/modules/news/api/get-news-data';

const { goToTickerPageLink } = useGoToTickerPage();

const props = defineProps<{
	tickers: INewsTicker[];
}>();
</script>

<template>
	<section :class="classes.tickers">
		<h3 class="title-100">Tickers</h3>
		<ul :class="[classes.tickerList]">
			<li v-for="ticker in props.tickers" :key="ticker.symbol">
				<router-link
					:to="goToTickerPageLink(ticker.canonical_ticker_id)"
					data-icon-glow-trigger
				>
					<ui-tag icon-position="start">
						<div :class="classes.text">
							<ui-text token="text-200-r" :class="classes.tickerSymbol">
								{{ ticker.symbol }}
							</ui-text>
							<ui-text
								v-if="ticker.price.change"
								token="text-200-r"
								:class="[
									classes.tickerChange,
									classes[ticker.price.status]
								]"
							>
								{{ ticker.price.change }}
							</ui-text>
						</div>

						<template #icon>
							<ticker-icon
								:ticker="ticker.symbol"
								:src="ticker.logo"
								:size="21"
							/>
						</template>
					</ui-tag>
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

.tickerSymbol {
	color: var(--color-text-base-500, #ffffff);
}

.tickerChange {
	padding-left: 3px;
}

.positive {
	color: var(--atom-success-00, #04eda0);
}

.negative {
	color: var(--atom-warning-00, #fc1d4d);
}

.neutral {
	color: var(--text-color-base-300, #9a9a9d);
}
</style>
