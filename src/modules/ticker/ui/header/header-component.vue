<script setup lang="ts">
import { TickerPageHeader, TickerPageHeaderPreloader, useQueryTickerPageMeta } from '@/modules/ticker-page';
import { useTickerContext } from '../../composables';
import { BaseErrorComponent } from '@/modules/widgets/base';

const { tickerId, changeTickerId } = useTickerContext();

const { data, isLoading, isError, refetch } = useQueryTickerPageMeta(() => ({
	tickerId: tickerId.value,
}));
</script>

<template>
	<base-error-component v-if="isError && !isLoading" @retry="refetch" />
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
