<script setup lang="ts">
import { computed } from 'vue';

const INITIAL_ARROW_DEG = 59;

interface ISpeedometerArrowProps {
	rotate: number;
}

const props = defineProps<ISpeedometerArrowProps>();

const preparedRotate = computed(() => props.rotate - INITIAL_ARROW_DEG);
</script>

<template>
	<svg
		viewBox="0 0 197 197"
		xmlns="http://www.w3.org/2000/svg"
		:class="classes.arrow"
		:style="{
			transform: `rotate(${preparedRotate}deg)`
		}"
	>
		<path
			d="m70.693 56.553-7.225-13.165 8.908 12.09a.1.1 0 0 1 .015.027l1.178 3.515
			c.034.099-.087.176-.163.105l-2.694-2.547a.1.1 0 0 1-.02-.025"
			fill="#fff"
		/>
	</svg>
</template>

<style module="classes">
.arrow {
	transform-origin: center;
	transition: transform 0.7s ease-in-out;
	transform-box: view-box;
}
</style>
