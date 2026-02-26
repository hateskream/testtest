<script setup lang="ts">
import { ref } from 'vue';

import { TickerLinksWidget } from '@/modules/widgets/links';

const width = ref(400);
</script>

<template>
	<div>
		<div :class="classes.options">
			<span>Width: {{ width }}px</span>
			<span>Max width: any</span>
			<span>Min width: 270px</span>
			<input
				v-model.number="width"
				type="range"
				min="270"
				max="3440"
				step="10"
			>
		</div>

		<div :style="{ width: `${width}px` }">
			<ticker-links-widget :meta="{ tickerId: 'Crypto-BTC_Bitcoin', name: 'Links' }" />
		</div>
	</div>
</template>

<style module="classes">
.options {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.options input {
	width: 400px;
}
</style>
