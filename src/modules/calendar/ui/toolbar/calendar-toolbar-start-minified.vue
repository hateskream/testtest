<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	ModalBadgeList,
	ModalItemCheckbox,
	ModalItemSelector,
	ModalSubmenu,
	ModalSubmenuContent,
} from '@/modules/widgets/base';
import { UiDriver } from '@/shared/ui/driver';
import { UiPosition } from '@/shared/ui/position';
import { ModalTitle } from '@/shared/ui/modal-title';
import type { ISection, IWatchlist } from '@/modules/watchlist';
import { EventType, EventTypeModal, Impact } from '@/modules/calendar';
import { formattedLabel, isAllSelected, toggleAllSelect } from '@/modules/calendar/utils/toolbar.ts';

const props = defineProps<{
	selectedWatchlistSection: ISection[] | null;
	watchlists: IWatchlist[];
	eventTypes: EventType[];
	impacts: Impact[];
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
	<ui-position :class="classes.filterModal">
		<template #title>
			<ui-icon
				:id="IconIds.Burger"
				width="16px"
				height="16px"
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
							</template>
						</modal-submenu-content>
					</template>
				</modal-submenu>

				<modal-submenu>
					<template #title>
						{{
							formattedLabel(Array.from(eventState), Object.values(EventType), 'All', 'Event Type')
						}}
					</template>
					<template #content>
						<event-type-modal v-model="eventState" :event-types="props.eventTypes" />
					</template>
				</modal-submenu>

				<modal-submenu>
					<template #title>
						{{
							formattedLabel(Array.from(impactState), Object.values(Impact), 'All', 'Impact')
						}}
					</template>
					<template #content>
						<modal-submenu-content>
							<template #content>
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
						</modal-submenu-content>
					</template>
				</modal-submenu>
			</modal-badge-list>
		</template>
	</ui-position>
</template>

<style module="classes">
.filterModal {
	cursor: pointer;
}
</style>
