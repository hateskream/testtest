<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
	data: 'red' | 'gray' | 'yellow' | 'green';
}

const props = defineProps<IProps>();

const statusConfig = {
	red: {
		text: 'Sale',
		class: 'red',
	},
	yellow: {
		text: 'Volatile',
		class: 'yellow',
	},
	green: {
		text: 'Purchase',
		class: 'green',
	},
	gray: {
		text: 'Neutral',
		class: 'gray',
	},
} as const;

const currentStatus = computed(() => statusConfig[props.data]);
</script>

<template>
	<div :class="[classes.plate, classes[currentStatus.class]]">
		{{ currentStatus.text }}
	</div>
</template>

<style module="classes">
.plate {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 84px;
	height: 24px;
	padding: 0 8px;
	font-weight: 500;
	font-size: 12px;
	text-align: center;
	border-radius: 6px;
	gap: 10px;
}

.red {
	color: #fc4a6b;
	background: rgb(252 74 107 / 12%);
}

.yellow {
	color: #ff7f35;
	background: rgb(255 127 53 / 12%);
}

.green {
	color: #04eda0;
	background: rgb(4 237 160 / 10%);
}

.gray {
	color: #ffffff;
	background: rgb(77 77 77 / 50%);
}
</style>
