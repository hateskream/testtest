<script setup lang="ts">
import { computed, ref } from 'vue';

import { TickerBaseTabSectionWrapper, TickerBaseTabSectionHead } from '@/modules/ticker/ui/base';
import { NewsDetails, NewsDetailsControls } from '@/modules/news-details';
import { getEndOfWeek, getStartOfWeek, toUtcIsoDate } from '../../model';
import { useQueryNews } from '../../queries';

import TickerNewsWidgetLoading from './ticker-news-widget-loading.vue';
import TickerNewsWidgetError from './ticker-news-widget-error.vue';
import NewsContentWrapper from '../news-content-wrapper-component.vue';
import NewsListComponent from '../news-list-component.vue';

interface IWidgetComponentProps {
	meta: {
		tickerId: string;
	};
}

const props = defineProps<IWidgetComponentProps>();

const selectedNewsId = ref<string | null>(null);

const { data, isLoading, isError, refetch } = useQueryNews({
	offset: 0,
	limit: 50,
	score: new Set(),
	segment: {
		selectedTickers: [props.meta.tickerId],
		excludedTickers: [],
		selectedMarkets: [],
	},
	sentiment: new Set(),
	source: new Set(),
	activeSort: null,
	locations: [],
	dateFrom: toUtcIsoDate(getStartOfWeek(new Date())),
	dateTo: toUtcIsoDate(getEndOfWeek(new Date())),
});

const news = computed(() => {
	if (!data.value) {
		return [];
	}

	return data.value.pages.flatMap(page => page.data);
});
</script>

<template>
	<ticker-news-widget-loading v-if="isLoading" />

	<ticker-news-widget-error
		v-else-if="isError"
		@refetch="refetch"
	/>

	<ticker-base-tab-section-wrapper v-else>
		<ticker-base-tab-section-head>News</ticker-base-tab-section-head>
		<news-content-wrapper :state="!!selectedNewsId">
			<template #default>
				<news-list-component
					:class="classes.list"
					:news="news"
					:display-settings="{
						isShowDate: true,
						isShowSource: true,
						isShowDesc: true,
						isShowAuthor: true,
						isShowSymbols: true,
						isShowScore: true,
					}"
					:display-variant="'dashboard'"
					@wheel.capture.stop
					@select-news="selectedNewsId = $event.id"
				/>
			</template>

			<template #details v-if="selectedNewsId">
				<news-details-controls @back="selectedNewsId = null" />
				<news-details :uuid="selectedNewsId!" display-variant="new" />
			</template>
		</news-content-wrapper>
	</ticker-base-tab-section-wrapper>
</template>

<style module="classes">
.list {
	max-height: 700px;
	overflow: scroll;
}
</style>
