<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import { useQueryMarket } from '../queries';
import { useMarketStore } from '../stores';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';
import RcmMarket from './rcm-market.vue';

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
	<base-dashboard-component>
		<template #title> Market </template>
		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:markets="data"
			/>
		</template>
		<template #rcm="{ positions }">
			<rcm-market :positions="positions" />
		</template>
	</base-dashboard-component>
</template>
