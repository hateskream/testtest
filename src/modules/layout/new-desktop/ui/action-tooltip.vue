<script setup lang="ts">
import type { Placement } from '@floating-ui/vue';

import { UiPositionTooltip } from '@/shared/ui/position';
import { DashboardTooltipWrapper } from '@/shared/ui/tooltip';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';

const props = withDefaults(defineProps<{
	title: string;
	text: string;
	placement?: Placement;
	disable?: boolean;
}>(), {
	placement: 'right',
	disable: false,
});
</script>

<template>
	<ui-position-tooltip
		:open-delay="600"
		:placement="props.placement"
	>
		<template v-if="!props.disable" #content>
			<dashboard-tooltip-wrapper>
				<div :class="classes.root">
					<div :class="classes.header">
						<slot name="header">
							<ui-clamped
								:class="classes.title"
								:rows="1"
								as="span"
							>
								<ui-text token="text-200-b">{{ props.title }}</ui-text>
							</ui-clamped>
						</slot>
					</div>
					<ui-text
						:class="classes.text"
						token="text-200-r"
						tag="p"
					>
						{{ props.text }}
					</ui-text>
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
	flex: 1 0 0;
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.text {
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
