<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';


import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeList, ModalItem } from '@/modules/widgets/base';
import {
	TabAction,
	tabActionToTitle,
	type ITab,
	type ITickerAddPayload,
	type ITickerRemovePayload,
} from '@/modules/widgets/watchlist/model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiDriver } from '@/shared/ui/driver';
import { ModalTickerSelector } from '@/modules/ticker-selector';
import { resolveMarketTypeFromTicker } from '@/modules/cell';

import WatchlistTab from './watchlist-tab.vue';

interface ITabWithEditing extends ITab {
	isEditing: boolean;
}

interface ITabsComponentProps {
	tabs: ITab[];
	selectedTickers: string[];
}

const props = defineProps<ITabsComponentProps>();

const emit = defineEmits<{
	(event: 'add-tab'): void;
	(event: 'switch-tab', id: string): void;
	(event: 'rename-tab', id: string, name: string): void;
	(event: 'duplicate-tab', id: string): void;
	(event: 'delete-tab', id: string): void;
	(event: 'add-ticker', payload: ITickerAddPayload): void;
	(event: 'remove-ticker', payload: ITickerRemovePayload): void;
}>();

const actionToCb: Record<TabAction, (id: string) => void> = {
	[TabAction.Duplicate]: (id: string) => emit('duplicate-tab', id),
	[TabAction.Rename]: startEditing,
	[TabAction.AddSymbolsToList]: (_: string) => { },
	[TabAction.Delete]: (id: string) => emit('delete-tab', id),
};

const positionRefs = useTemplateRef<InstanceType<typeof UiPosition>[]>('positionRefs');

const localTabs = ref<ITabWithEditing[]>([]);

watch(
	() => props.tabs,
	(newTabs) => {
		if (localTabs.value.length === 0) {
			localTabs.value = initTabs(newTabs);
			return;
		}

		const tabs = newTabs.map(tab => ({
			...tab,
			isEditing: !localTabs.value.find(localTab => localTab.id === tab.id),
		}));

		localTabs.value = tabs;
	},
	{
		immediate: true,
	},
);

function initTabs(tabs: ITab[]): ITabWithEditing[] {
	return tabs.map(tab => ({
		...tab,
		isEditing: false,
	}));
}

function startEditing(tabId: string) {
	localTabs.value = localTabs.value.map(tab => ({
		...tab,
		isEditing: tab.id === tabId,
	}));
}

function onClickAction(action: TabAction, tabId: string) {
	actionToCb[action](tabId);
}

function onAddTab() {
	emit('add-tab');
}

function onSwitchTab(id: string) {
	emit('switch-tab', id);
}

function onRenameTab(id: string, name: string) {
	emit('rename-tab', id, name);
}

function openModal(index: number) {
	positionRefs.value?.[index].handleClick();
};

function selectTicker(tickerId: string) {
	const marketType = resolveMarketTypeFromTicker(tickerId);
	if (!marketType) {
		return;
	}

	emit('add-ticker',
		{
			tickerId,
			tickerType: marketType,
		},
	);
}

</script>

<template>
	<div :class="classes.watchlistToolbar">
		<div :class="classes.tabGroup">
			<div v-for="(tab, index) in localTabs" :key="tab.id">
				<ui-position
					ref="positionRefs"
					position="bottom-start"
				>
					<template #title="{ isVisible }">
						<watchlist-tab
							:tab="tab"
							:is-open="isVisible"
							@rename="onRenameTab"
							@switch="onSwitchTab"
							@open-modal="openModal(index)"
						/>
					</template>

					<template #content>
						<modal-badge-list>
							<template #title>{{ tab.name }}</template>
							<modal-item
								@click="onClickAction(TabAction.Rename, tab.id)"
							>
								<span :class="classes.menuActionTitle">
									{{ tabActionToTitle[TabAction.Rename] }}
								</span>
							</modal-item>
							<modal-item
								@click="onClickAction(TabAction.Duplicate, tab.id)"
							>
								<span :class="classes.menuActionTitle">
									{{ tabActionToTitle[TabAction.Duplicate] }}
								</span>
							</modal-item>
							<modal-item
								@click="onClickAction(TabAction.AddSymbolsToList, tab.id)"
							>
								<ui-position
									strategy="absolute"
								>
									<template #title>
										<span :class="classes.menuActionTitle">
											{{ tabActionToTitle[TabAction.AddSymbolsToList] }}
										</span>
									</template>
									<template #content>
										<modal-ticker-selector
											:model-value="selectedTickers"
											:enable-select-all="false"
											@select="selectTicker"
											@unselect="emit('remove-ticker', { tickerId: $event })"
										/>
									</template>
								</ui-position>
							</modal-item>

							<ui-driver />

							<modal-item
								@click="onClickAction(TabAction.Delete, tab.id)"
							>
								<span :class="classes.menuActionTitle">
									{{ tabActionToTitle[TabAction.Delete] }}
								</span>
							</modal-item>
						</modal-badge-list>
					</template>
				</ui-position>
			</div>

			<div :class="classes.addTabAction">
				<ui-icon
					:id="IconIds.ControlPlus"
					:class="classes.addTabActionIcon"
					width="20px"
					height="20px"
					@click="onAddTab"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.watchlistToolbar {
	display: flex;
	align-items: center;
	height: 40px;
	overflow: hidden;
	border-radius: 9999px;
}

.tabGroup {
	display: inline-flex;
	align-items: center;
	max-width: 100%;
	padding: 2px;
	overflow-x: auto;
	background: var(--bg-color-base-300);
	border-radius: 9999px;
	gap: 4px;
}

.addTabAction {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 32px;
	padding-right: 4px;
}

.addTabActionIcon {
	color: var(--icon-color-base-300);
	cursor: pointer;
}


.menuActionTitle {
	text-transform: capitalize;
	cursor: pointer;
}
</style>
