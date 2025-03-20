<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.title">
			<div :class="classes.titleText">
				<slot name="title" />
			</div>

			<div :class="classes.control">
				<ui-icon
					:id="IconIds.ControlMore"
					:class="classes.iconWrapper"
					width="20px"
					height="20px"
				/>
				<ui-icon
					:id="IconIds.ControlShare"
					:class="classes.iconWrapper"
					width="20px"
					height="20px"
				/>
			</div>
		</div>

		<slot name="default" />
	</div>
</template>

<style module="classes">
.iconWrapper {
	color: var(--icon-color-base-300);
	cursor: pointer;
}

.container {
	padding: 0 16px 18px;
	background-color: var(--bg-color-surface-01);
	border-radius: 18px;
}

.title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 8px 10px 16px;
	color: var(--text-color-base-300);
}

.titleText {
	font-weight: 300;
	font-size: 16px;
	line-height: 140%;
	color: var(--text-color-base-300);
	letter-spacing: 0.104px;
}

.control {
	display: flex;
	align-items: center;
	gap: 26px;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.title:hover > .control {
	opacity: 1;
}
</style>
