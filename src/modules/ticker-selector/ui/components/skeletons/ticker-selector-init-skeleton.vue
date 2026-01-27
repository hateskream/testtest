<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { SelectionMode } from '@/modules/ticker-selector';

const props = defineProps<{
	selectionMode: SelectionMode;
}>();
</script>

<template>
	<div :class="classes.skeleton">
		<div
			v-if="props.selectionMode === SelectionMode.Multiple"
			:class="classes.pills"
			data-pill-wrapper
		>
			<ui-skeleton
				v-for="pill in 2"
				:key="pill"
				width="50%"
				height="28px"
				:class="classes.pill"
				data-pill-item
			/>
		</div>

		<div :class="classes.markets">
			<ui-skeleton
				v-for="market in 5"
				:key="market"
				display="block"
				width="100%"
				height="36px"
			/>
		</div>
	</div>
</template>

<style module="classes">
.skeleton {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.pills {
	display: flex;
	padding: 6px 12px;
	gap: var(--padding-padding-s1, 1px);
}

.pill {
	width: 50%;
}

[data-pill-wrapper] > [data-pill-item]:first-child {
	border-top-left-radius: var(--control-ct-sm28-radius, 10.8px) !important;
	border-bottom-left-radius: var(--control-ct-sm28-radius, 10.8px) !important;
}

[data-pill-wrapper] > [data-pill-item]:last-child {
	border-top-right-radius: var(--control-ct-sm28-radius, 10.8px) !important;
	border-bottom-right-radius: var(--control-ct-sm28-radius, 10.8px) !important;
}

.markets {
	display: flex;
	flex-direction: column;
	padding: 0 12px 6px;
	gap: 2px;
}
</style>
