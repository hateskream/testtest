<script setup lang="ts">
const selectedNewsId = defineModel<string | null>('newsId', {
	required: true,
});
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="[classes.list, selectedNewsId && classes.selectedList]">
			<slot name="default" />
		</div>

		<div v-if="selectedNewsId" :class="classes.details">
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

	.selectedList {
		visibility: hidden;
	}
}
</style>
