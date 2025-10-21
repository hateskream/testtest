<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseDashboardComponent } from '@/modules/widgets/base/';
import type { IMeta } from '@/modules/dashboard-group';
import { useQueryTopIndices } from '../queries/get-top-indices';
import { ALL_COLUMNS } from '../model';
import { ErrorNetworkComponent } from '@/modules/widgets/base';

import TopIndicesLoader from './layouts/loader-layout.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./layouts/main-layout.vue'),
	loadingComponent: TopIndicesLoader,
	errorComponent: BaseDashboardComponent,
});

interface ITopIndicesWidgetProps {
	meta: IMeta;
}

const props = defineProps<ITopIndicesWidgetProps>();

const { data, isLoading, isError, refetch } = useQueryTopIndices(10);

const rows = computed(() => data?.value?.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? []);

const isNotData = computed(() => (!!rows.value.length && isLoading.value) || props.meta.isLoading);

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();
</script>

<template>
	<base-dashboard-component
		:meta="props.meta"
		:has-reset="false"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
	>
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<error-network-component v-if="isError" @retry="refetch" />
			<top-indices-loader
				v-else-if="isNotData"
			/>

			<view-component
				v-else
				:rows="rows"
				:columns="ALL_COLUMNS"
			/>
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.topIndicesWidget {
	display: flex;
}
</style>
