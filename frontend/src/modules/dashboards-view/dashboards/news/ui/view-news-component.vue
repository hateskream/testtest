<script setup lang="ts">
import { computed } from 'vue';

import { ScrollContainer } from '../../base';
import type { INews } from '../model';

import NewsComponent from './news-component.vue';

interface IViewNewsComponentProps {
	news: INews[];
}

defineProps<IViewNewsComponentProps>();

const visibleNewsPx = computed(() => {
	const newsVisible = 3;
	const newsMaxHeight = 97;

	return newsVisible * newsMaxHeight;
});
</script>

<template>
	<div :class="classes.root">
		<scroll-container
			overflow-x="hidden"
			:max-height="visibleNewsPx"
		>
			<template #content>
				<news-component
					v-for="item in news"
					:key="item.id"
					v-bind="item"
				/>
			</template>
		</scroll-container>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	width: 100%;
}
</style>
