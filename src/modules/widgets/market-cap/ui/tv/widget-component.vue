<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetTvComponent, ModalItemSwitch } from '@/modules/widgets/base';
import { MarketCapFiltersPanel, PreloaderComponent } from '../common';
import { useMarketCap } from '../../composables';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/base-view.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	selectedTickers,
	displaySettings,
	resetAllChanges,
	activeDateRange,
	data,
	isLoading,
	isError,
	refetch,
} = useMarketCap({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
});

const isNotData = computed(() => (!!data.value && isLoading.value) || props.meta.isLoading);

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
	>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<market-cap-filters-panel
				v-model:selected-tickers="selectedTickers"
				v-model:date-range="activeDateRange"
				:meta="props.meta"
				:display-settings="displaySettings"
				autofocus
				:class="classes.filters"
			/>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				v-model:date-range="activeDateRange"
				:data="data"
				:meta="meta"
				:display-settings="displaySettings"
				:class="classes.content"
			/>
		</template>
		<template #change-display>
			<modal-item-switch v-model="displaySettings.isShowChart">Chart</modal-item-switch>
			<modal-item-switch v-model="displaySettings.isShowChange">Change, %</modal-item-switch>
		</template>
	</base-widget-tv-component>
</template>

<style module="classes">
.filters {
	padding: 0 16px;
	margin-bottom: 16px;
}

.content {
	padding: 0 16px 10px;
	overflow: hidden;
}
</style>
