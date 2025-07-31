<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import { BaseDashboardComponent } from '../../base/index.ts';
import { useQueryBintcoinDominanc } from '../queries/use-query-bitcoin-dominanc.ts';

import ViewComponent from './view-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ErrorComponent from './error-component.vue';
import RcmBitcoinDominanc from './rcm-bitcoin-dominanc.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { data, isLoading, isError } = useQueryBintcoinDominanc({
	market: props.meta.market,
});

const isNotData = computed(() => !!data.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:data="data"
				:meta="meta"
			/>
		</template>
		<template #rcm>
			<rcm-bitcoin-dominanc />
		</template>
	</base-dashboard-component>
</template>
