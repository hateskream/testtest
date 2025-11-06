<script setup lang="ts">
import { computed } from 'vue';

import {
	type IDisplaySettings,
	type ITicker,
} from '../../model';
import type { IMeta } from '@/modules/dashboard-group';

import CellComponent from './cell-component.vue';

interface IViewComponentProps {
	tickers: ITicker[];
	settings: IDisplaySettings;
	meta: IMeta;
	hasPin: boolean;
}

const props = defineProps<IViewComponentProps>();

const emit = defineEmits<{
	(e: 'togglePin', tickerId: string): void;
}>();

const gridTemplateContent = computed(() => {
	const defaultMinWidth = props.meta.size.w > 1 ? 190 : 100;

	let minWidth = defaultMinWidth + ((
		(+(props.settings.isShowChart && props.meta.size.w > 1)) +
		+props.settings.isShowPercentageChange +
		(+(props.settings.isShowLogo && props.meta.size.w > 1)) +
		+props.settings.isShowTicker +
		+props.settings.isShowDescription
	) * 30);


	return `repeat(auto-fit, minmax(${minWidth}px, 1fr)) `;
});
</script>

<template>
	<div :class="classes.root">
		<slot name="header" />
		<div :class="classes.scrollable">
			<div :class="classes.content">
				<div
					:class="classes.contentWrapped"
				>
					<cell-component
						v-for="ticker in props.tickers"
						:key="ticker.tickerId"
						:settings="props.settings"
						:ticker="ticker"
						:meta="meta"
						:has-pin="props.hasPin"
						@toggle-pin="emit('togglePin', $event)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.filter {
	margin-left: 6px;
}

.scrollable {
	position: relative;
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
}

.content {
	width: 100%;
	height: auto;
}

.contentWrapped {
	display: grid;
	grid-template-columns: v-bind(gridTemplateContent);
	width: 100%;
}

.lineDelimiterGroup {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-left: 6px;
}
</style>
