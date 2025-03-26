<script setup lang="ts">
import { storeToRefs } from 'pinia';

import type { ICurrency } from '../model';
import { usePriceStore } from '../stores';
import { UiImage } from '@/shared/ui/image';

interface ICellComponentProps {
	currency: ICurrency;
}

const props = defineProps<ICellComponentProps>();

const { isShowChart, isShowPercentageChange, isShowLogo, isShowTicker } =
	storeToRefs(usePriceStore());
</script>

<template>
	<div :class="classes.root">
		<div
			v-if="isShowLogo"
			:class="classes.logo"
		>
			<ui-image :src="props.currency.srcImage" />
		</div>
		<div :class="classes.container">
			<div v-if="isShowTicker">{{ props.currency.ticker }}</div>
			<div :class="classes.containerSecond">
				<div :class="classes.marketCap">{{ props.currency.marketCap }}</div>
				<div v-if="isShowPercentageChange">{{ props.currency.changeLastDay }}</div>
			</div>
		</div>
		<div v-if="isShowChart">
			<div :class="classes.chart">chart</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	/* comming  */
}

.logo {
	/* comming  */
}

.container {
	/* comming */
}

.containerSecond {
	/* comming  */
}

.marketCap {
	/* comming  */
}

.chart {
	/* comming  */
}
</style>
