<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';

const isOpen = defineModel<boolean>();

function toggle() {
	isOpen.value =! isOpen.value;
}
</script>

<template>
	<div :class="[classes.accordion]">
		<div :class="classes.header" @click="toggle">
			<ui-text
				:class="{ [classes.leftActive]: isOpen }"
				token="title-100"
				as="div"
			>
				<slot name="left" />
			</ui-text>
			<div :class="classes.right">
				<slot name="right" />

				<ui-icon
					:id="IconIds.Arrow"
					width="12px"
					height="12px"
					:class="[classes.arrow, isOpen && classes.arrowActive]"
				/>
			</div>
		</div>

		<div v-show="isOpen" :class="classes.content">
			<slot name="content" />
		</div>
	</div>
</template>

<style module="classes">
.accordion {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	height: 42px;
	padding: 0 12px;
	color: var(--color-text-base-300, #9a9a9d);
	cursor: pointer;
	user-select: none;

	&:hover {
		background: var(--color-metrics-bg-control-300, rgb(45 45 47 / 40%));
		border-radius: 20px;
	}
}

.leftActive {
	color: #ffffff;
}

.right {
	display: flex;
	align-items: center;
	gap: 6px;
}

.arrow {
	color: var(--color-text-base-300, #9a9a9d);
	transition: rotate 0.1s ease-in;
	rotate: 180deg;
	fill: #646568;
}

.arrowActive.arrow {
	rotate: 270deg !important;
}

.content {
	overflow: hidden;
}
</style>
