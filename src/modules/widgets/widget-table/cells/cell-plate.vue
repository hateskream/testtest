<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
	data: {
		value: 'sale'
			| 'volatile' | 'purchases' | 'neutral' | 'buy' | 'sell' | 'cash';
	};
}


const props = defineProps<IProps>();

const statusConfig = {
	sale: {
		text: 'Sale',
		class: 'red',
	},
	volatile: {
		text: 'Volatile',
		class: 'yellow',
	},
	purchases: {
		text: 'Purchase',
		class: 'red',
	},
	neutral: {
		text: 'Neutral',
		class: 'gray',
	},
	buy: {
		text: 'Buy',
		class: 'green',
	},
	sell: {
		text: 'Sell',
		class: 'red',
	},
	cash: {
		text: 'Cash',
		class: 'green',
	},
} as const;

const currentStatus = computed(() => {
	return statusConfig[props.data.value] ? statusConfig[props.data.value] : statusConfig.neutral;
});
</script>

<template>
	<div :class="classes.plateWrapper">
		<div :class="[classes.plate, classes[currentStatus.class]]">
			{{currentStatus.text}}
		</div>
	</div>
</template>

<style module="classes">
.plateWrapper {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
}

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
