<script setup lang="ts">
import {
	RcmDashboard,
	RcmDriver,
	RcmItem,
	RcmNumber,
	RcmSubmenu,
	RcmSubmenuContent,
	RcmSwitch,
} from '../../rcm';
import type { IRcmPositions } from '../../rcm/model';
import { useNewsStore } from '../stores';

import NewsFilters from './news-filters-component.vue';

interface IProps {
	positions: IRcmPositions;
}

defineProps<IProps>();

const newsStore = useNewsStore();
</script>

<template>
	<rcm-dashboard :positions="positions">
		<template #title> News </template>
		<template #content>
			<rcm-number :value="1">Duplicate</rcm-number>
			<rcm-number :value="2">Open in new tab</rcm-number>
			<rcm-number :value="3">Wrap in stack</rcm-number>
			<rcm-item>Move to</rcm-item>

			<rcm-driver />

			<rcm-submenu>
				<template #title> Change display </template>

				<template #content>
					<rcm-submenu-content>
						<template #content>
							<rcm-switch
								:model-value="newsStore.isShowDate"
								@update:model-value="newsStore.toggleShowDate"
							>
								Date
							</rcm-switch>
							<rcm-switch
								:model-value="newsStore.isShowSource"
								@update:model-value="newsStore.toggleShowSource"
							>
								Source
							</rcm-switch>
							<rcm-switch
								:model-value="newsStore.isShowSentiment"
								@update:model-value="newsStore.toggleShowSentiment"
							>
								Sentiment
							</rcm-switch>
							<rcm-switch
								:model-value="newsStore.isShowDesc"
								@update:model-value="newsStore.toggleShowDesc"
							>
								Description
							</rcm-switch>
							<rcm-switch
								:model-value="newsStore.isShowAuthor"
								@update:model-value="newsStore.toggleShowAuthor"
							>
								Author
							</rcm-switch>
							<rcm-switch
								:model-value="newsStore.isShowSymbols"
								@update:model-value="newsStore.toggleShowSymbols"
							>
								Symbols
							</rcm-switch>
							<rcm-switch
								:model-value="newsStore.isShowScore"
								@update:model-value="newsStore.toggleShowScore"
							>
								Score
							</rcm-switch>
						</template>
					</rcm-submenu-content>
				</template>
			</rcm-submenu>

			<rcm-submenu>
				<template #title> Filter & Sort </template>

				<template #content>
					<news-filters class="submenu-content-modal-offset" />
				</template>
			</rcm-submenu>

			<rcm-item @click="newsStore.resetAll"> Reset all changes </rcm-item>

			<rcm-driver />

			<rcm-item> Delete </rcm-item>
		</template>
	</rcm-dashboard>
</template>
