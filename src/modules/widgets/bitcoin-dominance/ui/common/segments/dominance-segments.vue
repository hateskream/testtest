<script setup lang="ts">
import type { IDominanceSnapshot } from '../../../model';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';

import DominanceSegmentsIndicator from './dominance-segments-indicator.vue';

interface IViewComponentProps {
	snapshots: IDominanceSnapshot[];
	isShowSegments?: boolean;
	isShowIndicator?: boolean;
}

const props = defineProps<IViewComponentProps>();
</script>

<template>
	<div :class="classes.root">
		<div v-if="isShowSegments" :class="classes.segments">
			<div
				v-for="item in props.snapshots"
				:key="item.symbol"
				:class="classes.ticker"
			>
				<div :class="classes.name">
					<div :class="classes.circle" :style="{backgroundColor: item.color}"></div>
					<ui-clamped :rows="1" :class="classes.nameText">
						<ui-text token="text-200-r">
							{{ item.symbol }}
						</ui-text>
					</ui-clamped>
				</div>
				<ui-text
					:class="classes.value"
					token="title-200"
				>
					{{ item.dominance.current.toFixed(1) }}%
				</ui-text>
			</div>
		</div>
		<dominance-segments-indicator
			v-if="isShowIndicator"
			:snapshots="props.snapshots"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
}

.segments {
	display: flex;
	flex-wrap: nowrap;
	overflow-x: auto;
	overflow-y: auto;
	gap: 16px;
}

.ticker {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	width: 80px;
}

.name {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
	color: var(--text-color-base-300);
}

.nameText {
	max-width: 100%;
}

.circle {
	width: 6px;
	height: 6px;
	border-radius: 100%;
}

.value {
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
