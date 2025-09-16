<script setup lang="ts">
import { SymbolType } from '@/modules/cell';
import type { ITickerMapped } from '@/modules/ticker-selector/model';

import ForexTickerIcon from '@/shared/ui/ticker/forex-ticker-icon.vue';
import TickerIcon from '@/shared/ui/ticker/ticker-icon.vue';

interface IProps {
	srcImage: ITickerMapped['srcImage'];
	ticker: ITickerMapped['ticker'];
	size: number;
	type: ITickerMapped['symbolType'];
}

defineProps<IProps>();

</script>

<template>
	<template v-if="type && ticker && srcImage">
		<forex-ticker-icon
			v-if="type === SymbolType.Forex"
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
		/>
	</template>
</template>
