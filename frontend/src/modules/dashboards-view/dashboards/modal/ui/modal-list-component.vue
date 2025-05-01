<script setup lang="ts">
import { UiPosition } from '@/shared/ui/position';
</script>

<template>
	<ui-position position="bottom-start">
		<template #default>
			<div :class="classes.title">
				<slot name="title" />
			</div>
		</template>

		<template #content>
			<div :class="classes.content">
				<slot name="content" />
			</div>
		</template>
	</ui-position>
</template>

<style module="classes">
.content {
	width: max-content;
	min-width: 208px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}

.title {
	padding: 7.5px 12px;
	font-weight: 300;
	font-size: 10px;
	text-align: left;
	color: var(--text-color-base-300);
	background-color: var(--bg-color-base-300);
	border-radius: 18px;
	cursor: pointer;
}
</style>
