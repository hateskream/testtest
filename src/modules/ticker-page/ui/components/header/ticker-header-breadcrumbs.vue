<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
import { useGoToTickerPage } from '@/modules/chart';
import type { ITickerItemExtended } from '@/modules/ticker-page/api/get-ticker-page-meta';
import { RouteNames } from '@/types/route.d';

const props = defineProps<{
	ticker: ITickerItemExtended;
}>();

const { goToTickerPageLink } = useGoToTickerPage();
</script>

<template>
	<div :class="classes.breadcrumbs">
		<router-link
			:to="{name: RouteNames.Home}"
			:class="classes.item"
		>
			<ui-text token="text-200-b">Home</ui-text>
		</router-link>

		<div :class="classes.separator">
			/
		</div>

		<router-link
			:to="goToTickerPageLink(props.ticker.canonical_ticker_id)"
			:class="classes.item"
			:active-class="classes.active"
		>
			<ui-text token="text-200-b">{{ props.ticker.symbol }}</ui-text>
		</router-link>
	</div>
</template>

<style module="classes">
.breadcrumbs {
	display: flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	color: var(--text-300, rgb(255 255 255 / 62%));
	gap: var(--padding-padding-s4, 6px);
}

.item {
	font-size: var(--font-text-200-b-size, 12.2px);
}

.item:hover {
	color: var(--text-500, rgb(255 255 255 / 96%));
	text-decoration: underline;
}

.active {
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
