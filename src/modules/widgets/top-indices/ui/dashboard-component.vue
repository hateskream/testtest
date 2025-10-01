<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '@/modules/widgets/base/';
import type { IMeta } from '@/modules/dashboard-group/core';
import { useQueryTopIndices } from '../queries/get-top-indices';
import { ALL_COLUMNS } from '../model';
import { ErrorNetworkComponent } from '@/modules/widgets/base';

import TopIndicesMain from './layouts/main-layout.vue';
import TopIndicesLoader from './layouts/loader-layout.vue';
import TopIndicesContextMenu from './modals/context-menu.vue';

interface ITopIndicesWidgetProps {
	meta: IMeta;
}

const props = defineProps<ITopIndicesWidgetProps>();

const { data, isLoading, isError, refetch } = useQueryTopIndices(10);

const rows = computed(() => data?.value?.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? []);

const isNotData = computed(() => !!rows.value.length && isLoading.value);

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
			<error-network-component v-if="isError" @retry="refetch" />
			<top-indices-loader
				v-else-if="isNotData"
				:count="5"
				:height="'48px'"
			/>

			<top-indices-main
				:rows="rows"
				:columns="ALL_COLUMNS"
			/>
		</template>

		<template #rcm>
			<top-indices-context-menu :title="props.meta.name" @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.topIndicesWidget {
	display: flex;
}
</style>
