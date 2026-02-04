<script setup lang="ts">
import { TickerBaseListDivider } from '@/modules/ticker/ui/__base__';
import { TickerKeyIndicatorsWidget } from '@/modules/widgets/key-indicators';
import { EconomicOutlineTickerWidget } from '@/modules/widgets/economic-outline';
import { CurrentSentimentTickerWidget } from '@/modules/widgets/current-sentiment';
import { useTickerContext } from '@/modules/ticker/composables';

const { tickerId } = useTickerContext();
</script>

<template>
	<current-sentiment-ticker-widget :meta="{ tickerId }" />

	<ticker-base-list-divider />

	<economic-outline-ticker-widget :meta="{ tickerId }" />

	<ticker-base-list-divider />

	<ticker-key-indicators-widget :meta="{ tickerId }" />
</template>
