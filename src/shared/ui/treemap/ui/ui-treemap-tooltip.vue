<script setup lang="ts">
import { useMouse } from '@vueuse/core';
import { computed, useTemplateRef, watch, watchEffect } from 'vue';

import { UiPositionPortal } from '@/shared/ui/position';
import { prepareNumber, preparePercent } from '../utils';
import { createVirtualFloatingNode } from '@/shared/ui/position';

const SIZE_ACTIVATOR = 10;
const HALF_SIZE_ACTIVATOR_PX = `${SIZE_ACTIVATOR}`;

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
	sizeValueIsPercent: boolean;
	sizeBy: string;

	displayValue: number;
	displayValueIsPercent: boolean;
	displayValueName: string;

	isOpen: boolean;
}

const props = defineProps<IUiTreemapTooltipProps>();

const { x, y } = useMouse({ touch: false });

const portal = useTemplateRef('portalRef');

const virtualRef = computed(() => createVirtualFloatingNode({
	x: x.value,
	y: y.value,
	right: x.value + SIZE_ACTIVATOR,
	bottom: y.value + SIZE_ACTIVATOR,
}));

watchEffect(() => {
	portal.value?.close();
	if (props.isOpen) {
		portal.value?.openAt(virtualRef);
	}
});

watch([x, y], () => {
	if (props.isOpen) {
		portal.value?.floating.instance.update();
	}
});

const prepareSizeBy = computed(() =>
	prepareNumberValue(props.sizeValue, props.sizeValueIsPercent),
);
const prepareValueDisplay = computed(() =>
	prepareNumberValue(props.displayValue, props.displayValueIsPercent),
);
const preparePrice = computed(() => `${props.currencySymbol} ${props.price.toFixed(2)}`);

const styleValueDisplay = computed(() => {
	let color = colorMapping.zero;
	if (props.displayValue > 0) {
		color = colorMapping.moreZero;
	} else if (props.displayValue < 0) {
		color = colorMapping.lessZero;
	}

	return {
		color,
	};
});

function prepareNumberValue(value: number, isPercent: boolean) {
	if (isPercent) {
		return preparePercent(value);
	}

	return `${props.currencySymbol} ${prepareNumber(value)}`;
}
</script>

<template>
	<ui-position-portal
		ref="portalRef"
		placement="bottom-start"
		scope="tooltip"
		:offset="6"
	>
		<div class="container">
			<div class="header">
				<div class="logo" />
				<div class="ticker">{{ props.ticker }}</div>
			</div>
			<div class="line" />
			<div class="info">
				<div class="info-item">
					<div class="value">Price</div>
					<div class="value">{{ preparePrice }}</div>
				</div>
				<div class="info-item">
					<div class="value">{{ props.sizeBy }}</div>
					<div class="value">{{ prepareSizeBy }}</div>
				</div>
				<div class="info-item">
					<div class="value">{{ props.displayValueName }}</div>
					<div class="value" :style="styleValueDisplay">{{ prepareValueDisplay }}</div>
				</div>
			</div>
		</div>
	</ui-position-portal>
</template>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	width: 224px;
	margin: v-bind(HALF_SIZE_ACTIVATOR_PX);
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
