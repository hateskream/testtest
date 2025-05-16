<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';
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
			<table-columns-settings-component />
		</template>
	</ui-position>
</template>

<style module="classes">
.iconTertiary {
	color: var(--icon-color-base-300);
	transition: color 0.3s ease-in;
}

.iconTertiary:hover {
	color: var(--icon-color-base-300-effect);
}
</style>
