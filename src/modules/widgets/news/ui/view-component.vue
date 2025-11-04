<script setup lang="ts">
import {
	type IDisplaySettings,
	type INews,
	NewsListComponent,
} from '@/modules/news';

interface IViewNewsComponentProps {
	news: INews[];
	displaySettings: IDisplaySettings;
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
		@select-news="selectedNewsId = $event"
	/>
</template>

<style module="classes">

</style>
