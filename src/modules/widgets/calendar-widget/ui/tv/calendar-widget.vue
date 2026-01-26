<script setup lang="ts">
import { defineAsyncComponent, reactive } from 'vue';

import { BaseErrorComponent, BaseWidgetTvComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { useCalendarState, useInfiniteQueryEventBoard } from '@/modules/calendar-new';

import CalendarLoader from '../views/calendar-loader.vue';

const CalendarMain = defineAsyncComponent({
	loader: () => import('../views/calendar-view.vue'),
	loadingComponent: CalendarLoader,
	errorComponent: BaseErrorComponent,
});

const props = defineProps<{
	meta: IMeta;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const {
	currentTime,
	selectedCategories,
	selectedCountries,
	selectedImpacts,
	resetAll,
} = useCalendarState({
	widget: {
		widgetId: props.meta.widgetId,
		isEphemeral: props.meta.isOpenFull,
	},
});

const query = reactive(useInfiniteQueryEventBoard(() => ({
	from: Math.floor(currentTime.value.setUTCHours(0, 0, 0, 0) / 1000),
	categories: selectedCategories.value,
	countries: selectedCountries.value,
	minImpact: selectedImpacts.value,
})));
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAll"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@retry="refetch"
	>
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<calendar-loader v-if="query.isLoading" />

			<calendar-main
				v-else-if="query.data && !query.isError"
				:event-board="query.data.days"
				:current-time="currentTime"
				:is-fetching-next="query.isFetchingNextPage"
				:is-fetching-prev="query.isFetchingPreviousPage"
				@load-next="query.fetchNextPage"
				@load-prev="query.fetchPreviousPage"
			/>

			<base-error-component
				v-else
				@retry="query.refetch"
			/>
		</template>
	</base-widget-tv-component>
</template>
