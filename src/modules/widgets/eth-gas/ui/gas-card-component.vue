<script setup lang="ts">
import { computed } from 'vue';

import type { IGasCardData } from '../model';


export interface IGasCardProps {
	data: IGasCardData;
	compact?: boolean;
}

const props = defineProps<IGasCardProps>();

const cardConfig = computed(() => {
	const configs = {
		slow: {
			label: 'Slow',
			timeColor: 'orange',
			bgClass: 'bgSlow',
		},
		standard: {
			label: 'Standart',
			timeColor: 'purple',
			bgClass: 'bgStandard',
		},
		fast: {
			label: 'Fast',
			timeColor: 'green',
			bgClass: 'bgFast',
		},
	};

	return configs[props.data.type];
});

const formattedTime = computed(() => {
	const { time } = props.data;
	if (time < 60) {
		return `~ ${time} sec`;
	}
	const minutes = Math.floor(time / 60);
	return `~ ${minutes} min`;
});
</script>

<template>
	<div
		:class="[
			classes.card,
			classes[cardConfig.bgClass],
			{ [classes.compact]: compact }
		]"
	>
		<!-- Label только для не-компактного режима -->
		<div v-if="!compact" :class="classes.label">
			{{ cardConfig.label }}
		</div>

		<!-- Gwei value -->
		<div :class="classes.gwei" class="paragraph-p-01">
			{{ data.gwei.toFixed(2) }} Gwei
		</div>

		<!-- Time and price -->
		<div :class="classes.footer">
			<span
				:class="[
					classes.time,
					classes[`time-${cardConfig.timeColor}`]
				]"
			>
				{{ formattedTime }}
			</span>
			<span :class="[classes.price, classes[`time-${cardConfig.timeColor}`]]">
				${{ data.price.toFixed(2) }}
			</span>
		</div>
	</div>
</template>

<style module="classes">
.card {
	position: relative;
	display: flex;
	flex-direction: column;
	padding: 12px;
	background: #171717;
	border-radius: 8px;
	cursor: pointer;
	transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
	box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
	transform: translateY(-2px);
}

/* Label (только в обычном режиме) */
.label {
	margin-bottom: 8px;
	font-weight: 400;
	font-size: 11px;
	color: rgb(255 255 255 / 50%);
}

/* Gwei value */
.gwei {
	margin-bottom: 6px;
	line-height: 1.2;
	color: var(--text-color-base-500);
}

/* Footer с временем и ценой - в некомпактном режиме имеет цветной фон */
.footer {
	display: flex;
	flex-direction: column;
	margin: 0 -4px;
	padding: 8px 10px;
	font-size: 11px;
	border-radius: 6px;
	gap: 2px;
}

/* Цветные фоны для footer в некомпактном режиме */
.bgSlow .footer {
	background: #2a1f19;
}

.bgStandard .footer {
	background: #1e1529;
}

.bgFast .footer {
	background: #152822;
}

/* Time estimate */
.time {
	font-weight: 500;
	line-height: 1.3;
}

.time-orange {
	color: #ff9b4d;
}

.time-purple {
	color: #b794ff;
}

.time-green {
	color: #4dd4ac;
}

/* Price - наследует цвет времени */
.price {
	line-height: 1.3;
}

/* Compact mode - цвет применяется ко всей карточке */
.compact {
	justify-content: center;
	min-height: 50px;
	padding: 6px;
}

.compact.bgSlow {
	background: #2a1f19;
}

.compact.bgStandard {
	background: #1e1529;
}

.compact.bgFast {
	background: #152822;
}

.compact .gwei {
	margin-bottom: 2px;
	font-size: 14px;
	line-height: 1.1;
}

.compact .footer {
	flex-direction: row;
	align-items: center;
	margin: 0;
	padding: 0;
	font-size: 9px;
	background: transparent;
	border-radius: 0;
	gap: 3px;
}

.compact .price::before {
	content: '• ';
	margin-right: 2px;
	color: currentcolor;
}
</style>
