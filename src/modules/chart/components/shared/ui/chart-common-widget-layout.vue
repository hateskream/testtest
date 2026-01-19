<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

interface IProps {
	withoutPadding?: boolean;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.widgetWrapper">
		<div :class="classes.widget">
			<div
				v-if="$slots.header"
				:class="classes.header"
				class="title-300"
			>
				<ui-text token="text-200-r">
					<slot name="header"></slot>
				</ui-text>
			</div>
			<div
				:class="props.withoutPadding? '' : classes.body"
			>
				<slot name="body"></slot>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.widgetWrapper {
	background: var(--surface-01, rgb(17 17 19 / 92%));
	border: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius: 18px;
}

.widget {
	width: 100%;
	overflow: hidden;
}

.header {
	display: flex;
	align-items: center;
	height: 40px;
	padding: 0 18px 0 14px;
}

.body {
	padding: 8px 16px 12px;
}
</style>
