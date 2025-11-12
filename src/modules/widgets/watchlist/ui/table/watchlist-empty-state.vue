<script setup lang="ts">
import { ref } from 'vue';

import { ModalTickerSelector } from '@/modules/ticker-selector';
import type { ITickersAddPayload } from '../../model';
import { resolveMarketTypeFromTicker } from '@/modules/cell';

const props = defineProps<{
	displayVariant: 'new' | 'default';
}>();

const emit = defineEmits<{
	(event: 'add-tickers', payload: ITickersAddPayload): void;
}>();

const isOpenSelector = ref(false);

const selectedTickers = ref<string[]>([]);

function onClickSave() {
	const tickers = selectedTickers.value
		.reduce<ITickersAddPayload['tickers']>(
			(acc, item) => {
				const marketType = resolveMarketTypeFromTicker(item);
				if (!marketType) {
					return acc;
				}

				if (!acc[marketType]) {
					acc[marketType] = [item];
				} else {
					acc[marketType].push(item);
				}

				return acc;
			},
			{} as ITickersAddPayload['tickers'],
		);

	emit('add-tickers', {
		tickers,
	});
}
</script>

<template>
	<div :class="classes.root">
		<modal-ticker-selector
			v-if="isOpenSelector"
			v-model="selectedTickers"
			:is-background-transparent="true"
			:enable-selected-info="false"
			:enable-select-all="false"
			:display-variant="props.displayVariant"
			text-above-search="Add symbols"
		/>

		<div
			v-else
			:class="classes.watchlistEmptyState"
			@click="isOpenSelector = true"
		>
			<img src="../../../../../assets/images/favorite.png" alt="">

			<div :class="classes.info">
				<div :class="classes.heading">
					Watchlist is empty
				</div>

				<div :class="classes.description">
					Add symbols
				</div>
			</div>
		</div>

		<div
			v-if="selectedTickers.length > 0"
			:class="classes.saveButtonContainer"
		>
			<div
				:class="classes.saveButton"
				@click="onClickSave"
			>
				<div :class="classes.topText">Save</div>
				<div :class="classes.bottomText"> {{ selectedTickers.length }} symbols</div>
			</div>
		</div>

	</div>
</template>

<style module="classes">
.root {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
}

.saveButtonContainer {
	position: absolute;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 270px;
	height: 68px;
	margin-bottom: 1px;
	background: linear-gradient(to bottom, transparent 0, var(--bg-color-surface-01) 70%);
	border-bottom-right-radius: 16px;
	border-bottom-left-radius: 16px;
}

.saveButton {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 200px;
	height: 52px;
	color: #000000;
	background-color: #ffffff;
	border-radius: 999px;
	cursor: pointer;
}

.topText {
	font-style: normal;
	font-weight: 440;
	font-size: var(--typography-headers-size-h-01, 13px);
	line-height: 22px;
	color: var(--color-text-contrast-500, #0c0c0e);
}

.bottomText {
	font-style: normal;
	font-weight: 440;
	font-size: 11px;
	line-height: 18px;
	text-align: center;
	color: var(--color-text-contrast-500, #0c0c0e);
	letter-spacing: 0.088px;
}

.watchlistEmptyState {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	max-width: 294px;
	height: 100%;
	max-height: 130px;
	border: 1px solid var(--color-border-surface-02, rgb(199 199 199 / 10%));
	border-radius: 18px;
	gap: 12px;
	cursor: pointer;
}

.info {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
}

.heading {
	font-weight: 300;
	font-size: var(--typography-headers-size-h-01);
	text-align: center;
	color: #ffffff;
	letter-spacing: 0.104px;
}

.description {
	font-weight: 380;
	font-size: var(--typography-headers-size-h-02);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.04px;
}
</style>
