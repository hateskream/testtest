<script setup lang="ts">
import type { CSSProperties } from 'vue';


interface IProps {
	list: {
		color: CSSProperties['backgroundColor'];
		text: string;
	}[];
}

defineProps<IProps>();

</script>

<template>
	<div :class="classes.instruments">
		<slot />

		<div :class="classes.legend">
			<div
				v-for="item in list"
				:key="item.color + item.text"
				:class="classes.legendItem"
			>
				<div :class="[classes.legendCircle]" :style="{ backgroundColor: item.color }"></div>
				<span>{{ item.text }}</span>
			</div>
		</div>
	</div>
</template>


<style module="classes">
.instruments {
	display: flex;
	align-items: center;
	border-top: 1px solid var(--border-color-base-300);
}


.legend {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	padding: 20px 16px;
	gap: 31px;
}

.legendItem {
	display: flex;
	align-items: center;
	gap: 4px;
}

.legendItem span {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
}


.legendCircle {
	width: 6px;
	height: 6px;
	border-radius: 50%;
}
</style>
