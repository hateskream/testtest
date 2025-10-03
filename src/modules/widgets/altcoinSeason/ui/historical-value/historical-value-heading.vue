<script setup lang="ts">

</script>

<template>
	<div :class="classes.heading">
		<div :class="classes.headingTitle">
			Historical values
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
	display: -webkit-box;
	padding: 12px 0;
	overflow: hidden;
	font-style: normal;
	font-weight: 440;
	font-size: 12px;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.08px;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
</style>
