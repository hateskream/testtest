<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard, WidgetContextMenu } from '@/modules/widgets/base';
import { PreloaderComponent } from '../common';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/main-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emits = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const isError = false;
const isLoading = false;
const refetch = () => {};

</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else
				:value="2.3"
				:second="0.5"
				trend="down"
			/>
		</template>

		<template #settings-menu>
			<widget-context-menu
				:title="props.meta.name"
				:dashboards="props.meta.dashboards"
				@delete="emits('delete')"
				@duplicate="emits('duplicate')"
				@move-to="emits('moveTo', $event)"
			/>
		</template>
	</base-widget-dashboard>
</template>
