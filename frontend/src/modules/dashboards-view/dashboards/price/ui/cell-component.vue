<script setup lang="ts">
import { storeToRefs } from 'pinia';

import type { ICurrency } from '../model';
import { usePriceStore } from '../stores';
import { UiImage } from '@/shared/ui/image';
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface ICellComponentProps {
	currency: ICurrency;
}

const props = defineProps<ICellComponentProps>();

const { isShowChart, isShowPercentageChange, isShowLogo, isShowTicker } =
	storeToRefs(usePriceStore());
</script>

<template>
	<div :class="classes.root">
		<ui-icon
			:id="IconIds.Drag"
			width="4px"
			height="12px"
			:class="classes.icon"
		/>
		<div :class="classes.content">
			<div
				v-if="isShowLogo"
				:class="classes.logo"
			>
				<ui-image
					:src="props.currency.srcImage"
					replacement="/images/market/ADA.png"
				/>
			</div>
			<div :class="classes.container">
				<div
					v-if="isShowTicker"
					:class="classes.ticker"
				>
					{{ props.currency.ticker }}
				</div>
				<div :class="classes.containerSecond">
					<div :class="classes.marketCap">{{ props.currency.marketCap }}</div>
					<div
						v-if="isShowPercentageChange"
						:class="classes.change"
					>
						{{ props.currency.changeLastDay }}
					</div>
				</div>
			</div>
			<div v-if="isShowChart">
				<div :class="classes.chart">chart</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	padding: 4px 8px;
	font-size: 16px;
	letter-spacing: 0.104px;
	cursor: pointer;
	gap: 4px;
}

.root:hover .icon {
	color: var(--icon-color-base-300);
}

.root:hover .content {
	background-color: var(--bg-color-surface-02);
}

.icon {
	color: transparent;
}

.content {
	display: flex;
	flex-grow: 1;
	align-items: center;
	padding: 4px;
	border-radius: 16px;
}

.logo {
	width: 32px;
	height: 32px;
	margin-right: 12px;
	border-radius: 50%;
}

.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	gap: 4px;
}

.ticker {
	font-weight: 300;
	line-height: 150%;
	color: var(--text-color-base-100);
}

.containerSecond {
	display: flex;
	gap: 4px;
	line-height: 125%;
}

.marketCap {
	font-weight: 440;
	color: var(--text-color-base-500);
}

.change {
	font-weight: 440;
	color: rgb(178 242 211 / 100%);
}

.chart {
	color: rgb(178 242 211 / 100%);
}
</style>
