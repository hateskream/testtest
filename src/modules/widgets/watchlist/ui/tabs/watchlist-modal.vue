<script setup lang="ts">
import { ModalBadgeList, ModalItem, ModalSubmenu } from '@/modules/widgets/base';
import { type ITab, TabAction, tabActionToTitle } from '@/modules/widgets/watchlist/model';
import {
	decodeCanonicalTickerId,
	type ITickerItem,
	SelectionMode,
	TickerSelectorModal,
} from '@/modules/ticker-selector';
import { UiPosition } from '@/shared/ui/position';
import { UiDriver } from '@/shared/ui/driver';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ALL_MARKET_TYPES, MarketType } from '@/modules/market';

import WatchlistModalTitle from './watchlist-modal-title.vue';

interface ITabWithEditing extends ITab {
	isEditing: boolean;
}

const props = defineProps<{
	tabs: ITabWithEditing[];
	selectedTickers: string[];
	displayVariant: 'new' | 'default';
}>();

const emits = defineEmits<{
	onClickAction: [TabAction, string];
	switchTab: [string];
	selectTicker: [{
		tickerId: string;
		marketType: MarketType;
	}];
	removeTicker: [{
		tickerId: string;
	}];
	rename: [id: string, name: string];
}>();

function onClickAction(action: TabAction, id: string) {
	emits('onClickAction', action, id);
}

function selectTicker(ticker: ITickerItem) {
	emits('selectTicker', {
		tickerId: ticker.canonical_ticker_id,
		marketType: ticker.market_type,
	});
}

function unselectTicker(ticker: ITickerItem) {
	emits('removeTicker', { tickerId: ticker.canonical_ticker_id });
}
</script>

<template>
	<modal-badge-list :display-variant>
		<template #title>
			Watchlists
		</template>
		<template #default>
			<modal-submenu
				v-for="tab in props.tabs"
				:key="tab.id"
				trigger="hover"
				:teleport="false"
				@click="emits('switchTab', tab.id)"
			>
				<template #title>
					<div :class="classes.title">
						<watchlist-modal-title
							:tab="tab"
							@rename="(id, name) => emits('rename', id, name)"
						/>

						<ui-icon
							v-if="tab.isActive"
							:id="IconIds.Checkbox"
						/>
					</div>
				</template>
				<template #content>
					<modal-badge-list :display-variant>
						<modal-item
							@click.stop="onClickAction(TabAction.Rename, tab.id)"
						>
							<span :class="classes.menuActionTitle">
								{{ tabActionToTitle[TabAction.Rename] }}
							</span>
						</modal-item>

						<modal-item
							@click.stop="onClickAction(TabAction.Duplicate, tab.id)"
						>
							<span :class="classes.menuActionTitle">
								{{ tabActionToTitle[TabAction.Duplicate] }}
							</span>
						</modal-item>

						<modal-item
							@click.stop="onClickAction(TabAction.AddSymbolsToList, tab.id)"
						>
							<ui-position
								strategy="absolute"
								trigger="hover"
							>
								<template #title>
									<span :class="classes.menuActionTitle">
										{{ tabActionToTitle[TabAction.AddSymbolsToList] }}
									</span>
								</template>
								<template #content>
									<ticker-selector-modal
										:display-variant="props.displayVariant"
										:enabled-markets="ALL_MARKET_TYPES"
										:selected-tickers="props.selectedTickers.map(decodeCanonicalTickerId)"
										:selection-mode="SelectionMode.Single"
										:enable-select-all="false"
										@ticker-selected="selectTicker"
										@ticker-unselected="unselectTicker"
									/>
								</template>
							</ui-position>
						</modal-item>

						<ui-driver />

						<modal-item
							@click.stop="onClickAction(TabAction.Delete, tab.id)"
						>
							<span :class="classes.menuActionTitle">
								{{ tabActionToTitle[TabAction.Delete] }}
							</span>
						</modal-item>
					</modal-badge-list>
				</template>
			</modal-submenu>
		</template>
	</modal-badge-list>
</template>

<style module="classes">
.menuActionTitle {
	text-transform: capitalize;
	cursor: pointer;
}

.title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding-right: 14px;
}
</style>
