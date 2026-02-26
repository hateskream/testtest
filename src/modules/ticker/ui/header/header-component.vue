<script setup lang="ts">
import { watch } from 'vue';

import { TickerPageHeader, TickerPageHeaderPreloader, useQueryTickerPageMeta } from '@/modules/ticker-page';
import { useTickerContext } from '../../composables';
import { BaseTickerWidgetError } from '@/modules/widgets/base';

const { tickerId, changeTickerId, changeAboutText } = useTickerContext();

const { data, isLoading, isError, refetch } = useQueryTickerPageMeta(() => ({
	tickerId: tickerId.value,
}));

function handleTickerSelect(canonicalTickerId: string) {
	changeTickerId(canonicalTickerId);
}

watch(() => data.value?.ticker.about, (value) => {
	if (value) {
		changeAboutText(value);
	}
}, { immediate: true });
</script>

<template>
	<base-ticker-widget-error
		v-if="isError && !isLoading"
		:class="classes.error"
		@retry="refetch"
	/>
	<ticker-page-header-preloader v-else-if="isLoading" />
	<ticker-page-header
		v-else-if="data"
		:ticker="data.ticker"
		:data-provider="data.data_provider"
		:dominant-color="data.dominant_color"
		:exchange="data.exchange"
		:price="data.price"
		@on-ticker-select="handleTickerSelect($event.canonical_ticker_id)"
	/>
</template>

<style module="classes">
.error {
	border-bottom: 1px solid var(--color-border-surface-01, rgb(199 199 199 / 6%));
}
</style>
