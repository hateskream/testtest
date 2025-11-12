<script setup lang="ts">

import { UiTooltip } from '@/shared/ui/tooltip';

const props = withDefaults(defineProps<{
	title: string;
	text: string;
	release?: string;
}>(), { release: 'Soon' });
</script>

<template>
	<ui-tooltip
		:show-in-ms="600"
		:blur="false"
		position="right"
	>
		<template #content>
			<div :class="classes.root">
				<div :class="classes.header">
					<span :class="classes.title">{{ props.title }}</span>
					<span :class="classes.release">{{ props.release }}</span>
				</div>
				<p :class="classes.text">{{ props.text }}</p>
			</div>
		</template>
		<slot />
	</ui-tooltip>
</template>

<style module="classes">
	.root {
		display: flex;
		flex-direction: column;
		width: 212px;
		padding: 6px 4px;
		gap: 3px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
	}

	.title {
		overflow-x: hidden;
		font-weight: 510;
		font-size: var(--font-text-200-b-size, 12.2px);
		line-height: 180%;
		color: var(--text-500, rgb(255 255 255 / 96%));
		letter-spacing: 0.122px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.release {
		font-weight: 490;
		font-size: 10px;
		line-height: 165%;
		color: #ffffff;
		letter-spacing: 0.08px;
	}

	.text {
		font-weight: 400;
		font-size: var(--font-text-200-r-size, 12.2px);
		line-height: 180%;
		color: var(--text-300, rgb(255 255 255 / 62%));
		letter-spacing: 0.122px;
	}
</style>
