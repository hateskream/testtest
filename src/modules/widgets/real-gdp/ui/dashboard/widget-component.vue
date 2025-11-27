<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { FiltersPanel, PreloaderComponent } from '../common';
import { useRealGdp } from '@/modules/widgets/real-gdp/composables';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/main-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	activeRange,
	data,
	isLoading,
	isError,
	refetch,
} = useRealGdp({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
});
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<filters-panel
				v-model:range="activeRange"
				display-variant="new"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else-if="data"
				:data="data"
			/>
		</template>
	</base-widget-dashboard>
</template>
