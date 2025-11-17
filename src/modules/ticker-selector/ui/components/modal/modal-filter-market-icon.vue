<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IProps {
	icon: IconIds;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.marketIconWrapper">
		<ui-icon
			:id="props.icon"
			width="22px"
			height="22px"
			:class="classes.marketIcon"
		/>
	</div>
</template>

<style module="classes">
.marketIconWrapper {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 22px;
	height: 22px;
	padding: 4px;
	text-align: center;
	background: transparent;
	border: 1px solid var(--border-color-base-300);
	border-radius: 999px;
	backdrop-filter: none;
	isolation: isolate;
}

.marketIcon {
	color: var(--icon-color-base-300);
}
</style>
