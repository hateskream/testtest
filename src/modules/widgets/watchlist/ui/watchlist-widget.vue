<script setup lang="ts">
import { BaseDashboardComponent } from '../../base/index.ts';
import type { IMeta } from '@/modules/dashboard-group/model';
import { useQueryWatchlistWidget } from '../queries/watchlist.query.ts';

import WatchlistMain from './views/watchlist-main.vue';
import WatchlistError from './views/watchlist-error.vue';
import WatchlistLoader from './views/watchlist-loader.vue';

const props = defineProps<{
	meta: IMeta;
}>();

const { data, isLoading, isError } = useQueryWatchlistWidget({ market: props.meta.market });
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<watchlist-loader v-if="isLoading" />
			<watchlist-error v-else-if="isError" />

			<watchlist-main v-else :data="data" />
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
