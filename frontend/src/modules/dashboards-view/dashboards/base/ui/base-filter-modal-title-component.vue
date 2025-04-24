<template>
	<div :class="classes.title">
		<slot />
	</div>
</template>

<style module="classes">
.title {
	padding: 12px 0;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-100);
}
</style>
