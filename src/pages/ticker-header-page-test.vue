<script setup lang="ts">
import { ref } from 'vue';

import { type ITickerMetaResponse, TickerPageHeader } from '@/modules/ticker-page';
import { MarketType } from '@/modules/market';
import { fetchTickers } from '@/modules/ticker-selector';

const tickersData = ref<ITickerMetaResponse[]>([
	{
		ticker: {
			canonical_ticker_id: 'Stock-AAPL',
			market_type: MarketType.Stock,
			symbol: 'AAPL',
			name: 'Apple Inc.',
			description: 'Apple Inc. is an American multinational technology company.',
			logo: 'https://s3-symbol-logo.tradingview.com/apple--600.png',
		},
		exchange: {
			title: 'NASDAQ',
			logo_url: 'https://s3-symbol-logo.tradingview.com/nasdaq--600.png',
		},
		data_provider: {
			title: 'Yahoo Finance',
			// eslint-disable-next-line @stylistic/max-len
			logo_url: 'https://media.licdn.com/dms/image/v2/D4E0BAQHhlMUwZ2yCKQ/company-logo_200_200/B4EZU4.ZvdGwAI-/0/1740417646754/financial_modeling_prep_logo?e=2147483647&v=beta&t=qTB34qzn4nrelooCDnGu3UwpxAFH_WzHXQH76ggeA7k',
		},
		price: {
			currency: '$',
			current_price: 1.1655,
			change: 0.00134,
			change_percent: 0.12,
			status: 'positive',
		},
		dominant_color: '#FFFFFF',
	},
	{
		ticker: {
			canonical_ticker_id: 'Forex-EURUSD',
			market_type: MarketType.Forex,
			symbol: 'EURUSD',
			name: 'Euro / US Dollar',
			description: 'The EUR/USD is the most traded currency pair in the world.',
			logo: 'https://cdn-icons-png.flaticon.com/512/323/323344.png',
			currency: 'EUR',
			currency_icon: 'https://www.countryflags.com/wp-content/uploads/united-states-of-america-flag-png-xl.png',
		},
		exchange: {
			title: 'FOREX',
			logo_url: 'https://example.com/forex-logo.png',
		},
		data_provider: {
			title: 'Alpha Vantage',
			logo_url: 'https://example.com/alpha-vantage-logo.png',
		},
		price: {
			currency: '€',
			current_price: 1.0856,
			change: 0.00234,
			change_percent: 0.22,
			status: 'positive',
		},
		dominant_color: '#FF0000',
	},
]);

async function handleTickerSelect(index: number, tickerId: string) {
	const [ticker] = await fetchTickers(tickerId);

	tickersData.value[index].ticker = ticker;
}
</script>

<template>
	<div :class="classes.container">
		<ticker-page-header
			v-for="(data, index) in tickersData"
			:key="index"
			:ticker="data.ticker"
			:exchange="data.exchange"
			:data-provider="data.data_provider"
			:price="data.price"
			:dominant-color="data.dominant_color"
			@on-ticker-select="handleTickerSelect(index, $event)"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	gap: 270px;
	padding: 0 24px;
}
</style>
