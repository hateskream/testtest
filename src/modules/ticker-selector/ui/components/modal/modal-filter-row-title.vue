<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';

interface IProps {
	displayVariant: 'new' | 'default';
	isBack?: boolean;
	isSelectedAll: boolean;
	isSearching: boolean;
	isInsideOpen: boolean;
	enableSelectAll?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
	isBack: false,
	enableSelectAll: true,
});

interface IEmits {
	(e: 'selectAll'): void;
}

const emits = defineEmits<IEmits>();

const isNewUi = computed(() => props.displayVariant === 'new');
</script>

<template>
	<div
		:class="[
			classes.title,
			isInsideOpen && classes.insideOpen,
			isNewUi ? classes.new : classes.old
		]"
	>
		<div :class="classes.titleText">
			<ui-icon
				v-if="isBack"
				:id="IconIds.Arrow"
				width="12px"
				height="12px"
				:class="classes.back"
			/>

			<ui-text token="text-200-r">
				<slot name="title" />
			</ui-text>

			<span v-if="!isNewUi">·</span>

			<ui-text
				v-if="!isNewUi"
				:class="classes.titleBadge"
				token="text-200-r"
			>
				<slot name="count" />
			</ui-text>
		</div>

		<div :class="classes.titleEnd">
			<div
				v-if="!isSearching && enableSelectAll"
				:class="classes.selectAll"
				@click.prevent.stop="emits('selectAll')"
			>
				{{ isSelectedAll ? 'Unselect All' : 'Select All' }}
			</div>

			<ui-icon
				v-if="!isInsideOpen"
				:id="IconIds.Arrow"
				width="12px"
				height="12px"
				:class="classes.titleIconContinue"
			/>
		</div>
	</div>
</template>

<style module="classes">
.title {
	position: static;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 44px;
	margin-bottom: 2px;
	cursor: pointer;
	transition: background 0.3s ease, color 0.3s ease;
	padding-inline: 12px;
}

.new {
	height: 40px;
	border-radius: 12px;
}

.old {
	height: 44px;
	border-radius: 20px;
}

.titleText {
	display: flex;
	align-items: center;
	color: var(--text-color-base-300);
	text-transform: capitalize;
	gap: 6px;
}

.title.insideOpen .titleText {
	color: rgb(255 255 255 / 100%);
}

.back {
	color: var(--text-color-base-300);
	transform: rotate(180deg);
}

.title:hover {
	color: #ffffff;
	background: rgb(45 45 47 / 40%);
}

.titleBadge {
	padding: 4px 6px;
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
