<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

const props = defineProps<{
	active: boolean;
	isAllSelected: boolean;
	disableSelectAll?: boolean;
}>();

const emits = defineEmits<{
	selectMarket: [];
	unselectMarket: [];
}>();

function onSelectFullClick() {
	props.isAllSelected ? emits('unselectMarket') : emits('selectMarket');
}
</script>

<template>
	<button :class="[classes.title, {[classes.active]: props.active}]">
		<span :class="classes.text" class="text-200-r">
			<slot />
		</span>

		<span :class="classes.right">
			<button
				v-if="!props.disableSelectAll"
				:class="classes.selectFull"
				class="text-50-r"
				@click.stop="onSelectFullClick"
			>
				{{props.isAllSelected ? 'Unselect all' : 'Select all'}}
			</button>

			<ui-icon
				:id="IconIds.Arrow"
				width="12px"
				height="12px"
				:class="classes.icon"
			/>
		</span>
	</button>
</template>

<style module="classes">
.title {
	display: flex;
	flex: 1 0 0;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	width: 100%;
	min-height: var(--height-height-s15, 36px);
	padding: 0 12px;
	color: rgb(255 255 255 / 62%);
	border-radius: var(--radius-radius-s15-36, 14px);
	cursor: pointer;
}

.title:hover {
	background: var(--atom-base-50, rgb(73 73 80 / 52%));
}

.text,
.selectFull {
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	letter-spacing: 0.122px;
}

.right {
	display: flex;
	align-items: center;
	gap: 6px;
}

.icon {
	line-height: 0;
	transform: rotate(180deg);
	transform-origin: center center;
	transition: transform 0.25s ease;
}

.selectFull {
	display: none;
	font-size: var(--font-text-100-r-size);
	color: #9a9a9d;
	cursor: pointer;
}

.selectFull:hover {
	color: rgb(255 255 255 / 100%);
	text-decoration: underline;
}

.title:hover .selectFull {
	display: block;
}

.title.active .icon {
	transform: rotate(270deg);
}
</style>
