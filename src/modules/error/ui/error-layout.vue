<script setup lang="ts">
</script>

<template>
	<div :class="classes.layout">
		<div :class="classes.wrapper">
			<div :class="classes.symbol">
				<div :class="classes.symbolWrapper">
				</div>
			</div>
			<div :class="classes.content">
				<slot name="content" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.layout {
	display: flex;
	flex-direction: column;
	height: 100vh;
	padding: 8px 0;
}

.wrapper {
	position: relative;
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	align-items: center;
	padding: 44px 0;
	overflow: hidden;
	border: 1px solid var(--border-100, rgb(73 73 80 / 44%));
	border-radius: 28px;
	gap: 60px;
}

.symbol {
	display: flex;
	flex-grow: 1;
	width: 100%;
}

.symbolWrapper {
	position: absolute;
	bottom: 160px;
	left: 0;
	width: calc(100% - 44px);
	height: 100%;
	margin: 0 22px;
	background: url('/images/error/pattern.svg') center / cover no-repeat;
	mask-image: linear-gradient(180deg, #ffffff 0%, rgb(255 255 255 / 0%) 100%);
}


.content {
	display: flex;
	justify-content: center;
	max-width: 600px;
	padding: 0 24px;
}
</style>
