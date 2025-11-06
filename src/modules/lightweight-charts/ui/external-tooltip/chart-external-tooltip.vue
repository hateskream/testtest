<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import type { IUseExternalTooltipState } from '../../composables';

import ChartExternalTooltipRow from './chart-external-tooltip-row.vue';

type IChartExternalTooltipProps = IUseExternalTooltipState;

const props = defineProps<IChartExternalTooltipProps>();

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
		<slot
			name="content"
			:rows="props.rows"
			:title="props.title"
		>
			<article :class="classes.article">
				<chart-external-tooltip-row
					v-for="row in rows"
					:key="row.text + row.value"
					:color="row.color"
					:text="row.text"
					:value="row.value"
				/>
				<div
					v-for="t in title"
					:key="t"
					:class="classes.title"
				>{{ t }}</div>
			</article>
		</slot>
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

.title {
	font-size: 10px;
	color: rgb(154 154 157 / 100%);
}
</style>
