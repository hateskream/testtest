<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { TickerPageHeader, useQueryTickerPageMeta } from '@/modules/ticker-page';
import { useTickerContext } from '../../composables';

const { tickerId } = useTickerContext();

const { data } = useQueryTickerPageMeta(() => ({
	tickerId: tickerId.value,
}));
</script>

<template>
	<ticker-page-header
		v-if="data"
		:ticker="data.ticker"
		:data-provider="data.data_provider"
		:dominant-color="data.dominant_color"
		:exchange="data.exchange"
		:price="data.price"
	/>

	<ui-skeleton
		v-else
		height="115px"
		width="100%"
	/>
</template>

<style module="classes">

</style>
