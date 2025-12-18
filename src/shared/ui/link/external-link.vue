<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { IconIds, UiIcon } from '../icon';
import { UiText } from '@/shared/ui/text';

interface IExternalLinkProps {
	to: string;
	color?: CSSProperties['color'];
}

const props = withDefaults(defineProps<IExternalLinkProps>(), {
	color: 'var(--color-text-base-300, #9a9a9d)',
});

</script>

<template>
	<ui-text
		as="div"
		token="text-300-r"
		:class="classes.externalLink"
	>
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
	</ui-text>
</template>

<style module="classes">
.externalLink {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	color: var(--color-text-base-300, #9a9a9d);
	text-decoration-line: underline;
	text-underline-position: from-font;
}
</style>
