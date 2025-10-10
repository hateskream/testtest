<script setup lang="ts">

interface IProps {
	isActive: boolean;
}

const props = defineProps<IProps>();

</script>

<template>
	<div :class="[classes.switch, props.isActive ? classes.active : classes.unactive]">
		<div :class="classes.indicator" />
	</div>
</template>

<style module="classes">
.switch {
	position: relative;
	width: 34px;
	height: 19px;
	overflow: hidden;
	border-radius: var(--radius-full, 9999px);
	cursor: pointer;
	transition: background-color 0.25s ease;
}

.indicator {
	position: absolute;
	width: 18px;
	height: 18px;
	border-radius: var(--radius-full, 9999px);
	transition:
		left 0.25s ease,
		background 0.25s ease,
		box-shadow 0.25s ease,
		transform 0.25s ease;
}

.switch.active {
	background-color: rgb(221 221 223 / 50%);
}

.switch.active .indicator {
	/* FIXME: not use fixed value */
	left: 46%;
	background: #a6a6a6;
	box-shadow:
		0 0 4px 0 #ffffff inset,
		0 7px 9px 0 #ffffff inset,
		3px 0 9px 0 #ffffff;
	transform: translateX(0);
}

.switch.unactive {
	background: rgb(92 92 97 / 50%);
}

.switch.unactive .indicator {
	left: 0;
	background: #3b3b3b;
	box-shadow:
		0 0 4px 0 #737373 inset,
		0 5px 9px 0 #676767 inset;
	transform: translateX(0);
}

.switch:active .indicator {
	transform: scale(0.92);
}
</style>
