<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import type { IUseExternalTooltipState } from '../composables';

type IChartExternalTooltipProps = IUseExternalTooltipState;

const props = withDefaults(defineProps<IChartExternalTooltipProps>(), {
});

const rootStyles = computed<CSSProperties>(() => ({
	left: `${props.x}px`,
	top: `${props.y}px`,
	padding: `${props.padding}px`,
}));
</script>

<template>
	<div
		v-show="visible"
		:class="classes.tooltip"
		:style="rootStyles"
	>
		<article :class="classes.article">
			<div
				v-for="row in rows"
				:key="row.text + row.value"
				:class="classes.row"
			>
				<div :class="classes.left">
					<span :class="classes.dot" :style="{ background: row.color }" />
					<span :class="classes.symbol">{{ row.text }}</span>
				</div>
				<div :class="classes.value">{{ row.value }}</div>
			</div>

			<div
				v-for="t in title"
				:key="t"
				:class="classes.title"
			>{{ t }}</div>
		</article>
	</div>
</template>

<style module="classes">
.tooltip {
	position: absolute;
	width: 170px;
	color: #ffffff;
	background: rgb(22 22 24 / 100%);
	border: 1px solid rgb(199 199 199 / 10%);
	border-radius: 8px;
	transform: translate(-50%, 0);
	opacity: 1;
	transition: all 0.1s ease;
	pointer-events: none;
}

.article {
	display: flex;
	flex-direction: column;
	margin: 0;
	gap: 6px;
	padding: 4px;
}

.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 26px;
}

.left {
	display: flex;
	align-items: center;
	gap: 4px;
}

.dot {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-width: 2px;
	border-radius: 20px;
}

.symbol {
	font-size: 10px;
}

.value {
	font-size: 12px;
}

.title {
	font-size: 10px;
	color: rgb(154 154 157 / 100%);
}
</style>
