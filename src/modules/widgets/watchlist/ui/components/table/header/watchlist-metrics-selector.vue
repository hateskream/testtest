<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';

import WatchlistColumnSettings from './watchlist-column-settings.vue';
</script>

<template>
	<ui-position position="right-start">
		<template #default>
			<ui-icon
				:id="IconIds.Tertiary"
				:class="classes.iconTertiary"
				width="20"
				height="20"
			/>
		</template>

		<template #content>
			<watchlist-column-settings />
		</template>
	</ui-position>
</template>

<style module="classes">
.metrics {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	cursor: pointer;
}

.iconTertiary {
	color: var(--icon-color-base-300);
	transition: color 0.3s ease-in;
}

.iconTertiary:hover {
	color: var(--icon-color-base-300-effect);
}
</style>
