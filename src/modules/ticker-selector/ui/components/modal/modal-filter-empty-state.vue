<script setup lang="ts"></script>
<template>
	<div :class="classes.empty">
		<slot />
	</div>
</template>

<style module="classes">
.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 112px;
	font-style: normal;
	font-weight: 440;
	font-size: 11px;
	text-align: center;
	color: var(--text-color-base-300);
	letter-spacing: 0.088px;
}
</style>
