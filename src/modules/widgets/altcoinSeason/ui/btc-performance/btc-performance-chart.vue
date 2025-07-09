<script setup lang="ts">
import { ref } from 'vue';

import { widgetColor } from '@/modules/widgets/altcoinSeason/const';

const activeBar = ref(5);
</script>

<template>
	<div :class="classes.btcPerformanceChart">
		<div :class="classes.chart">
			<div
				v-for="i in 30"
				:key="i"
				:class="classes.chartBar"
			>
				<div v-if="i === activeBar || i === 1 || i === 30" :class="classes.barIndex">{{ i }}</div>
				<div
					:class="[classes.bar, {[classes.active]: i === activeBar}]"
					:style="{
						backgroundColor:
							i <= 7
								? widgetColor.bitcoinSeason
								: i <= 23
									? widgetColor.neutralSeason
									: widgetColor.altcoinSeason,
					}"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.btcPerformanceChart {
	display: flex;
	align-self: stretch;
}

.chart {
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	padding: 1px 0;
}

.chartBar {
	position: relative;
}

.barIndex {
	position: absolute;
	top: 0;
	left: 50%;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-02, 10px);
	color: var(--color-text-base-100, #646568);
	letter-spacing: 0.08px;
	transform: translateX(-50%);
}

.bar {
	width: 1px;
	height: 13px;
	margin-top: 20px;
	background: rgb(77 77 77 / 40%);

	&.active {
		width: 2px;
		height: 17px;
		border-radius: 10px;
	}
}

</style>
