<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';

import { useDisplayVariant } from '../../composables';
import { DashboardModalSearch } from '../dashboard';
import { TvModalSearch } from '../tv';

const props = defineProps<{
	displayVariant?: 'default' | 'new';
	placeholder?: string;
	autofocus?: boolean;
	showIcon?: boolean;
}>();

const searchRef = useTemplateRef('search');

const { displayVariant } = useDisplayVariant(() => props.displayVariant);

const model = defineModel<string>();

function searchFocus() {
	if (props.autofocus && searchRef.value) {
		searchRef.value.focus();
	}
}

onMounted(() => {
	searchFocus();
});

defineExpose({
	searchFocus,
});
</script>

<template>
	<dashboard-modal-search
		v-if="displayVariant === 'new'"
		v-bind="props"
		ref="search"
		v-model="model"
	/>

	<tv-modal-search
		v-else
		v-bind="props"
		ref="search"
		v-model="model"
	/>
</template>
