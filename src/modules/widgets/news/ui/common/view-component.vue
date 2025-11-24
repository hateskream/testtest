<script setup lang="ts">
import { ref } from 'vue';

import {
	type IDisplaySettings,
	type INews,
	NewsListComponent,
} from '@/modules/news';

interface IViewNewsComponentProps {
	news: INews[];
	displaySettings: IDisplaySettings;
	displayVariant: 'tv' | 'dashboard';
}

const props = defineProps<IViewNewsComponentProps>();

const selectedNewsId = defineModel<string | null>('newsId', {
	required: true,
});

const newsRef = ref<typeof NewsListComponent | null>(null);

function scrollBy(px: number) {
	if (!newsRef.value) {
		return;
	}

	newsRef.value.scrollBy(px);
}

defineExpose({ scrollBy });
</script>

<template>
	<news-list-component
		ref="newsRef"
		:news="props.news"
		:display-settings="props.displaySettings"
		:display-variant="props.displayVariant"
		@select-news="selectedNewsId = $event.id"
	/>
</template>
