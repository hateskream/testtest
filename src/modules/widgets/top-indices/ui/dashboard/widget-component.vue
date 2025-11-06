<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseWidgetDashboard, BaseErrorComponent } from '@/modules/widgets/base/';
import type { IMeta } from '@/modules/dashboard-group';
import { useQueryTopIndices } from '../../queries';
import { ALL_COLUMNS } from '../../model';
import { ErrorNetworkComponent } from '@/modules/widgets/base';
import { LoaderLayout } from '../common';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/main-layout.vue'),
	loadingComponent: LoaderLayout,
	errorComponent: BaseErrorComponent,
});

interface ITopIndicesWidgetProps {
	meta: IMeta;
}

const props = defineProps<ITopIndicesWidgetProps>();

const { data, isLoading, isError, refetch } = useQueryTopIndices(props.meta.maxCountRowTable ?? 50);

const rows = computed(() => data?.value?.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? []);

const isNotData = computed(() => (!!rows.value.length && isLoading.value) || props.meta.isLoading);
</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #content>
			<error-network-component v-if="isError" @retry="refetch" />
			<loader-layout
				v-else-if="isNotData"
			/>
			<view-component
				v-else
				:rows="rows"
				:columns="ALL_COLUMNS"
				display-variant="dashboard"
			/>
		</template>
	</base-widget-dashboard>
</template>
