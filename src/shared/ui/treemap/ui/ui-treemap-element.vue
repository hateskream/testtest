<script setup lang="ts">
import UiTreemapOther from './ui-treemap-other.vue';
import UiTreemapValue from './ui-treemap-value.vue';

interface IVisibleConfig {
	isShowLogo: boolean;
	isShowTicker: boolean;
	isPercent: boolean;
}

interface ITreeMapItem {
	ticker: string;
	logoUrl: string;
	value: number;
	color: string;
}

interface IUiTreemapItem {
	item: ITreeMapItem | undefined;
	isOther: boolean;
	otherCount: number;
	visibleConfig: IVisibleConfig;
}

const props = defineProps<IUiTreemapItem>();

const emit = defineEmits<{
	(e: 'hover', ticker: string): void;
	(e: 'unhover'): void;
	(e: 'click-other'): void;
}>();
</script>
<template>
	<ui-treemap-other
		v-if="props.isOther"
		:count="props.otherCount"
		@click-other="emit('click-other')"
	/>
	<ui-treemap-value
		v-else-if="props.item"
		:ticker="props.item.ticker"
		:logo-url="props.item.logoUrl"
		:value="props.item.value"
		:color="props.item.color"
		:visible-config="props.visibleConfig"
		@hover="emit('hover', props.item.ticker)"
		@unhover="emit('unhover')"
	/>
</template>

