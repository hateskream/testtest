<script setup lang="ts">
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
</script>

<template>
	<news-list-component
		:news="props.news"
		:display-settings="props.displaySettings"
		:display-variant="props.displayVariant"
		@select-news="selectedNewsId = $event.id"
	/>
</template>

<style module="classes">

</style>
