<script setup lang="ts">
import { ActivityMetricsTickerWidget } from '@/modules/widgets/activity-metrics';
import { useTickerContext } from '../../../composables';
import type { ISectionItem } from '../../../models';
import { TickerNewsWidget } from '@/modules/news';
import { BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { TickerAboutWidget } from '@/modules/widgets/ticker-about';

interface ISectionProps {
	section: ISectionItem;
}

defineProps<ISectionProps>();

const { tickerId, aboutText } = useTickerContext();
</script>

<template>
	<div :class="classes.section">
		<activity-metrics-ticker-widget :meta="{ tickerId, name: 'Activity Metrics' }" />
		<base-ticker-widget-wrapper>
			<ticker-news-widget :class="classes.news" :meta="{ tickerId, name: 'News' }" />
		</base-ticker-widget-wrapper>
		<ticker-about-widget
			v-if="aboutText"
			:meta="{ tickerId, name: 'About' }"
			:text="aboutText"
		/>
	</div>
</template>

<style module="classes">
.section {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s4, 6px);
	align-self: stretch;
}

.news {
	height: 700px;
}
</style>
