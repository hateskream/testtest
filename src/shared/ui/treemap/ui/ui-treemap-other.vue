<script setup lang="ts">
import { IconIds, UiIcon } from '../../icon';


interface IUiTreemapOther {
	count: number;
}

const props = defineProps<IUiTreemapOther>();

const emit = defineEmits<{
	(e: 'click-other'): void;
}>();
</script>

<template>
	<div :class="classes.root" @click="emit('click-other')">
		<div :class="[classes.text]">
			{{ props.count }}
		</div>
		<div :class="[classes.text, classes.other]">
			tickers
		</div>
		<ui-icon
			:id="IconIds.Other"
			:class="classes.icon"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: rgb(12 12 13 / 100%);
	border: 1px solid #000000;
	gap: 2px;
	container-type: size;
}

.text {
	font-style: normal;
	font-weight: 440;
	font-size: 14px;
	color: rgb(154 154 157 / 100%);
	letter-spacing: 0.08px;
}

.icon {
	color: rgb(100 101 104 / 100%);
}

@container (width < 86px) {
	.other {
		display: none;
	}
}
</style>
