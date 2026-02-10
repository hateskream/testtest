<script setup lang="ts">
import { TickerPageHeader, TickerPageHeaderPreloader, useQueryTickerPageMeta } from '@/modules/ticker-page';
import { useTickerContext } from '../../composables';
import { BaseTickerWidgetError } from '@/modules/widgets/base';

const { tickerId, changeTickerId } = useTickerContext();

const { data, isLoading, isError, refetch } = useQueryTickerPageMeta(() => ({
	tickerId: tickerId.value,
}));
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
		@on-ticker-select="changeTickerId"
	/>
</template>

<style module="classes">
.error {
	border-bottom: 1px solid var(--color-border-surface-01, rgb(199 199 199 / 6%));
}
</style>
