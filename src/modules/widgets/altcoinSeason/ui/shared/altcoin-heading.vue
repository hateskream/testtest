<script setup lang="ts">

</script>

<template>
	<div :class="classes.heading">
		<div :class="classes.headingTitle">
			<slot />
		</div>
	</div>
</template>

<style module="classes">
.heading {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	align-self: stretch;
}

.headingTitle {
	padding: 10px 0;
	font-size: 12px;
}

.icon {
	color: var(--icon-color-base-300);
}

.icon__open {
	transform: rotate(180deg);
	transition: transform 0.3s ease;
}

.icon__close {
	transition: transform 0.3s ease;
}
</style>
