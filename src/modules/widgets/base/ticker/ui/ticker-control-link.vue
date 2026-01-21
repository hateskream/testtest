<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

import { IconIds } from '@/shared/ui/icon';
import { UiControlIcon } from '@/shared/ui/control-icon';
import { UiChip } from '@/shared/ui/chip';

const props = defineProps<{
	to: RouteLocationRaw;
}>();
</script>

<template>
	<router-link :to="props.to" :class="classes.control">
		<ui-chip :class="classes.label">
			<slot />
		</ui-chip>
		<ui-control-icon :icon="IconIds.ArrowToTopRight" :class="classes.icon" />
	</router-link>
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
