<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseWidgetTvComponent, BaseErrorComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { usePrice } from '../../composables';
import { PreloaderComponent } from '../common';

import RcmPriceComponent from './rcm-price-component.vue';
import HeaderComponent from './header-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	activeMarket,
	currentSettings,
	tickers,
	fetchTickersError,
	isNotData,
	resetAllChanges,
	togglePin,
	refetch,
	filtersValues,
	filtersState,
	applyStateToParent,
	hasPin,
} = usePrice({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
	maxCountRows: props.meta.maxCountRowTable,
});

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@apply-changes="applyStateToParent"
	>
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<base-error-component v-if="fetchTickersError" @retry="refetch" />
			<preloader-component v-else-if="isNotData || props.meta.isLoading" />
			<view-component
				v-else
				:tickers="tickers"
				:settings="currentSettings"
				:meta="meta"
				:has-pin="hasPin"
				@toggle-pin="togglePin"
			>
				<template #header>
					<header-component
						v-model:market="activeMarket"
						v-model:filters="filtersState"
						:filters-values="filtersValues"
					/>
				</template>
			</view-component>
		</template>
		<template #change-display>
			<rcm-price-component v-model="currentSettings" />
		</template>
	</base-widget-tv-component>
</template>
