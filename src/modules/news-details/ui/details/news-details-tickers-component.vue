<script setup lang="ts">
import type { INewsTicker } from '@/modules/news/api/get-news-data';

import NewsDetailsTickerItem from '../news-details-ticker-item.vue';

interface INewsDetailsTickersComponentProps {
	tickers: INewsTicker[];
}

const props = defineProps<INewsDetailsTickersComponentProps>();
</script>

<template>
	<section :class="classes.tickers">
		<h3 class="title-100">Tickers</h3>
		<ul :class="classes.tickerList">
			<li v-for="ticker in props.tickers" :key="ticker.symbol">
				<news-details-ticker-item :ticker="ticker" />
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
</style>
