<script setup lang="ts">
import { flip, useFloating, type VirtualElement } from '@floating-ui/vue';
import { refDebounced, useMouse } from '@vueuse/core';
import { computed, useTemplateRef, watch } from 'vue';

import { prepareNumber, preparePercent } from '../utils';

const SIZE_ACTIVATOR = 10;
const DEBOUNCE_UPDATE_POSITION = 10;

const colorMapping = {
	zero: 'rgba(255, 255, 255, 1)',
	moreZero: 'rgba(4, 237, 160, 1)',
	lessZero: 'rgba(252, 74, 107, 1)',
};

interface IUiTreemapTooltipProps {
	logoUrl: string;
	ticker: string;

	price: number;
	currencySymbol: string;

	sizeValue: number;
	colorValue: number;

	colorValueIsPercent: boolean;

	colorBy: string;
	sizeBy: string;

	isOpen: boolean;
}

const props = defineProps<IUiTreemapTooltipProps>();

const { x, y } = useMouse({ touch: false });
const debouncedX = refDebounced(x, DEBOUNCE_UPDATE_POSITION);
const debouncedY = refDebounced(y, DEBOUNCE_UPDATE_POSITION);

const { floatingStyles, update } = useFloating(
	computed<VirtualElement>(() => ({
		getBoundingClientRect() {
			return {
				width: SIZE_ACTIVATOR,
				height: SIZE_ACTIVATOR,
				x: x.value,
				y: y.value,
				left: x.value,
				top: y.value,
				right: x.value + SIZE_ACTIVATOR,
				bottom: y.value + SIZE_ACTIVATOR,
			};
		},
	})),
	useTemplateRef('floating'),
	{
		strategy: 'fixed',
		placement: 'top-start',
		middleware: [flip()],
	},
);

const prepareSizeBy = computed(() => prepareNumberValue(props.sizeValue));

const prepareColorBy = computed(() => {
	if (props.colorValueIsPercent) {
		return preparePercent(props.colorValue);
	}

	return prepareNumberValue(props.colorValue);
});

const styleColorBy = computed(() => {
	if (props.colorValueIsPercent) {
		let color = colorMapping.zero;
		if (props.colorValue > 0) {
			color = colorMapping.moreZero;
		} else if (props.colorValue < 0) {
			color = colorMapping.lessZero;
		}

		return {
			color,
		};
	}

	return {};
});

watch([debouncedX, debouncedY], update);

function prepareNumberValue(value: number) {
	return `${props.currencySymbol} ${prepareNumber(value)}`;
}

</script>

<template>
	<div
		ref="floating"
		class="root"
		:style="floatingStyles"
	>
		<div v-show="props.isOpen" class="container">
			<div class="header">
				<div class="logo" />
				<div class="ticker">{{ props.ticker }}</div>
			</div>
			<div class="line" />
			<div class="info">
				<div class="info-item">
					<div class="value">Price</div>
					<div class="value">{{ props.currencySymbol }} {{ props.price }}</div>
				</div>
				<div class="info-item">
					<div class="value">{{ props.sizeBy }}</div>
					<div class="value">{{ prepareSizeBy }}</div>
				</div>
				<div class="info-item">
					<div
						class="value"
					>
						{{ props.colorBy }}
					</div>
					<div
						class="value"
						:style="styleColorBy"
					>{{ prepareColorBy }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	width: 224px;
	margin: 0 0 5px 5px;
	padding: 10px;
	background-color: #161618;
	border: 1px solid #c7c7c71a;
	border-radius: 12px;
	gap: 10px;
}

.header {
	display: flex;
	align-items: center;
	gap: 8px;
}

.logo {
	width: 26px;
	height: 26px;
	background: #c7c7c71a;
	border-radius: 50%;
}

.ticker {
	font-weight: 700;
	font-size: 13px;
	line-height: 160%;
}

.line {
	height: 1px;
	background: #c7c7c71a;
}

.info {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.info-item {
	display: flex;
	justify-content: space-between;
}

.value {
	font-weight: 440;
	font-size: 12px;
	line-height: 170%;
}
</style>
