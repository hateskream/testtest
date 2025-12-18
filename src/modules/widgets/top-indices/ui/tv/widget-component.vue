<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseWidgetTvComponent } from '@/modules/widgets/base/';
import type { IMeta } from '@/modules/dashboard-group';
import { useQueryTopIndices } from '../../queries';
import { ALL_COLUMNS } from '../../model';
import { ErrorNetworkComponent } from '@/modules/widgets/base';
import { LoaderLayout } from '../common';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/main-layout.vue'),
	loadingComponent: LoaderLayout,
	errorComponent: BaseWidgetTvComponent,
});

interface ITopIndicesWidgetProps {
	meta: IMeta;
}

const props = defineProps<ITopIndicesWidgetProps>();

const limit = computed(() => props.meta.maxCountRowTable ?? 50);

const { data, isLoading, isError, refetch } = useQueryTopIndices(limit);

const rows = computed(() => data?.value?.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? []);

const isNotData = computed(() => (!!rows.value.length && isLoading.value) || props.meta.isLoading);

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const isFixedWidth = computed(()=>{
	return props.meta.size.w === 3;
});
</script>

<template>
	<base-widget-tv-component
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
			<loader-layout
				v-else-if="isNotData"
			/>

			<view-component
				v-else
				:is-fixed-width="isFixedWidth"
				:rows="rows"
				:columns="ALL_COLUMNS"
				display-variant="tv"
			/>
		</template>
	</base-widget-tv-component>
</template>

<style module="classes">
.topIndicesWidget {
	display: flex;
}
</style>
