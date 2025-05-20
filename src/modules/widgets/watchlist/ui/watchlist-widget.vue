<script setup lang="ts">

import type { IMeta } from '@/modules/dashboard-group/model';
import { BaseDashboardComponent } from '../../base/index.ts';
import { useMarketStore } from '../../market/stores/index.ts';
import { useQueryWatchlist } from '../queries/watchlist.query.ts';

import MainView from './views/main-view.vue';
import ErrorView from './views/error-view.vue';
import LoaderView from './views/loader-view.vue';

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
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<loader-view v-if="isLoading" />
			<error-view v-else-if="isError" />

			<main-view v-else :watchlist-data="data || []" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.titleContainer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}
</style>
