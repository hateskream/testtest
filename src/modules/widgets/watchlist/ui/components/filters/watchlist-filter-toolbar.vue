<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useWatchlistStore } from '../../../stores';
import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeList, ModalBadge } from '../../../../base';

import WatchlistCategoryFilter from './watchlist-category-filter.vue';

const watchlistStore = useWatchlistStore();
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.iconAllFilter">
			<ui-position>
				<template #default>
					<ui-icon
						:id="IconIds.NewsFilter"
						width="20"
						height="20"
						:class="classes.iconAllFilterColor"
					/>
				</template>

				<template #content>
					<modal-badge-list>
						<template #title> Фильтры </template>

						<modal-badge
							:model-value="watchlistStore.isFavorites"
							@update:model-value="watchlistStore.toggleFavorites"
						>
							Избранное
						</modal-badge>

						<watchlist-category-filter />
					</modal-badge-list>
				</template>
			</ui-position>
		</div>
	</div>
</template>

<style module="classes">
.container {
	padding-inline: 15px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.iconAllFilter {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	cursor: pointer;
}

.iconAllFilterColor {
	color: var(--color-text-secondary);
}
</style>
