<script setup lang="ts">
import { computed } from 'vue';

import { ModalBadge, ModalBadgeDropdown, ModalSubmenuContent } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { CalendarRangeSelect } from '@/shared/ui/calendar';
import {
	EventType,
	type IEventBoardRange,
	type IMarketData,
	Impact,
	MarketIds,
	markets as marketsData,
} from '@/modules/calendar';
import type { IWatchlist } from '@/modules/watchlist';
import { getMarketLabel, isAllSelected, toggleSet } from '@/modules/calendar/utils/toolbar.ts';

import CalendarToolbarEnd from './calendar-toolbar-end.vue';
import CalendarToolbarStartMinified from '@/modules/calendar/ui/toolbar/calendar-toolbar-start-minified.vue';
import CalendarToolbarStartMaximized from '@/modules/calendar/ui/toolbar/calendar-toolbar-start-maximized.vue';
import MarketsModal from '@/modules/calendar/ui/modal/markets-modal.vue';

interface ICalendarProps {
	initialDate: Date;
	baseDate: Date;
	markets: IMarketData[];
	eventTypes: EventType[];
	impacts: Impact[];
	weekDays: { date: Date }[];
	locale?: string;
	watchlists: IWatchlist[];
}

const props = defineProps<ICalendarProps>();

const emits = defineEmits<{
	'prev-week': [];
	'next-week': [];
	'reset-week': [];
}>();

const countryState = defineModel<Set<MarketIds>>('countryState', { required: true });
const impactState = defineModel<Set<Impact>>('impactState', { required: true });
const eventState = defineModel<Set<EventType>>('eventState', { required: true });
const watchlistIdState = defineModel<string | null>('watchlistIdState', { required: true });
const watchlistSectionState = defineModel<string | null>('watchlistSectionState', { required: true });

const range = defineModel<IEventBoardRange>('rangeState', { required: true });


const marketLabel = computed(() => {
	const arr = Array.from(countryState.value);

	if (arr.length === 0 || arr.length === Object.values(MarketIds).length) {
		return 'Entire World';
	}

	if (arr.length === 1) {
		return getMarketLabel(arr[0]);
	}

	return `${getMarketLabel(arr[0])} +${arr.length - 1}`;
});

const marketIcons = computed(() => {
	const arr = Array.from(countryState.value);

	if (
		isAllSelected(countryState.value, Object.values(MarketIds))
		|| arr.length === 0
	) {
		return [IconIds.Globus];
	}

	return marketsData.filter(
		v => arr.some(id => v.id === id),
	).map(v => v.icon);
});

function toggleImpact(id: Impact) {
	impactState.value = toggleSet(impactState.value, id);
}

const selectedWatchlistSection = computed(() => {
	if (watchlistIdState.value === null) {
		return null;
	}

	return props.watchlists.find(v => v.id === watchlistIdState.value)?.sections ?? null;
});

function updateWatchlistCatalog(id: string) {
	watchlistSectionState.value = null;

	if (watchlistIdState.value === id) {
		watchlistIdState.value = null;

		return;
	}

	watchlistIdState.value = id;
}

function selectWatchlistSection(name: string) {
	if (watchlistSectionState.value === name) {
		watchlistSectionState.value = null;

		return;
	}

	watchlistSectionState.value = name;
}

const startDate = computed(() => props.weekDays[0].date);
const endDate = computed(() => props.weekDays[props.weekDays.length - 1].date);

const label = computed(() => {
	const sameYear = startDate.value.getFullYear() === endDate.value.getFullYear();
	const fmtNoYear = new Intl.DateTimeFormat(props.locale, { month: 'short', day: 'numeric' });
	const fmtWithYear = new Intl.DateTimeFormat(props.locale, { month: 'short', day: 'numeric', year: 'numeric' });

	const left = sameYear ? fmtNoYear.format(startDate.value) : fmtWithYear.format(startDate.value);
	const right = fmtWithYear.format(endDate.value);

	return `${left} — ${right}`;
});
</script>

<template>
	<div :class="classes.calendarToolbar">
		<div :class="classes.toolbarStart">
			<modal-badge-dropdown
				class="market-modal"
				display-variant="default"
			>
				<template #title>
					<span
						v-for="icon in marketIcons.slice(0, 3)"
						:key="icon"
						:class="classes.iconBorder"
					>
						<ui-icon
							:id="icon"
							width="12px"
							height="12px"
						/>
					</span>

					<span>
						{{ marketLabel }}
					</span>
				</template>
				<template #content>
					<markets-modal v-model="countryState" :markets="props.markets" />
				</template>
			</modal-badge-dropdown>

			<ui-delimiter />

			<calendar-toolbar-start-minified
				v-model:impact-state="impactState"
				v-model:event-state="eventState"
				v-model:watchlist-id-state="watchlistIdState"
				v-model:watchlist-section-state="watchlistSectionState"
				:watchlists="props.watchlists"
				:selected-watchlist-section="selectedWatchlistSection"
				:event-types="props.eventTypes"
				:impacts="props.impacts"
				:class="classes.minified"
				@select-watchlist-section="selectWatchlistSection"
				@update-watchlist-catalog="updateWatchlistCatalog"
				@toggle-impact="toggleImpact"
			/>

			<calendar-toolbar-start-maximized
				v-model:impact-state="impactState"
				v-model:event-state="eventState"
				v-model:watchlist-id-state="watchlistIdState"
				v-model:watchlist-section-state="watchlistSectionState"
				:watchlists="props.watchlists"
				:selected-watchlist-section="selectedWatchlistSection"
				:event-types="props.eventTypes"
				:impacts="props.impacts"
				:class="classes.maximized"
				@select-watchlist-section="selectWatchlistSection"
				@update-watchlist-catalog="updateWatchlistCatalog"
				@toggle-impact="toggleImpact"
			/>

			<modal-badge
				class="date-modal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<ui-icon
						:id="IconIds.CalendarV2"
						width="20px"
						height="20px"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>
				<template #content>
					<modal-submenu-content>
						<template #content>
							<calendar-range-select
								v-model="range"
								view="weekly"
							/>
						</template>

					</modal-submenu-content>
				</template>
			</modal-badge>
		</div>

		<calendar-toolbar-end
			:date-label="label"
			:base-date="baseDate"
			:initial-date="initialDate"
			@prev-week="emits('prev-week')"
			@next-week="emits('next-week')"
			@reset-week="emits('reset-week')"
		>
			<span :class="classes.label">{{label}}</span>
		</calendar-toolbar-end>
	</div>
</template>

<style module="classes">
.calendarToolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	width: 100%;
	container-type: inline-size;
	container-name: toolbar;
}

.toolbarStart {
	display: flex;
	align-items: center;
	gap: 8px;
}

.modalItem {
	display: flex;
	align-items: center;
	gap: 6px;
}

.iconWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	outline: 1px solid rgb(44 44 44 / 100%);
}

.iconBorder {
	display: grid;
	width: 14px;
	height: 14px;
	line-height: 0;
	background: #19191a;
	border: 0.5px solid var(--color-border-surface-02, rgb(199 199 199 / 10%));
	border-radius: var(--radius-full, 9999px);
	backdrop-filter: blur(5px);
	place-items: center;

	&:not(:first-child) {
		margin-left: -9px;
	}
}

.label {
	display: block;
}

.minified {
	display: none;
}

.maximized {
	display: contents;
}

@container toolbar (max-width: 624px) {
	.minified {
		display: contents;
	}

	.maximized {
		display: none;
	}
}

@container toolbar (max-width: 452px) {
	.label {
		display: none;
	}
}
</style>
