<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base/index.ts';
import { useQueryTension } from '../queries/use-query-tension.ts';
import type { IMeta } from '@/modules/dashboard-group';

import RcmFearGreedComponent from './rcm-fear-greed-component.vue';
import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { data, isLoading, isError, refetch } = useQueryTension(props.meta.market);

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
				:tension="data"
				:size="meta.size"
				@update-interactive="refetch"
			/>
		</template>

		<template #rcm>
			<rcm-fear-greed-component />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.root {
	flex-grow: 0.99;
	flex-basis: 0;
}
</style>
