<script setup lang="ts">
import { BaseDashboardComponent } from '../../base/index.ts';
import type { IMeta } from '@/modules/dashboard-group/core/index.ts';

import WatchlistMain from './views/watchlist-main.vue';
import WatchlistRcm from './components/watchlist-rcm.vue';

const props = defineProps<{
	meta: IMeta;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<watchlist-main :meta="props.meta" />
		</template>


		<template #rcm>
			<watchlist-rcm @delete="emit('delete')" />
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
