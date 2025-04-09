<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import { useQueryMarket } from '../queries';
import { useMarketStore } from '../stores';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';

interface IDashboardComponentProps {
	market: string;
}

const props = defineProps<IDashboardComponentProps>();

const marketStore = useMarketStore();

const { data, isLoading, isError } = useQueryMarket({
	market: props.market,
	sort: marketStore.activeTabSort.sortTab,
	timeframe: marketStore.activeTabSort.timeframe,
});

const isNotData = computed(() => !!data.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :class="classes.root">
		<template #title> Market </template>
		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:markets="data"
			/>
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.root {
	/* flex-grow: 1.8;
	flex-basis: 0; */

	width: 430px;
}
</style>
