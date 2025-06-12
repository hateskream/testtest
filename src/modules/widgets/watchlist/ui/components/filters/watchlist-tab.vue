<script setup lang="ts">

import type { IWatchlistTab } from '../../../model';
import { UiIcon, IconIds } from '@/shared/ui/icon';

interface IWatchlistFilterChipsProps {
	tabs: IWatchlistTab;
	isOpen?: boolean;
}


const props = defineProps<IWatchlistFilterChipsProps>();


</script>

<template>
	<div :class="classes.root">
		<span :class="classes.name">{{ props.tabs.name }}</span>
		<ui-icon
			:id="IconIds.DropdownDown"
			:class="[
				classes.icon,
				props.isOpen ? classes.icon__open : classes.icon__close
			]"
			width="12px"
			height="12px"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: flex-start;
	align-self: stretch;
	padding: 8px 12px;
	background: var(--bg-color-base-300);
	border-radius: 9999px;
	gap: 2px;
}

.name {
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01);
	color: var(--text-color-base-300-activated);
	letter-spacing: 0.096px;
}

.icon {
	color: var(--icon-color-base-300);
}

.icon__open {
	transform: rotate(180deg);
	transition: transform 0.3s ease;
}

.icon__close {
	transition: transform 0.3s ease;
}
</style>
