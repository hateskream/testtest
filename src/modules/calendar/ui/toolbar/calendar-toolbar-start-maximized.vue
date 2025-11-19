<script setup lang="ts">
import {
	ModalBadgeDropdown,
	ModalBadgeList,
	ModalItemCheckbox,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { UiDriver } from '@/shared/ui/driver';
import { ModalTitle } from '@/shared/ui/modal-title';
import type { ISection, IWatchlist } from '@/modules/watchlist';
import { EventType, EventTypeModal, Impact } from '@/modules/calendar';
import { formattedLabel, isAllSelected, toggleAllSelect } from '@/modules/calendar/utils/toolbar.ts';

const props = defineProps<{
	watchlists: IWatchlist[];
	eventTypes: EventType[];
	impacts: Impact[];
	selectedWatchlistSection: ISection[] | null;
}>();

const impactState = defineModel<Set<Impact>>('impactState', { required: true });
const eventState = defineModel<Set<EventType>>('eventState', { required: true });
const watchlistIdState = defineModel<string | null>('watchlistIdState', { required: true });
const watchlistSectionState = defineModel<string | null>('watchlistSectionState', { required: true });

const emits = defineEmits<{
	updateWatchlistCatalog: [string];
	selectWatchlistSection: [string];
	toggleImpact: [Impact];
	toggleEventType: [EventType];
}>();
</script>

<template>
	<div>
		<modal-badge-dropdown
			v-if="watchlists.length"
			strategy="absolute"
			display-variant="default"
		>
			<template #title>
				<span>Watchlist</span>
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
						@click="emits('updateWatchlistCatalog', watchlistItem.id)"
					>
						{{watchlistItem.name}}
					</modal-item-selector>

					<template v-if="selectedWatchlistSection">
						<ui-driver />

						<modal-title>
							Created Lists
						</modal-title>
						<modal-item-selector
							v-for="section in selectedWatchlistSection"
							:key="section.id"
							:model-value="watchlistSectionState === section.name"
							@click="emits('selectWatchlistSection', section.name)"
						>
							{{section.name}}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</modal-badge-dropdown>

		<modal-badge-dropdown display-variant="default">
			<template #title>
				<span>
					{{
						formattedLabel(Array.from(eventState), Object.values(EventType), 'All', 'Event Type')
					}}
				</span>
			</template>

			<template #content>
				<event-type-modal
					v-model="eventState"
					:event-types="props.eventTypes"
				/>
			</template>
		</modal-badge-dropdown>

		<modal-badge-dropdown
			display-variant="default"
		>
			<template #title>
				<span>
					{{
						formattedLabel(Array.from(impactState), Object.values(Impact), 'All', 'Impact')
					}}
				</span>
			</template>

			<template #content>
				<modal-badge-list>
					<template #title>
						Impact
					</template>
					<template #default>
						<modal-item-checkbox
							:model-value="isAllSelected(impactState, Object.values(Impact))"
							@click="impactState = toggleAllSelect(impactState, Object.values(Impact))"
						>
							All
						</modal-item-checkbox>

						<modal-item-checkbox
							v-for="(propImpact, index) in props.impacts"
							:key="index"
							:model-value="impactState.has(propImpact)"
							@click="emits('toggleImpact', propImpact)"
						>
							{{propImpact}}
						</modal-item-checkbox>
					</template>
				</modal-badge-list>
			</template>
		</modal-badge-dropdown>
	</div>
</template>
