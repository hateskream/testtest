<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import { useNewsStore } from '../stores';
import {
	ModalItem,
	ModalItemNumber,
	ModalItemSwitch,
	ModalRcm,
	ModalSubmenu,
	ModalSubmenuContent,
} from '../../base';

import NewsFilters from './news-filters-component.vue';

const newsStore = useNewsStore();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<modal-rcm>
		<template #title> News </template>
		<template #content>
			<modal-item-number :value="1">Duplicate</modal-item-number>
			<modal-item-number :value="2">Open full data</modal-item-number>
			<modal-item-number :value="3">Wrap in stack</modal-item-number>
			<modal-item>Move to</modal-item>

			<ui-driver />

			<modal-submenu>
				<template #title> Change display </template>

				<template #content>
					<modal-submenu-content>
						<template #content>
							<modal-item-switch
								:model-value="newsStore.isShowDate"
								@update:model-value="newsStore.toggleShowDate"
							>
								Date
							</modal-item-switch>
							<modal-item-switch
								:model-value="newsStore.isShowSource"
								@update:model-value="newsStore.toggleShowSource"
							>
								Source
							</modal-item-switch>
							<modal-item-switch
								:model-value="newsStore.isShowSentiment"
								@update:model-value="newsStore.toggleShowSentiment"
							>
								Sentiment
							</modal-item-switch>
							<modal-item-switch
								:model-value="newsStore.isShowDesc"
								@update:model-value="newsStore.toggleShowDesc"
							>
								Description
							</modal-item-switch>
							<modal-item-switch
								:model-value="newsStore.isShowAuthor"
								@update:model-value="newsStore.toggleShowAuthor"
							>
								Author
							</modal-item-switch>
							<modal-item-switch
								:model-value="newsStore.isShowSymbols"
								@update:model-value="newsStore.toggleShowSymbols"
							>
								Symbols
							</modal-item-switch>
							<modal-item-switch
								:model-value="newsStore.isShowScore"
								@update:model-value="newsStore.toggleShowScore"
							>
								Score
							</modal-item-switch>
						</template>
					</modal-submenu-content>
				</template>
			</modal-submenu>

			<modal-submenu>
				<template #title> Filter & Sort </template>

				<template #content>
					<news-filters />
				</template>
			</modal-submenu>

			<modal-item @click="newsStore.resetAll"> Reset all changes </modal-item>

			<ui-driver />

			<modal-item @click="emit('delete')"> Delete </modal-item>
		</template>
	</modal-rcm>
</template>
