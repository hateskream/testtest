<script setup lang="ts">
import { computed } from 'vue';

import {
	ModalBadge,
	ModalBadgeList,
	ModalItemCheckbox,
	ModalItemSelector,
	ModalSubmenu,
	ModalSubmenuContent,
} from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalTitle } from '@/shared/ui/modal-title';
import { UiDriver } from '@/shared/ui/driver';
import type { IEventBoardRange, IMarketData } from '@/modules/calendar/types';
import { EventType, Impact, isSameWeek, MarketIds } from '@/modules/calendar';
import type { IWatchlist } from '@/modules/watchlist';

import CalendarWeekRangeSelect from '@/modules/calendar/ui/calendar-week-range-select.vue';

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

const countryState = defineModel<MarketIds>('country-state', { required: true });
const impactState = defineModel<Impact>('impact-state', { required: true });
const eventState = defineModel<EventType>('event-state', { required: true });
const watchlistIdState = defineModel<string | null>('watchlist-id-state', { required: true });
const watchlistSectionState = defineModel<string | null>('watchlist-section-state', { required: true });

const range = defineModel<IEventBoardRange>('range-state', { required: true });

const selectedCountry = computed({
	set: (market: IMarketData) => {
		countryState.value = market.id;
	},
	get: () => {
		return props.markets.find(market => market.id === countryState.value);
	},
});

const selectedWatchlistSection = computed(() => {
	if (watchlistIdState.value === null) {
		return null;
	}

	return props.watchlists.find(v => v.id === watchlistIdState.value)?.sections;
});

