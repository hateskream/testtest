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
const currencyName = computed(()=>{
	if (!activeExchange?.value) {return;}
	return `·${activeExchange.value.symbol}·${activeExchange.value.currency}`
})

const handleExchangeSelect = (exchangeId: number) => {
	if (positionRef.value) {
		positionRef.value.isVisible = false;
	}
	setActiveExchange(exchangeId);
}
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

				<div class="paragraph-p-01">{{currencyName}}</div>
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
					<div :class="classes.header">
						<div>Source</div>
						<div>Symbol</div>
					</div>
					<div
						v-for="exchange in exchanges"
						:key="exchange.id"
						:class="classes.row"
						@click="() => handleExchangeSelect(exchange.id)"
					>
						<div :class="classes.source">
							<ui-icon :id="exchange.iconId" />
							<span>{{ exchange.source }}</span>
							<ui-icon
								v-if="exchange.isPrimary"
								:id="IconIds.Crown"
								width="18"
								height="18"
							/>
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
	grid-template-columns: 1fr;
	width: 100%;
	padding: 16px;
	background-color: #1e1e1e;
	color: white;
}

.header {
	display: grid;
	grid-template-columns: 180px 110px;
	padding: 8px 16px;
	font-size: 14px;
	color: #888;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.row {
	display: grid;
	grid-template-columns: 180px 110px;
	padding: 8px 16px;
	align-items: center;
}

.row:hover {
	background-color: rgba(255, 255, 255, 0.05);
	cursor: pointer;
}

.source {
	display: flex;
	align-items: center;
	gap: 8px;
}

.symbol {
	font-family: monospace;
}
.selectWrapper{
	align-items:center;
	color:var(--text-color-base-500);
	display:flex;
	padding: 4px 9px 4px 4px;
	border-radius: 9999px;
	background: var(--metrics-bg-control-300);
	backdrop-filter: blur(8px);
	gap:3px;
	cursor:pointer;
}
.iconRotated {
	transform: rotate(180deg);
	transition: transform 0.3s ease;
}
.activeExchangeName {
	width:100px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow:hidden;
}
</style>
