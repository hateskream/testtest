<script setup lang="ts">
import { TickerKeyIndicatorsWidget } from '@/modules/widgets/key-indicators';
import { EconomicOutlineTickerWidget } from '@/modules/widgets/economic-outline';
import { CurrentSentimentTickerWidget } from '@/modules/widgets/current-sentiment';
import { useTickerContext } from '@/modules/ticker/composables';
import { TickerBaseListDivider, TickerBaseTabContent } from '../../../base';

const { tickerId } = useTickerContext();
</script>

<template>
	<ticker-base-tab-content>
		<current-sentiment-ticker-widget :meta="{ tickerId, name: 'Current Sentiment' }" />
		<ticker-base-list-divider />
		<economic-outline-ticker-widget :meta="{ tickerId, name: 'Economic Outline' }" />
		<ticker-base-list-divider />
		<ticker-key-indicators-widget :meta="{ tickerId, name: 'Key Indicators' }" />
	</ticker-base-tab-content>
</template>
