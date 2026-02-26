<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetTvComponent, ModalItemSwitch } from '@/modules/widgets/base';
import { PreloaderComponent } from '../common';
import { useDominance } from '../../composables';
import { UiEmptyState } from '@/shared/ui/empty-state';
import { UiPillItem } from '@/shared/ui/pill';

import DominanceFiltersPanel from '@/modules/widgets/bitcoin-dominance/ui/common/dominance-filters-panel.vue';

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
	displaySettings,
	selectedTickers,
	activeDateRange,
	applyStateToParent,
	resetAllChanges,
	data,
	isLoading,
	isError,
	refetch,
} = useDominance({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
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
		@retry="refetch"
	>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<dominance-filters-panel
				v-model:selected-tickers="selectedTickers"
				v-model:date-range="activeDateRange"
				display-variant="default"
				:meta="props.meta"
				:display-settings="displaySettings"
				:class="classes.filters"
				@reset="resetAllChanges"
			/>
			<base-error-component
				v-if="isError"
				@retry="refetch"
			/>
			<preloader-component v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else-if="data?.length"
				v-model:date-range="activeDateRange"
				:selected-tickers="selectedTickers"
				:data="data"
				:meta="props.meta"
				:display-settings="displaySettings"
				:segments-class="classes.segments"
			/>
			<ui-empty-state v-else>
				<template #footer>
					<ui-pill-item :class="classes.reset" @click="resetAllChanges">
						Reset filters
					</ui-pill-item>
				</template>
			</ui-empty-state>
		</template>
		<template #change-display>
			<modal-item-switch v-model="displaySettings.isShowIndicator">Segmented indicator</modal-item-switch>
			<modal-item-switch v-model="displaySettings.isShowHistorical">Historical values</modal-item-switch>
			<modal-item-switch v-model="displaySettings.isShowChart">Chart</modal-item-switch>
		</template>
	</base-widget-tv-component>
</template>

<style module="classes">
.filters {
	flex-shrink: 0;
	margin-bottom: 15px;
	padding: 0 16px;
}

.reset {
	&:hover {
		color: #ffffff;
		background: rgb(51 51 51 / 80%);
	}
}

.segments {
	padding: 0 16px 16px;
}
</style>
