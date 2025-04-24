<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base/index.ts';
import { useQueryTension } from '../queries/use-query-tension.ts';

import RcmFearGreedComponent from './rcm-fear-greed-component.vue';
import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';

interface IDashboardComponentProps {
	market: string;
}

const props = defineProps<IDashboardComponentProps>();

const { data, isLoading, isError, refetch } = useQueryTension(props.market);

const isNotData = computed(() => !!data.value && isLoading.value);
</script>

<template>
	<base-dashboard-component>
		<template #title>
			<div>Fear & Greed</div>
		</template>

		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:tension="data"
				@update-interactive="refetch"
			/>
		</template>

		<template #rcm="{ positions }">
			<rcm-fear-greed-component :positions="positions" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.root {
	flex-grow: 0.99;
	flex-basis: 0;
}
</style>
