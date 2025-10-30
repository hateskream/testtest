<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalBadge, ModalBadgeList, ModalItemCheckbox, ModalItemSelector } from '@/modules/widgets/base';
import { UiDriver } from '@/shared/ui/driver';
import { ModalTitle } from '@/shared/ui/modal-title';
import type { ISection, IWatchlist } from '@/modules/watchlist';
import { EventType, Impact } from '@/modules/calendar';
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
		<modal-badge
			v-if="watchlists.length"
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
		</modal-badge>

		<modal-badge
			strategy="absolute"
		>
			<template #title="{ isVisible }">
				<span>
					{{
						formattedLabel(Array.from(eventState), Object.values(EventType), 'All', 'Event Type')
					}}
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
					<template #title>
						Event Type
					</template>

					<template #default>
						<modal-item-checkbox
							:model-value="isAllSelected(eventState, Object.values(EventType))"
							@click="eventState = toggleAllSelect(eventState, Object.values(EventType))"
						>
							All
						</modal-item-checkbox>

						<modal-item-checkbox
							v-for="(event, index) in props.eventTypes"
							:key="index"
							:model-value="eventState.has(event)"
							@click="emits('toggleEventType', event)"
						>
							{{event}}
						</modal-item-checkbox>
					</template>
				</modal-badge-list>
			</template>
		</modal-badge>

		<modal-badge
			strategy="absolute"
		>
			<template #title="{ isVisible }">
				<span>
					{{
						formattedLabel(Array.from(impactState), Object.values(Impact), 'All', 'Impact')
					}}
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
		</modal-badge>
	</div>
</template>
