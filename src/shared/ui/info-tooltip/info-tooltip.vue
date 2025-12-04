<script setup lang="ts">
import { UiPositionTooltip } from '@/shared/ui/position/ui/tooltip';
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IInfoTooltipProps {
	text: string;
}

const props = defineProps<IInfoTooltipProps>();
</script>

<template>
	<ui-position-tooltip
		:open-delay="10"
		placement="top"
		:class="classes.tooltipWrapper"
	>
		<template #default>
			<div :class="classes.iconWrapper">
				<ui-icon
					:id="IconIds.Info"
					width="6px"
					height="6px"
					:class="classes.icon"
				/>
			</div>
		</template>
		<template #content>
			<slot>{{ props.text }}</slot>
		</template>
	</ui-position-tooltip>
</template>

<style module="classes">
.tooltipWrapper {
	cursor: pointer;

	&:hover {
		.iconWrapper {
			color: var(--text-color-base-500);
		}
	}
}

.iconWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 12px;
	height: 12px;
	font-size: 8px;
	line-height: 1;
	color: var(--text-color-base-300);
	background-color: rgb(217 217 217 / 20%);
	border-radius: 99999px;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	user-select: none;
}

</style>
