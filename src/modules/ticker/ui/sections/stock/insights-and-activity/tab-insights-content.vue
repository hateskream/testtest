<script setup lang="ts">
import { TickerBaseListDivider } from '@/modules/ticker/ui/base';
import { TickerKeyIndicatorsWidget } from '@/modules/widgets/key-indicators';
import { EconomicOutlineTickerWidget } from '@/modules/widgets/economic-outline';
import { CurrentSentimentTickerWidget } from '@/modules/widgets/current-sentiment';
import { useTickerContext } from '@/modules/ticker/composables';

const { tickerId } = useTickerContext();
</script>

<template>
	<current-sentiment-ticker-widget :meta="{ tickerId, name: 'Current Sentiment' }" />
	<ticker-base-list-divider />
	<economic-outline-ticker-widget :meta="{ tickerId, name: 'Economic Outline' }" />
	<ticker-base-list-divider />
	<ticker-key-indicators-widget :meta="{ tickerId, name: 'Key Indicators' }" />
</template>
