<script setup lang="ts">
import { computed } from 'vue';

import { useQueryMarket } from '../queries';
import { useMarketStore } from '../stores';
import type { IMeta } from '@/modules/dashboard-group/model';
import { BaseDashboardComponent } from '../../base';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';
import RcmMarket from './rcm-market.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const marketStore = useMarketStore();

const { data, isLoading, isError } = useQueryMarket({
	market: props.meta.market,
	sort: marketStore.activeTabSort.sortTab,
});

const isNotData = computed(() => !!data.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:markets="data"
			/>
		</template>
		<template #rcm>
			<rcm-market />
		</template>
	</base-dashboard-component>
</template>
