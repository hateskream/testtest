<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { TvModalDivider, UiModalSearch } from '@/shared/ui/modal';
import type { FilterListType } from '@/modules/ticker-selector/model';

interface IModalFilterHeaderProps {
	isBackgroundTransparent?: boolean;
	viewMode: FilterListType;
	autofocus?: boolean;
	textAboveSearch?: string;
	searchPlaceholder?: string;
	showDriver: boolean;
}

const props = withDefaults(defineProps<IModalFilterHeaderProps>(), {
	isBackgroundTransparent: false,
	textAboveSearch: '',
	searchPlaceholder: 'Start typing the ticker...',
});

const queryModel = defineModel<string>('query', { default: '' });

const searchRef = useTemplateRef('search');

function searchFocus() {
	searchRef.value?.searchFocus();
}

defineExpose({
	searchFocus,
});
</script>

<template>
	<div :class="classes.header">
		<div
			v-if="props.textAboveSearch"
			:class="classes.textAboveSearch"
		>
			{{ props.textAboveSearch }}
		</div>

		<div :class="classes.search">
			<ui-modal-search
				ref="search"
				v-model="queryModel"
				:placeholder="props.searchPlaceholder"
				:autofocus="props.autofocus"
			/>
		</div>

		<tv-modal-divider v-if="showDriver" />
	</div>
</template>

<style module="classes">
.header {
	width: 100%;
}

.textAboveSearch {
	padding: 12px;
	font-style: normal;
	text-align: center;
}
</style>
