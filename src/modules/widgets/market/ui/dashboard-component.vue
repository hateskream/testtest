<script setup lang="ts">
import { computed } from 'vue';

import { useQueryMarket } from '../queries';
import type { IMeta } from '@/modules/dashboard-group/core';
import { BaseDashboardComponent } from '../../base';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';
import MarketContextMenu from './market-context-menu.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { data, isLoading, isError } = useQueryMarket({
	market: props.meta.market,
});

const isNotData = computed(() => !!data.value && isLoading.value);

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
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
			<market-context-menu :title="props.meta.name" @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>
