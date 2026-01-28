<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { FiltersPanel, PreloaderComponent } from '../common';
import { useHighImpactHourMap } from '@/modules/widgets/high-impact-hour-map/composables';
import { RouteNames } from '@/types/route.d';
import { isFeatureEnabled } from '@/shared/lib';

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

const {
	activeTimezone,
	data,
	isLoading,
	isError,
	refetch,
	resetAllChanges,
} = useHighImpactHourMap({ widgetId: props.meta.widgetId, isEphemeral: props.meta.isOpenFull });

const router = useRouter();

function handleClickOnBar(hours: number[]) {
	if (!isFeatureEnabled('WIDGET_HIGH_IMPACT_HOUR_MAP_CALENDAR_REDIRECT')) {
		return;
	}

	// TODO: Связать с календарем. Он должен открывать нужный промежуток с учетом часов из hours.

	const today = new Date();
	today.setHours(hours[0]);

	const route = router.resolve({
		name: RouteNames.Calendar,
		query: {
			date: today.toJSON(),
		},
	});

	window.open(route.fullPath, '_blank');
}
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@delete="emits('delete')"
		@duplicate="emits('duplicate')"
		@move-to="emits('moveTo', $event)"
		@retry="refetch"
	>
		<template #filters>
			<filters-panel
				v-model:timezone="activeTimezone"
				display-variant="new"
				@reset="resetAllChanges"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component
				v-else-if="isLoading || props.meta.isLoading"
				:display-variant="props.meta.activeDisplayVariant"
			/>
			<view-component
				v-else-if="data"
				:data="data"
				@click-on-bar="handleClickOnBar"
			/>
		</template>
	</base-widget-dashboard>
</template>
