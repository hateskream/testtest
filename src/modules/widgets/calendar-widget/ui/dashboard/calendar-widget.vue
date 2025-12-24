<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { BaseWidgetDashboard, ModalBadge, WidgetFiltersScrollable } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import {
	CalendarEmptyEventBoard,
	CalendarEventBoard,
	EventType,
	EventTypeModal,
	type IEventBoardExposed,
	MarketIds,
	markets,
	markets as marketsData,
	useCalendarState,
	useEventBoardScroll,
} from '@/modules/calendar';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { formattedLabel, getMarketLabel, isAllSelected } from '@/modules/calendar/utils/toolbar.ts';
import { PreloaderComponent } from '@/modules/widgets/calendar-widget/ui/common';
import { UiText } from '@/shared/ui/text';

import MarketsModal from '@/modules/calendar/ui/modal/markets-modal.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	baseDate,
	isEventBoardLoading,
	eventBoard,
	eventBoardFavorites,
	marketId,
	eventType,
	toggleFavorite,
	resetAll,
} = useCalendarState({
	toolbar: {
		useQuery: false,
		widgetId: props.meta.widgetId,
		defaultState: props.meta.defaultStateType,
	},
});

const marketIcon = computed(() => {
	if (isAllSelected(marketId.value, Object.values(MarketIds))) {
		return IconIds.Globus;
	}

	return marketsData.find(v => v.id === Array.from(marketId.value)[0])?.icon || IconIds.Globus;
});

const marketLabel = computed(() => {
	const arr = Array.from(marketId.value);

	if (arr.length === 0 || arr.length === Object.values(MarketIds).length) {
		return 'Entire World';
	}

	if (arr.length === 1) {
		return getMarketLabel(arr[0]);
	}

	return `${getMarketLabel(arr[0])} +${arr.length - 1}`;
});

const eventBoardRef = useTemplateRef<IEventBoardExposed>('event-board-component');

useEventBoardScroll({
	ref: eventBoardRef,
	board: eventBoard.value,
	baseDate: baseDate.value,
});

function scrollBy(px: number) {
	if (!eventBoardRef.value) {
		return;
	}

	eventBoardRef.value.scrollBy(px);
}

function calcMaxCountRowVisible(height: number) {
	if (!eventBoardRef.value) {
		return;
	}

	return eventBoardRef.value.calcMaxCountRowVisible(height);
}

function snapHeightToNearestStep(height: number) {
	if (!eventBoardRef.value) {
		return;
	}

	return eventBoardRef.value.snapHeightToNearestStep(height);
}

defineExpose({ scrollBy, calcMaxCountRowVisible, snapHeightToNearestStep });
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<widget-filters-scrollable
				display-variant="new"
				@on-clear-click="resetAll"
			>
				<modal-badge display-variant="new">
					<template #title>
						<ui-icon :id="marketIcon" />
						<ui-text token="text-200-r" as="div">{{marketLabel}}</ui-text>
						<ui-icon :id="IconIds.DropdownDown" />
					</template>
					<template #content>
						<markets-modal
							v-model="marketId"
							:markets="markets"
							display-variant="new"
						/>
					</template>
				</modal-badge>
				<modal-badge display-variant="new">
					<template #title>
						{{
							formattedLabel(Array.from(eventType), Object.values(EventType), 'All', 'Event Type')
						}}
						<ui-icon :id="IconIds.DropdownDown" />
					</template>
					<template #content>
						<event-type-modal
							v-model="eventType"
							:event-types="Object.values(EventType)"
							display-variant="new"
						/>
					</template>
				</modal-badge>
			</widget-filters-scrollable>
		</template>
		<template #content>
			<preloader-component v-if="isEventBoardLoading" :display-variant="props.meta.activeDisplayVariant" />

			<calendar-event-board
				v-else-if="eventBoard.length"
				ref="event-board-component"
				:event-board="eventBoard"
				:event-board-favorites="eventBoardFavorites"
				display-variant="new"
				:max-count-row-table="props.meta.maxCountRowTable"
				@toggle-event-board="toggleFavorite"
			/>

			<calendar-empty-event-board
				v-else
				@reset="resetAll"
			/>
		</template>
	</base-widget-dashboard>
</template>
