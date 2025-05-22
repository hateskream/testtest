<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { useChartStore } from '@/modules/chart/store';

import ChartDropdownLayout from './chart-dropdown-layout.vue';

const { exchanges, activeExchange } = storeToRefs(useChartStore());
const { setActiveExchange } = useChartStore();

const positionRef = ref<InstanceType<typeof UiPosition> | null>(null);
const currencyName = computed(() => {
	if (!activeExchange?.value) {
		return;
	}
	return `· ${activeExchange.value.symbol} · ${activeExchange.value.currency}`;
});

const handleExchangeSelect = (exchangeId: number) => {
	if (positionRef.value) {
		positionRef.value.isVisible = false;
	}
	setActiveExchange(exchangeId);
};
</script>

<template>
	<ui-position
		v-if="activeExchange"
		ref="positionRef"
		position="bottom-start"
		trigger="click"
	>
		<template #default="{ isVisible }">
			<div :class="classes.selectWrapper">
				<ui-icon
					:id="activeExchange.iconId"
					width="22"
					height="22"
				/>
				<div class="paragraph-p-01" :class="classes.activeExchangeName">{{ activeExchange.fullName }}</div>

				<div class="paragraph-p-01" :class="classes.currencyName">{{ currencyName }}</div>
				<ui-icon
					:id="IconIds.DropdownDown"
					width="18"
					height="18"
					:class="[isVisible ? classes.iconRotated : '']"
				/>
			</div>
		</template>

		<template #content>
			<chart-dropdown-layout>
				<div :class="classes.grid">
					<div :class="classes.header" class="paragraph-p-02">
						<div>Source</div>
						<div>Symbol</div>
					</div>
					<div
						v-for="exchange in exchanges"
						:key="exchange.id"
						:class="classes.row"
						class="paragraph-p-01"
						@click="() => handleExchangeSelect(exchange.id)"
					>
						<div :class="classes.source">
							<div :class="classes.exchangeIconWrapper">
								<ui-icon
									:id="exchange.iconId"
									:classes="classes.exchangeIcon"
									width="24"
									height="24"
								/>
							</div>
							<div :class="classes.sourceName">
								<span>{{ exchange.source }}</span>
								<div v-if="exchange.isPrimary" :class="classes.crownWrapper">
									<ui-icon
										v-if="exchange.isPrimary"
										:id="IconIds.Crown"
										:class="classes.crown"
										width="13"
										height="13"
									/>
								</div>
							</div>
						</div>
						<div :class="classes.symbol">
							{{ exchange.displaySymbol }}
						</div>
					</div>
				</div>
			</chart-dropdown-layout>
		</template>
	</ui-position>
</template>

<style module="classes">
.grid {
	display: grid;
	width: 100%;
	padding: 16px;
	color: var(--text-color-base-500);
	background-color: #1e1e1e;
	grid-template-columns: 1fr;
}

.header {
	display: grid;
	grid-template-columns: 180px 110px;
	padding: 8px 16px;
	font-size: 14px;
	color: #888888;
	gap: 8px;
}

.row {
	display: grid;
	align-items: center;
	padding: 8px 16px;
	gap: 8px;
	grid-template-columns: 180px 110px;
}

.row:hover {
	background-color: rgb(255 255 255 / 5%);
	cursor: pointer;
}

.source {
	display: flex;
	align-items: center;
	gap: 6px;
}

.symbol {
	font-family: monospace;
}

.selectWrapper {
	display: flex;
	align-items: center;
	padding: 4px 9px 4px 4px;
	color: var(--text-color-base-500);
	background: var(--metrics-bg-control-300);
	border-radius: 9999px;
	cursor: pointer;
	gap: 3px;
	backdrop-filter: blur(16px);
	transition: 0.2s width ease-in-out;
}

.iconRotated {
	transform: rotate(180deg);
	transition: transform 0.3s ease;
}

.activeExchangeName {
	width: 100px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.sourceName {
	display: flex;
	align-items: center;
	gap: 4px;
}

.crownWrapper {
	position: relative;
	width: 20px;
	height: 20px;
	background: var(--charts-bg-badge);
	border-radius: 9999px;
}

.crown {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.exchangeIconWrapper {
	width: 24px;
	height: 24px;
	overflow: hidden;
}

</style>
