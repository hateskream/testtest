<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from 'vue-router';
import { computed } from 'vue';

import { IconIds } from '@/shared/ui/icon';
import { UiControlIcon } from '@/shared/ui/control-icon';
import { UiChip } from '@/shared/ui/chip';

const props = defineProps<{
	to: RouteLocationRaw;
	external?: boolean;
	target?: HTMLAnchorElement['target'];
}>();

const LinkComponent = computed(() => props.external ? 'a' : RouterLink);

const linkProps = computed(() => {
	if (props.external) {
		return {
			href: props.to,
			target: props.target,
			rel: 'noopener',
		};
	}

	return {
		to: props.to,
	};
});
</script>

<template>
	<link-component :class="classes.control" v-bind="linkProps">
		<ui-chip :class="classes.label">
			<slot />
		</ui-chip>
		<ui-control-icon :icon="IconIds.ArrowToTopRight" :class="classes.icon" />
	</link-component>
</template>

<style module="classes">
.control {
	display: flex;
	align-items: center;
	gap: var(--padding-s1, 1px);
}

.label {
	border-radius:
		var(--radius-s12-24, 9.2px)
		var(--radius-s5-8, 2.8px)
		var(--radius-s5-8, 2.8px)
		var(--radius-s12-24, 9.2px);
}

.icon {
	border-radius:
		var(--radius-s5-8, 2.8px)
		var(--radius-s12-24, 9.2px)
		var(--radius-s12-24, 9.2px)
		var(--radius-s5-8, 2.8px);
}
</style>
