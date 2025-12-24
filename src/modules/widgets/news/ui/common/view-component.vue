<script setup lang="ts">
import { ref } from 'vue';

import { type IDisplaySettings, type INews, NewsListComponent } from '@/modules/news';
import { isFeatureEnabled } from '@/shared/lib';

interface IViewNewsComponentProps {
	news: INews[];
	displaySettings: IDisplaySettings;
	displayVariant: 'tv' | 'dashboard';
	maxCountRowTablet?: number;
}

const props = defineProps<IViewNewsComponentProps>();

const selectedNewsId = defineModel<string | null>('newsId', {
	required: true,
});

const newsCanBeSelected = isFeatureEnabled('WIDGET_NEWS_SELECT_NEWS_ITEM');

function selectNews(element: { id: string; slug: string }) {
	if (newsCanBeSelected) {
		selectedNewsId.value = element.id;
	}
}

const newsRef = ref<typeof NewsListComponent | null>(null);

function scrollBy(px: number) {
	if (!newsRef.value) {
		return;
	}

	newsRef.value.scrollBy(px);
}

function calcMaxCountRowVisible(height: number) {
	if (!newsRef.value) {
		return;
	}

	return newsRef.value.calcMaxCountRowVisible(height);
}

function snapHeightToNearestStep(height: number) {
	if (!newsRef.value) {
		return;
	}

	return newsRef.value.snapHeightToNearestStep(height);
}


defineExpose({ scrollBy, calcMaxCountRowVisible, snapHeightToNearestStep });
</script>

<template>
	<news-list-component
		ref="newsRef"
		:news="props.news"
		:display-settings="props.displaySettings"
		:display-variant="props.displayVariant"
		:max-count-row-tablet="props.maxCountRowTablet"
		@select-news="selectNews"
	/>
</template>
