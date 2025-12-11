<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { onLongPress } from '@vueuse/core';

import { UiPosition } from '@/shared/ui/position';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { isOnFavoritesWatchlist, isOnWatchlist, type IWatchlistAction, type IWatchlistData } from '../model';
import { ModalBadgeList, ModalItem, ModalItemSelector } from '@/modules/widgets/base';
import { isFeatureEnabled } from '@/shared/lib';

interface IProps {
	watchlists: IWatchlistData[];
	tickerId: string;
	displayVariant: 'default' | 'new';
}

const isEnabled = isFeatureEnabled('SHOW_DASHBOARD_WATCHLIST');

const props = defineProps<IProps>();

const emit = defineEmits<{
	(e: 'add-to-watchlist', watchlists: IWatchlistAction): void;
	(e: 'remove-from-watchlist', watchlists: IWatchlistAction): void;
	(e: 'add-to-new-watchlist', tickerId: string): void;
	(e: 'toggle-favorite'): void;
}>();

function clickRowAction(watchlist: IWatchlistData, tickerId: string) {
	const payload: IWatchlistAction = {
		watchlistId: watchlist.watchlistId,
		tickerId,
	};

	if (isOnWatchlist(watchlist, tickerId)) {
		emit('remove-from-watchlist', payload);
	} else {
		emit('add-to-watchlist', payload);
	}
}

// favorites

const isFavoriteTicker = computed(() =>isOnFavoritesWatchlist(props.watchlists, props.tickerId));

function onMouseUp(_duration: number, _distance: number, isLongPress: boolean) {
	if (!isLongPress) {
		emit('toggle-favorite');
	}
}

onLongPress(useTemplateRef('favorite'), () => {}, { onMouseUp });
</script>

<template>
	<ui-position v-if="isEnabled">
		<template #title>
			<div ref="favorite" :class="classes.favorite">
				<ui-icon
					:id="isFavoriteTicker ? IconIds.FavoriteFill : IconIds.Favorite"
					width="16px"
					height="16px"
				/>
			</div>
		</template>
		<template #content>
			<modal-badge-list :display-variant>
				<template #title>Add to watchlist</template>

				<template v-for="watchlist in props.watchlists" :key="watchlist.tabId">
					<modal-item-selector
						:model-value="isOnWatchlist(watchlist, props.tickerId)"
						@update:model-value="clickRowAction(watchlist, props.tickerId)"
					>
						{{ watchlist.name }}
					</modal-item-selector>
				</template>

				<modal-item @click="emit('add-to-new-watchlist', props.tickerId)">
					<div :class="classes.new">
						<ui-icon
							:id="IconIds.Plus"
						/>
						New
					</div>
				</modal-item>
			</modal-badge-list>
		</template>
	</ui-position>
</template>

<style module="classes">
.favorite {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 20px;
	height: 20px;
	color: var(--text-color-base-300);
	cursor: pointer;
	transition: color 0.2s ease-in;

	&:hover {
		color: var(--text-color-base-300-effect);
	}
}

.new {
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
}
</style>
