<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';


import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeList, ModalItem } from '@/modules/widgets/base';
import type { ITabMenuActions, TabMenuAction } from '@/modules/widgets/watchlist/model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useWatchlistTabsStore } from '../../../stores/watchlist-tabs.store';

import WatchlistTab from './watchlist-tab.vue';

const tabsStore = useWatchlistTabsStore();

const tabs = ref(tabsStore.tabs);
const positionRefs = useTemplateRef<InstanceType<typeof UiPosition>[]>('positionRefs');
const watchlistTabRefs = useTemplateRef<InstanceType<typeof WatchlistTab>[]>('watchlistTabRefs');
const tabMenuActions = ref<ITabMenuActions[]>([
	{
		name: 'rename',
		title: 'Rename',
	},
	{
		name: 'share',
		title: 'Share',
	},
	{
		name:'duplicate',
		title: 'Duplicate',
	},
	{
		name:'addAlert',
		title: 'Add alert',
	},
	{
		name: 'addSymbolsToList',
		title: 'Add symbols to list',
	},
]);


const handleRenameTab = async (index?: number) => {
	await nextTick();
	if (!watchlistTabRefs.value) {
		return;
	}

	const idx = index ?? watchlistTabRefs.value.length - 1;
	watchlistTabRefs.value[idx]?.openRenameInput();
};

const onTabMenuAction = (tabId: string, actionName: TabMenuAction) => {
	// eslint-disable-next-line no-console
	console.log(`Tab id: ${tabId};\nAction name: ${actionName}`);

	const actions: Record<TabMenuAction, () => void> = {
		rename: () => {
			tabsStore.startRenameState(tabId);
			tabsStore.tabs.forEach((tab, index) => {
				tab.id === tabId && handleRenameTab(index);
			});
		},
		share: () => null,
		duplicate: () => tabsStore.duplicateTab(tabId),
		addAlert: () => null,
		addSymbolsToList: () => null,
	};

	actions[actionName]();
};

const handleAddTab = async () => {
	tabsStore.addTab();

	handleRenameTab();
};

const onTabClick = (index: number) => {
	positionRefs.value?.[index].handleClick();
};

</script>

<template>
	<div :class="classes.container">
		<div v-for="(tab, index) in tabs" :key="tab.id">
			<ui-position
				ref="positionRefs"
				position="bottom-start"
			>
				<template #default="{ isVisible }">
					<watchlist-tab
						ref="watchlistTabRefs"
						:tab="tab"
						:is-open="isVisible"
						@click="onTabClick(index)"
					/>
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>{{ tab.name }}</template>


						<modal-item
							v-for="action in tabMenuActions"
							:key="action.name"
							@click="onTabMenuAction(tab.id, action.name)"
						>
							<span :class="classes.menuActionTitle">{{ action.title }}</span>
						</modal-item>
					</modal-badge-list>
				</template>
			</ui-position>
		</div>

		<div>
			<ui-icon
				:id="IconIds.ControlPlus"
				:class="classes.icon"
				width="20px"
				height="20px"
				@click="handleAddTab"
			/>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.icon {
	color: var(--icon-color-base-300);
	cursor: pointer;
}


.menuActionTitle {
	text-transform: capitalize;
	cursor: pointer;
}
</style>
