<script setup lang="ts">
import { useQueryDisplaySettings } from '../query';
import { useDisplaySettings } from '../composables/';

import SettingsComponent from './settings-component.vue';

const { data: settings } = useQueryDisplaySettings();

const {
	marketSettings,
	sizeBySettings,
	colorBySettings,
	colorDepthSettings,
	displayValueSettings,
} = useDisplaySettings(settings);
</script>

<template>
	<settings-component
		:market="marketSettings"
		:size-by="sizeBySettings"
		:color-by="colorBySettings"
		:color-depth="colorDepthSettings"
		:display-value="displayValueSettings"
	/>
</template>

<style scoped>

</style>
