<script setup lang="ts">
import type { ITickerMapped } from '@/modules/ticker-selector';

import TickerIcon from '../ticker-icon.vue';

interface IProps {
	srcImage: ITickerMapped['srcImage'];
	ticker: ITickerMapped['ticker'];
	size: number;
	padding?: number;
	displayVariant: 'default' | 'new';
}

defineProps<IProps>();
</script>

<template>
	<span :class="classes.wrapper">
		<template v-for="image in srcImage" :key="image">
			<span v-if="image && ticker" :class="classes.item">
				<ticker-icon
					:src="image"
					:ticker="ticker"
					:domain="srcImage?.[1]!"
					:size="size"
					:padding="padding"
					:display-variant="displayVariant"
				/>
			</span>
		</template>
	</span>
</template>

<style module="classes">
.wrapper {
	display: flex;
}

.item:not(:first-child) {
	margin-left: -8px;
}
</style>
