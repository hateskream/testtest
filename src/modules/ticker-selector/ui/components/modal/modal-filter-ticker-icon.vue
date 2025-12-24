<script setup lang="ts">
import type { ITickerMapped } from '@/modules/ticker-selector/model';
import { UniversalTickerIcon } from '@/shared/ui/ticker';

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
	<universal-ticker-icon
		:src="srcImage?.[0] ?? undefined"
		:right-src="srcImage?.[1] ?? undefined"
		:display-variant="displayVariant"
		:size="size"
		:padding="padding"
		:ticker="ticker!"
		:symbol-type="type!"
	/>
</template>

<style module="classes">

</style>
