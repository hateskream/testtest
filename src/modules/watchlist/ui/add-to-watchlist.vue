<script setup lang="ts">
import { UiPosition } from '@/shared/ui/position';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { isOnWatchlist, type IWatchlistAction, type IWatchlistData } from '../model';
import { ModalBadgeList, ModalItem, ModalItemSelector } from '@/modules/widgets/base';

interface IProps {
	watchlists: IWatchlistData[];
	tickerId: string;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IProps>();

const emits = defineEmits<{
	(e: 'add-to-watchlist', watchlists: IWatchlistAction): void;
	(e: 'remove-from-watchlist', watchlists: IWatchlistAction): void;
	(e: 'add-to-new-watchlist', tickerId: string): void;
}>();

function clickRowAction(watchlist: IWatchlistData, tickerId: string) {
	const payload: IWatchlistAction = {
		watchlistId: watchlist.watchlistId,
		tickerId,
	};

	if (isOnWatchlist(watchlist, tickerId)) {
		emits('remove-from-watchlist', payload);
	} else {
		emits('add-to-watchlist', payload);
	}
}
</script>

<template>
	<ui-position>
		<template #title>
			<div
				:class="classes.favorite"
			>
				<ui-icon
					:id="IconIds.Favorite"
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

				<modal-item @click="emits('add-to-new-watchlist', props.tickerId)">
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
