<script setup lang="ts">
import { computed } from 'vue';

import { TickerBaseTabSection } from '@/modules/ticker/ui/base';
import { UiSpeedometer, UiSpeedometerDescription } from '@/shared/ui/speedometer';
import { useQueryCurrentSentiment } from '../../query/use-query-current-sentiment';
import { SENTIMENT_SEGMENTS, mapSentiment } from '../../model';

import CurrentSentimentLoading from '../current-sentiment-loading.vue';
import CurrentSentimentError from '../current-sentiment-error.vue';

const props = defineProps<{
	meta: {
		tickerId: string;
	};
}>();

const { data, isLoading, isError, refetch } = useQueryCurrentSentiment(() => ({
	tickerId: props.meta.tickerId,
}));

const sentiment = computed(() => {
	if (!data.value) {
		return null;
	}
	return mapSentiment(data.value.tension);
});
</script>

<template>
	<current-sentiment-loading v-if="isLoading" />

	<ticker-base-tab-section v-else-if="data && !isError">
		<template #title>
			Current Sentiment
		</template>
		<template #content>
			<div :class="classes.chart">
				<ui-speedometer
					:value="data.tension"
					:color="sentiment?.color ?? ''"
					:segments="SENTIMENT_SEGMENTS"
				/>
				<ui-speedometer-description
					:value="data.tension"
					:color="sentiment?.color ?? ''"
					:title="sentiment?.signal"
					:description="sentiment?.description"
					:class="classes.chartDescription"
				/>
			</div>
		</template>
	</ticker-base-tab-section>

	<current-sentiment-error v-else @retry="refetch()" />
</template>

<style module="classes">
.chart {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
}

.chartDescription {
	margin-top: -35px;
}
</style>
