<script setup lang="ts">
import { ref } from 'vue';

import { useQueryTickerPageMeta, TickerPageHeader } from '@/modules/ticker-page';

const tickerId = ref('Crypto-BTC_Bitcoin');

function handleTickerSelect(id: string) {
	tickerId.value = id;
}

const { data, isLoading } = useQueryTickerPageMeta(() => ({
	tickerId: tickerId.value,
}));
</script>

<template>
	<div v-if="data" :class="classes.container">
		<ticker-page-header
			:ticker="data.ticker"
			:exchange="data.exchange"
			:data-provider="data.data_provider"
			:price="data.price"
			:dominant-color="data.dominant_color"
			@on-ticker-select="handleTickerSelect($event.canonical_ticker_id)"
		/>
	</div>

	<div v-else-if="isLoading">
		Loading...
	</div>

	<button
		v-else
		:class="classes.reset"
		@click="handleTickerSelect('Crypto-BTC_Bitcoin')"
	>
		Reset
	</button>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	gap: 270px;
	padding: 0 24px;
}

.reset {
	color: #ffffff;
}
</style>
