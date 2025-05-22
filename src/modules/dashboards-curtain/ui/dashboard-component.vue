<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';


interface IDashboardComponentProps {
	title: string;
	description: string;
	icon: IconIds;
}

const props = defineProps<IDashboardComponentProps>();

</script>

<template>
	<div :class="classes.root">
		<div :class="classes.icon">
			<ui-icon
				:id="props.icon"
				width="20px"
				height="20px"
			/>
		</div>
		<div :class="classes.text">
			<div :class="classes.title">
				{{ props.title }}
			</div>
			<div :class="classes.dot">·</div>
			<div :class="classes.description">
				{{ props.description }}
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	width: 272px;
	max-width: 272px;
	padding: 4px;
	gap: 12px;
	border-radius: 12px;
}

.root:hover {
	background: rgb(54 54 58 / 27%);
}

.root:hover .icon {
	color: #ffffff;
}

.icon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	color: var(--icon-color-base-300);
	border: 1px solid var(--border-color-base-300);
	border-radius: 8px;
}

.text {
	display: flex;
	flex: 1;
	align-items: center;
	min-width: 0;
	gap: 6px;
}

.title {
	flex-shrink: 0;
	overflow: hidden;
	font-style: normal;
	font-weight: 300;
	font-size: 14px;
	line-height: 140%;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.dot {
	flex-shrink: 0;
	overflow: hidden;
	font-style: normal;
	font-weight: 440;
	font-size: 14px;
	line-height: 140%;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.096px;
	text-overflow: ellipsis;
}

.description {
	flex: 1;
	overflow: hidden;
	font-style: normal;
	font-weight: 440;
	font-size: 14px;
	line-height: 140%;
	color: var(--color-text-base-300, rgb(154 154 157));
	letter-spacing: 0.096px;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
