<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';

import type { ITicker } from '../model';
import { usePriceStore } from '../stores';
import type { IMeta } from '@/modules/dashboard-group/core';

import CellComponent from './cell-component.vue';
import PriceHeader from './header/price-header.vue';
import ChartPrice from './chart-price.vue';

interface IViewComponentProps {
	tickers: ITicker[];
	meta: IMeta;
}

const props = defineProps<IViewComponentProps>();
const priceStore = usePriceStore();

const { isShowChart, isShowPercentageChange, isShowLogo, isShowTicker, isShowDescription } =
	storeToRefs(usePriceStore());

const gridTemplateContent = computed(() => {
	const defaultMinWidth = props.meta.size.w > 1 ? 190 : 100;

	let minWidth = defaultMinWidth + ((
		(+(isShowChart.value && props.meta.size.w > 1)) +
		+isShowPercentageChange.value +
		(+(isShowLogo.value && props.meta.size.w > 1)) +
		+isShowTicker.value +
		+isShowDescription.value
	) * 30);


	return `repeat(auto-fit, minmax(${minWidth}px, 1fr)) `;
});

const isShowPriceChart = ref(false);

watchEffect(() => {
	isShowPriceChart.value = !!priceStore.activeCurrency;
});
</script>

<template>
	<div :class="classes.root">
		<price-header />
		<div :class="classes.scrollable">
			<div :class="classes.content">
				<transition
					:enter-active-class="classes.sectionEnterActive"
					:leave-active-class="classes.sectionLeaveActive"
					:enter-from-class="classes.sectionEnterFrom"
					:leave-to-class="classes.sectionLeaveTo"
				>
					<div
						v-if="!isShowPriceChart || (meta.size.w < 3 || meta.size.h < 8)"
						:class="classes.contentWrapped"
					>
						<cell-component
							v-for="ticker in props.tickers"
							:key="ticker.tickerId"
							:ticker="ticker"
							:meta="meta"
						/>
					</div>
					<chart-price
						v-else
						:meta="meta"
					/>
				</transition>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.scrollable {
	position: relative;
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
}

.flip-list-move {
	transition: transform 0.5s;
}

.content {
	width: 100%;
	height: auto;
}

.contentWrapped {
	display: grid;
	grid-template-columns: v-bind(gridTemplateContent);
	width: 100%;
}

.sectionEnterActive,
.sectionLeaveActive {
	max-height: 700px;
	opacity: 1;
	transition: all 0.4s ease;
}

.sectionEnterFrom,
.sectionLeaveTo {
	max-height: 0;
	transform: translateY(-10px);
	opacity: 0;
}
</style>

<style scoped>
:deep(.vgl-item--placeholder) {
	background: transparent !important;
}
</style>
