<script setup lang="ts">
import { ref } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

const isTableHeadColumns = ref(false);
</script>

<template>
	<div :class="classes.metrics">
		<ui-icon
			:id="IconIds.Tertiary"
			:class="classes.iconTertiary"
			width="20"
			height="20"
			@click="isTableHeadColumns = !isTableHeadColumns"
		/>

		<table-columns-settings-component v-show="isTableHeadColumns" />
	</div>
</template>

<style module="classes">
.metrics {
	position: absolute;
	top: 0;
	right: 0;
	z-index: 100;
	height: 20px;
	background-color: var(--bg-color-surface-01);
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
