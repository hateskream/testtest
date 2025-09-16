<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { IconIds, UiIcon } from '../icon';

interface IExternalLinkProps {
	to: string;
	color?: CSSProperties['color'];
}

const props = withDefaults(defineProps<IExternalLinkProps>(), {
	color: 'var(--color-text-base-300, #9a9a9d)',
});

</script>

<template>
	<div :class="classes.externalLink">
		<a
			:href="props.to"
			target="_blank"
			:style="{ color: props.color }"
		>
			<slot />
		</a>

		<ui-icon
			:id="IconIds.ShareIcon"
			width="14"
			height="14"
			:class="classes.icon"
		/>
	</div>
</template>

<style module="classes">
.externalLink {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: var(--typography-paragraph-size-p00, 13px);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.143px;
	text-decoration-line: underline;
	text-underline-position: from-font;
}
</style>
