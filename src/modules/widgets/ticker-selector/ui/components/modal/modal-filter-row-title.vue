<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IProps {
	isBack?: boolean;
	isSelectedAll: boolean;
	isSearching: boolean;
	isInsideOpen: boolean;
}

withDefaults(defineProps<IProps>(), {
	isBack: false,
});

interface IEmits {
	(e: 'selectAll'): void;
}

const emits = defineEmits<IEmits>();
</script>

<template>
	<div :class="classes.title">
		<div :class="classes.titleText">
			<ui-icon v-if="isBack" :id="IconIds.Back" />
			<slot name="title" />
			<span>·</span>
			<span :class="classes.titleBadge">
				<slot name="count" />
			</span>
		</div>

		<div :class="classes.titleEnd">
			<div
				v-if="!isSearching"
				:class="classes.selectAll"
				@click.prevent.stop="emits('selectAll')"
			>
				{{ isSelectedAll ? 'Unselect All' : 'Select All' }}
			</div>

			<ui-icon
				v-if="!isInsideOpen"
				:id="IconIds.Arrow"
				width="12"
				height="12"
				:class="classes.titleIconContinue"
			/>
		</div>
	</div>
</template>

<style module="classes">
.title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 44px;
	margin-top: 4px;
	border-radius: 20px;
	cursor: pointer;
	transition: background 0.3s ease, color 0.3s ease;
	padding-inline: 12px;
}

.titleText {
	display: flex;
	align-items: center;
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	text-transform: capitalize;
	letter-spacing: 0.052px;
	gap: 6px;
}

.title:hover {
	color: #ffffff;
	background: rgb(45 45 47 / 40%);
}

.titleBadge {
	padding: 4px 6px;
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-300) !important;
	background-color: rgb(255 255 255 / 9%);
	border-radius: 8px;
}

.selectAll {
	display: none;
	font-style: normal;
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
	justify-self: flex-end;
}


.title:hover .selectAll {
	display: block;
}

.titleIconContinue {
	color: #646568;
	transform: rotateY(180deg);
}

.titleEnd {
	display: flex;
	gap: 12px;
	align-items: center;
}
</style>
