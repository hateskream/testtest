<script setup lang="ts">
import { useNewsStore } from '../stores';
import {
	ModalItemSwitch,
	WidgetContextMenu,
	ModalSubmenu,
} from '../../base';

import NewsFilters from './news-filters-component.vue';

const newsStore = useNewsStore();

const props = defineProps<{
	title: string;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<widget-context-menu
		:title="props.title"
		@delete="emit('delete')"
		@reset="newsStore.resetAll"
	>
		<modal-submenu>
			<template #title> Change display </template>

			<template #content>
				<div :class="classes.changeDisplayWrapper">
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
				</div>
			</template>
		</modal-submenu>

		<modal-submenu>
			<template #title> Filter & Sort </template>

			<template #content>
				<news-filters />
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>

<style module="classes">
.changeDisplayWrapper {
	min-width: 208px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}
</style>
