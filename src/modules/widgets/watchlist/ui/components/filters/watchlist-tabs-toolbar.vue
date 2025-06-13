<script setup lang="ts">
import { ref } from 'vue';

import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeList, ModalItem } from '@/modules/widgets/base';
import type { ITabMenuActions, TabMenuAction } from '@/modules/widgets/watchlist/model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useWatchlistTabsStore } from '../../../stores/watchlist-tabs.store';

import WatchlistTab from './watchlist-tab.vue';

const tabsStore = useWatchlistTabsStore();

const tabs = ref(tabsStore.tabs);

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

const onTabMenuAction = (tabId: string, actionName: TabMenuAction) => {
	// eslint-disable-next-line no-console
	console.log(`Tab id: ${tabId};\nAction name: ${actionName}`);
	// TODO: implement
};

</script>

<template>
	<div :class="classes.container">
		<div v-for="tab in tabs" :key="tab.id">
			<ui-position
				ref="position"
				position="bottom-start"
			>
				<template #default="{ isVisible }">
					<watchlist-tab :tabs="tab" :is-open="isVisible" />
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
				@click="tabsStore.addTab"
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
