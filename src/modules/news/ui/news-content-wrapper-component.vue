<script setup lang="ts">
const state = defineModel<boolean>('state', {
	default: true,
});
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="[classes.list, state && classes.selectedList]">
			<slot name="default" />
		</div>

		<div v-if="state" :class="classes.details">
			<div :class="classes.controls">
				<slot name="controls" />
			</div>

			<slot name="details" />
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: inherit;
	container: wrapper / inline-size;
}

.list {
	width: 100%;
	height: 100%;
}

.selectedList {
	width: 100%;
	max-width: 325px;
}

.controls {
	display: none;
}

.details {
	width: 100%;
	min-width: 50%;
	height: 100%;
}

@container wrapper (max-width: 650px) {
	.details {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		min-width: unset;
		height: 100%;
	}

	.controls {
		display: unset;
	}

	.selectedList {
		visibility: hidden;
		opacity: 0;
	}
}
</style>
