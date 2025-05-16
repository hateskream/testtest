<script setup lang="ts">

import type { IMeta } from '@/modules/dashboard-group/model';
import { BaseDashboardComponent } from '../../base/index.ts';
import { useMarketStore } from '../../market/stores/index.ts';
import { useQueryWatchlist } from '../queries/watchlist.query.ts';

import MainView from './view/main-view.vue';
import ErrorView from './view/error-view.vue';
import LoaderView from './view/loader-view.vue';

const props = defineProps<{
	meta: IMeta;
}>();

const marketStore = useMarketStore();
const { data, isLoading, isError } = useQueryWatchlist({
	market: props.meta.market,
	sort: marketStore.activeTabSort.sortTab,
});
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div class="title-container">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<loader-view v-if="isLoading" />
			<error-view v-else-if="isError" />

			<main-view v-else :watchlist="data || []" />
		</template>
	</base-dashboard-component>
</template>

<style module>
.title-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}
</style>
