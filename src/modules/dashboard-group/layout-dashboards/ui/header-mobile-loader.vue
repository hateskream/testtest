<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.navbar">
		<div :class="classes.line" />
		<div :class="classes.content">
			<ui-skeleton width="80px" height="24px" />
			<div :class="classes.divider" />
			<div :class="classes.tabs">
				<ui-skeleton width="45px" height="24px" />
				<ui-skeleton width="45px" height="24px" />
				<ui-skeleton width="45px" height="24px" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.navbar {
	display: flex;
	flex-direction: column;
}

.line {
	position: relative;
	width: 100%;
	height: 1px;
	overflow: hidden;
	background: rgb(255 255 255 / 8%);
}

.line::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background:
		linear-gradient(
			to right,
			rgb(255 255 255 / 0%) 0%,
			rgb(255 255 255 / 8%) 50%,
			rgb(255 255 255 / 0%) 100%
		);
}

.content {
	display: flex;
	align-items: center;
	height: 52px;
	padding: 0 12px;
	border-bottom: 1px solid rgb(255 255 255 / 8%);
}

.divider {
	width: 1px;
	height: 16px;
	margin-right: 8px;
	margin-left: 16px;
	background: rgb(255 255 255 / 18%);
}

.tabs {
	display: flex;
	flex-grow: 1;
	align-items: center;
	overflow: auto;
	font-style: normal;
	font-weight: 450;
	font-size: 12px;
	line-height: 20px;
	letter-spacing: 0.059px;
	gap: 4px;
	scrollbar-width: none;
}
</style>
