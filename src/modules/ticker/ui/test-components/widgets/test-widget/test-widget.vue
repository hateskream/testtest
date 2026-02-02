<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { WidgetLayout } from '../../shared/ui';

interface IProps {
	title?: string;
	displayText?: string;
}

const props = withDefaults(defineProps<IProps>(), {
	title: 'Test Component',
	displayText: 'Test Component',
});

const randomColor = ref<string>('');
const rotationX = ref<number>(0);
const rotationY = ref<number>(0);

const generateRandomColor = (): string => {
	const colors = [
		'#FF6B6B', // Red
		'#4ECDC4', // Teal
		'#45B7D1', // Blue
		'#FFA07A', // Light Salmon
		'#98D8C8', // Mint
		'#F7DC6F', // Yellow
		'#BB8FCE', // Purple
		'#85C1E2', // Light Blue
	];
	return colors[Math.floor(Math.random() * colors.length)];
};

const animateText = (): void => {
	let xAngle = 0;
	let yAngle = 0;

	const animate = (): void => {
		xAngle += 0.5;
		yAngle += 0.8;

		rotationX.value = xAngle;
		rotationY.value = yAngle;

		requestAnimationFrame(animate);
	};

	animate();
};

onMounted(() => {
	randomColor.value = generateRandomColor();
	animateText();
});
</script>

<template>
	<widget-layout>
		<template #header>
			<span>{{ props.title }}</span>
		</template>
		<template #body>
			<div :class="classes.container">
				<div
					:class="classes.textWrapper"
					:style="{
						color: randomColor,
					}"
				>
					<h1 :class="classes.text">{{ props.displayText }}</h1>
				</div>
				<p :class="classes.info">
					Color: <span :style="{ color: randomColor }">{{ randomColor }}</span>
				</p>
			</div>
		</template>
	</widget-layout>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 300px;
	padding: 20px;
	gap: 20px;
}

.textWrapper {
	perspective: 1000px;
	transform-style: preserve-3d;
	transition: all 0.1s linear;
}

.text {
	margin: 0;
	font-weight: 700;
	font-size: 48px;
	letter-spacing: 2px;
	text-shadow:
		0 0 10px rgb(0 0 0 / 20%),
		0 0 20px rgb(0 0 0 / 10%);
	transition: all 0.1s linear;
}

.info {
	margin: 0;
	font-size: 14px;
	text-align: center;
	color: #888888;
}
</style>
