<script setup lang="ts">
import { SymbolType } from '@/modules/cell';
import type { ITickerMapped } from '@/modules/ticker-selector/model';

import TickerIcon from '@/shared/ui/ticker/ticker-icon.vue';
import ForexTickerIcon from '@/shared/ui/ticker/forex-ticker-icon.vue';
import ForexTickerIconDashboard from '@/shared/ui/ticker/dashboard/forex-ticker-icon-dashboard.vue';

interface IProps {
	srcImage: ITickerMapped['srcImage'];
	ticker: ITickerMapped['ticker'];
	size: number;
	type: ITickerMapped['symbolType'];
	padding?: number;
	displayVariant: 'default' | 'new';
}

defineProps<IProps>();
</script>

<template>
	<template v-if="type && ticker && srcImage">
		<forex-ticker-icon-dashboard
			v-if="Array.isArray(srcImage) && displayVariant === 'new'"
			:ticker="ticker"
			:padding="padding"
			:size="size"
			:display-variant="displayVariant"
			:src-image="srcImage"
		/>

		<forex-ticker-icon
			v-else-if="type === SymbolType.Forex"
			:src="<[string, string]>srcImage"
			:ticker="ticker"
			:domain="srcImage[1]!"
			:size="size"
		/>

		<ticker-icon
			v-else
			:src="<string>srcImage"
			:ticker="ticker"
			:size="size"
			:padding="padding"
		/>
	</template>
</template>

<style module="classes">

</style>
