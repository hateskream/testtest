<script setup lang="ts">
import { computed } from 'vue';

import { getEndOfWeek, getStartOfWeek, toUtcIsoDate } from '../../model';
import { useQueryNews } from '../../queries';

import NewsListComponent from '../news-list-component.vue';

interface IWidgetComponentProps {
	meta: {
		tickerId: string;
	};
}

const props = defineProps<IWidgetComponentProps>();

const { data } = useQueryNews({
	offset: 0,
	limit: 20,
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

const news = computed(() => data?.value?.pages.flatMap(page => page?.data).filter(t => !!t) ?? []);
</script>

<template>
	<div v-if="data">
		<news-list-component
			ref="newsRef"
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
		/>
	</div>
</template>

<style module="classes">

</style>
