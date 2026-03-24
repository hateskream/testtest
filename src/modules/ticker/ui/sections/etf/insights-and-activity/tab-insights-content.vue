<script setup lang="ts">
import { TickerKeyIndicatorsWidget } from '@/modules/widgets/key-indicators';
import { EconomicOutlineTickerWidget } from '@/modules/widgets/economic-outline';
import { CurrentSentimentTickerWidget } from '@/modules/widgets/current-sentiment';
import { useTickerContext } from '@/modules/ticker/composables';
import { TickerBaseListDivider, TickerBaseTabContent } from '../../../base';
import { isFeatureEnabled } from '@/shared/lib';

const { tickerId } = useTickerContext();

const currentSentimentIsEnabled = isFeatureEnabled('TICKER_WIDGET_CURRENT_SENTIMENT_ENABLED');
</script>

<template>
	<ticker-base-tab-content>
		<current-sentiment-ticker-widget
			v-if="currentSentimentIsEnabled"
			:meta="{ tickerId, name: 'Current Sentiment' }"
		/>
		<ticker-base-list-divider />
		<economic-outline-ticker-widget :meta="{ tickerId, name: 'Economic Outline' }" />
		<ticker-base-list-divider />
		<ticker-key-indicators-widget :meta="{ tickerId, name: 'Key Indicators' }" />
	</ticker-base-tab-content>
</template>