function updateSelectedWatchlistCatalogId(id: string) {
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
			<modal-badge
				class="market-modal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<ui-icon
						v-if="selectedCountry"
						:id="selectedCountry.icon"
						width="10px"
						height="10px"
					/>
					<span>
						{{ selectedCountry && selectedCountry.label }}
					</span>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>Markets</template>
						<template #default>
							<modal-item-selector
								v-for="market in props.markets"
								:key="market.label"
								:model-value="selectedCountry?.id === market.id"
								@update:model-value="selectedCountry = market"
							>
								<div :class="classes.modalItem">
									<div :class="classes.iconWrapper">
										<ui-icon
											:id="market.icon"
											width="14px"
											height="14px"
										/>
									</div>
									<span>
										{{market.label}}
									</span>
								</div>
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge :class="classes.filterModal">
				<template #title>
					<ui-icon
						:id="IconIds.Burger"
						width="12px"
						height="12px"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<modal-title>
							Filters
						</modal-title>

						<modal-submenu>
							<template #title>
								Watchlist
							</template>
							<template #content>
								<modal-submenu-content>
									<template #content>
										<modal-item-selector
											v-for="watchlistItem in props.watchlists"
											:key="watchlistItem.id"
											:model-value="watchlistIdState === watchlistItem.id"
											@click="updateSelectedWatchlistCatalogId(watchlistItem.id)"
										>
											{{watchlistItem.name}}
										</modal-item-selector>

										<ui-driver />

										<template v-if="selectedWatchlistSection">
											<modal-title>
												Created Lists
											</modal-title>
											<modal-item-selector
												v-for="section in selectedWatchlistSection"
												:key="section.id"
												:model-value="watchlistSectionState === section.name"
												@click="selectWatchlistSection(section.name)"
											>
												{{section.name}}
											</modal-item-selector>
										</template>
									</template>
								</modal-submenu-content>
							</template>
						</modal-submenu>

						<modal-submenu>
							<template #title>
								Event type
							</template>
							<template #content>
								<modal-badge-list>
									<template #default>
										<modal-item-checkbox
											v-for="(event, index) in props.eventTypes"
											:key="index"
											:model-value="event === eventState"
											@update:model-value="eventState = event"
										>
											{{event}}
										</modal-item-checkbox>
									</template>
								</modal-badge-list>
							</template>
						</modal-submenu>

						<modal-submenu>
							<template #title>
								Impact
							</template>
							<template #content>
								<modal-submenu-content>
									<template #content>
										<modal-item-checkbox
											v-for="(propImpact, index) in props.impacts"
											:key="index"
											:model-value="impactState === propImpact"
											@update:model-value="impactState = propImpact"
										>
											{{propImpact}}
										</modal-item-checkbox>
									</template>
								</modal-submenu-content>
							</template>
						</modal-submenu>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge
				v-if="watchlists.length"
				:class="classes.watchlistModal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<span>Watchlist</span>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<modal-title>
							Watchlist
						</modal-title>
						<modal-item-selector
							v-for="watchlistItem in props.watchlists"
							:key="watchlistItem.id"
							:model-value="watchlistIdState === watchlistItem.id"
							@click="updateSelectedWatchlistCatalogId(watchlistItem.id)"
						>
							{{watchlistItem.name}}
						</modal-item-selector>

						<ui-driver />

						<template v-if="selectedWatchlistSection">
							<modal-title>
								Created Lists
							</modal-title>
							<modal-item-selector
								v-for="section in selectedWatchlistSection"
								:key="section.id"
								:model-value="watchlistSectionState === section.name"
								@click="selectWatchlistSection(section.name)"
							>
								{{section.name}}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge
				:class="classes.eventTypeModal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<span>Event Type</span>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>

				<template #content>
					<modal-badge-list>
						<template #default>
							<modal-item-checkbox
								v-for="(event, index) in props.eventTypes"
								:key="index"
								:model-value="event === eventState"
								@update:model-value="eventState = event"
							>
								{{event}}
							</modal-item-checkbox>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge
				:class="classes.impactModal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<span>Impact</span>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>
							Impact
						</template>
						<template #default>
							<modal-item-checkbox
								v-for="(propImpact, index) in props.impacts"
								:key="index"
								:model-value="impactState === propImpact"
								@update:model-value="impactState = propImpact"
							>
								{{propImpact}}
							</modal-item-checkbox>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge
				class="date-modal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<ui-icon
						:id="IconIds.Calendar"
						width="12px"
						height="12px"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>
				<template #content>
					<modal-submenu-content>
						<template #content>
							<calendar-week-range-select v-model="range" />
						</template>

					</modal-submenu-content>
				</template>
			</modal-badge>
		</div>

		<div :class="classes.toolbarEnd">
			<button
				:class="[classes.nav]"
				@click="emits('prev-week')"
			>
				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
					:class="['dropdown-icon']"
				/>
			</button>

			<button
				v-if="!isSameWeek(props.baseDate, props.initialDate)"
				:class="classes.nav"
				@click="emits('reset-week')"
			>
				<ui-icon
					:id="IconIds.Calendar"
					width="12"
					height="12"
					:class="['dropdown-icon', classes.calendarIcon]"
				/>
				<span :class="classes.redDot" />
			</button>

			<button :class="[classes.nav, classes.rotated]" @click="emits('next-week')">
				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
					:class="['dropdown-icon']"
				/>
			</button>
			<div :class="classes.label">{{ label }}</div>
		</div>
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

.filterModal {
	display: none;
}

.iconWrapper {
	display: grid;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	outline: 1px solid rgb(44 44 44 / 100%);
	place-items: center;
}

.toolbarEnd {
	display: flex;
	flex-shrink: 0;
	justify-content: end;
	align-items: center;
	color: #eeeeee;
}

.label {
	margin-left: 12px;
	font-weight: 600;
	font-size: 0.875rem;
}

.nav {
	position: relative;
	display: grid;
	width: 2rem;
	height: 2rem;
	color: inherit;
	background: transparent;
	border: none;
	border-radius: 0.5rem;
	cursor: pointer;
	place-items: center;

	&:first-child {
		transform: rotate(90deg);
	}
}

.rotated {
	transform: rotate(-90deg);
}

.redDot {
	position: absolute;
	right: 8px;
	bottom: 8px;
	width: 6px;
	height: 6px;
	background-color: rgb(230 0 0 / 100%);
	border-radius: 50%;
}

.nav:hover {
	background: #1a1a1a;
}

@container toolbar (max-width: 624px) {
	.watchlistModal,
	.eventTypeModal,
	.impactModal {
		display: none;
	}

	.filterModal {
		display: unset;
	}
}

@container toolbar (max-width: 452px) {
	.label {
		display: none;
	}
}
</style>
