<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

import type { IMeta } from '@/modules/dashboard-group';
import { useWidgetContext } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard, useWidgetState } from '@/modules/widgets/base';
import { RouteNames } from '@/types/route.d';
import { isFeatureEnabled } from '@/shared/lib';
import { FiltersPanel, PreloaderComponent } from '../common';
import { useHighImpactHourMapState } from '../../composables';
import { getDefaultState, type IState } from '../../model';

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

const { updateState } = useWidgetContext();

const { state } = useWidgetState<IState>({
	externalState: computed(() => props.meta.state as IState | undefined),
	getDefaultState,
	onStateChange: (s) => updateState(s),
});

const {
	activeTimezone,
	data,
	isLoading,
	isError,
	refetch,
	resetAllChanges,
} = useHighImpactHourMapState({ state, widgetId: props.meta.widgetId });

const router = useRouter();

function handleClickOnBar(hours: number[]) {
	if (!isFeatureEnabled('WIDGET_HIGH_IMPACT_HOUR_MAP_CALENDAR_REDIRECT')) {
		return;
	}

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
