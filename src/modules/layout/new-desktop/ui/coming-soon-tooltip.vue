<script setup lang="ts">
import { UiPositionTooltip } from '@/shared/ui/position';
import { DashboardTooltipWrapper } from '@/shared/ui/tooltip';

const props = withDefaults(defineProps<{
	title: string;
	text: string;
	release?: string;
}>(), { release: 'Soon' });
</script>

<template>
	<ui-position-tooltip
		:open-delay="600"
		placement="right"
	>
		<template #content>
			<dashboard-tooltip-wrapper>
				<div :class="classes.root">
					<div :class="classes.header">
						<span :class="classes.title">{{ props.title }}</span>
						<span :class="classes.release">{{ props.release }}</span>
					</div>
					<p :class="classes.text">{{ props.text }}</p>
				</div>
			</dashboard-tooltip-wrapper>
		</template>
		<slot />
	</ui-position-tooltip>
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
	align-items: center;
	align-self: stretch;
	padding: var(--padding-padding-s0, 0);
	gap: var(--padding-padding-s11, 20px);
}

.title {
	display: -webkit-box;
	flex: 1 0 0;
	overflow: hidden;
	font-style: normal;
	font-weight: 510;
	font-size: var(--font-text-200-b-size, 12.2px);
	line-height: 180%;
	color: var(--text-500, rgb(255 255 255 / 96%));
	letter-spacing: 0.122px;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
}

.release {
	display: -webkit-box;
	overflow: hidden;
	font-style: normal;
	font-weight: 490;
	font-size: 10px;
	line-height: 165%;
	color: #ffffff;
	letter-spacing: 0.08px;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
}

.text {
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.122px;
}
</style>
