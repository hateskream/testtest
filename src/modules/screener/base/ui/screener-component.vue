<script setup lang="ts">
import { watch } from 'vue';

import { useScreener } from '../composables';
import { ScreenerType } from '../model';
import { ScreenerFiltersComponent } from '../ui';

const props = defineProps<{
	type: ScreenerType;
}>();

const {
	activeScreenerType,
	activeMarkets,
	filtersState,
	filtersDefinitions,
} = useScreener({ defaultStateType: props.type, isEphemeral: false });

watch(() => props.type, value => {
	activeScreenerType.value = value;
});
</script>

<template>
	<div :class="classes.root">
		<screener-filters-component
			v-model:markets="activeMarkets"
			v-model:filters="filtersState"
			:type="props.type"
			:definitions="filtersDefinitions"
		/>
	</div>
</template>
<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}
</style>
