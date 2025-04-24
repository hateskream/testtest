<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

import NewsFilters from './news-filters-component.vue';

const isVisibleFilters = ref(false);

const newsFiltersRef = useTemplateRef('newsFilters');

onClickOutside(newsFiltersRef, () => {
	isVisibleFilters.value = false;
});
</script>

<template>
	<div
		ref="newsFilters"
		:class="classes.iconFilter"
	>
		<ui-icon
			:id="IconIds.NewsFilter"
			width="20"
			height="20"
			:class="classes.icon"
			@click="isVisibleFilters = !isVisibleFilters"
		/>

		<news-filters v-show="isVisibleFilters" />
	</div>
</template>

<style module="classes">
.iconFilter {
	position: relative;
	z-index: 20;
	cursor: pointer;
}
</style>
