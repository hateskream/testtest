<script setup lang="ts">
import { computed, type CSSProperties, useTemplateRef } from 'vue';

import { usePointerScroll } from '@/shared/composables';

const MIN_FADE_SIZE = 6;

export interface IScrollableRow {
	/**
	 * Минимальное преодоленное расстояние (в пикселях) для старта перемещения.
	 * Необходимо для предотвращения перемещения при клике на интерактивный элемент.
	 * Установите в `0` для немедленного перетаскивания.
	 * @default 4
	 */
	dragThreshold?: number;

	/**
	 * Показывать fade-gradient для индикации переполнения.
	 * Автоматически скрывается, если контент не переполняет контейнер.
	 * @default false
	 */
	fade?: boolean;

	/**
	 * Размер fade-gradient в пикселях.
	 * Применим только если `fade` включен.
	 * @default 1;
	 */
	fadeSize?: number;

	/**
	 * Gap scrollable элементов, если их несколько.
	 * @default 6px
	 */
	gap?: CSSProperties['gap'];

	/**
	 * Align-items scrollable контейнера
	 */
	alignItems?: CSSProperties['alignItems'];
}

const props = withDefaults(defineProps<IScrollableRow>(), {
	dragThreshold: 4,
	fadeSize: 24,
	gap: '6px',
	alignItems: 'center',
	fade: true,
});

const finalFadeSize = computed(() => Math.max(props.fadeSize, MIN_FADE_SIZE));

const fadeSizeInPx = computed(() => `${finalFadeSize.value}px`);

const scrollableRef = useTemplateRef('scrollable');

const { state } = usePointerScroll(scrollableRef, { dragThreshold: props.dragThreshold });
</script>

<template>
	<div
		:class="[
			classes.scrollableRow,
			{
				[classes.fade]: props.fade,
				[classes.overflowing]: state.isOverflowing,
				[classes.left]: !state.left,
				[classes.right]: !state.right,
			}
		]"
	>
		<div
			ref="scrollable"
			tabindex="0"
			:class="classes.scrollable"
		>
			<slot />
		</div>
	</div>
</template>

<style module="classes">
@layer kit {
	.scrollableRow {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		overflow: hidden;
	}

	.scrollableRow.fade.overflowing.left:not(.right) {
		mask-image:
			linear-gradient(
				to right,
				transparent 0,
				rgb(255 255 255 / 70%) calc(v-bind(fadeSizeInPx) * 0.5),
				#ffffff v-bind(fadeSizeInPx),
				#ffffff 100%
			);
	}

	.scrollableRow.fade.overflowing.right:not(.left) {
		mask-image:
			linear-gradient(
				to right,
				#ffffff 0,
				#ffffff calc(100% - v-bind(fadeSizeInPx)),
				rgb(255 255 255 / 70%) calc(100% - calc(v-bind(fadeSizeInPx) * 0.5)),
				transparent 100%
			);
	}


	.scrollableRow.fade.overflowing.left.right {
		mask-image:
			linear-gradient(
				to right,
				transparent 0,
				rgb(255 255 255 / 70%) calc(v-bind(fadeSizeInPx) * 0.5),
				#ffffff v-bind(fadeSizeInPx),
				#ffffff calc(100% - v-bind(fadeSizeInPx)),
				rgb(255 255 255 / 70%) calc(100% - calc(v-bind(fadeSizeInPx) * 0.5)),
				transparent 100%
			);
	}

	.scrollable {
		display: flex;
		align-items: v-bind(alignItems);
		align-self: stretch;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		overflow-x: scroll;
		user-select: none;
		gap: v-bind(gap);
		touch-action: pan-x;
		overscroll-behavior-x: contain;
		scrollbar-width: none;
	}

	.scrollableRow.overflowing.fade .scrollable {
		cursor: grab;
	}

	.scrollableRow.overflowing .scrollable:active {
		cursor: grabbing;
	}

	.scrollable::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
}
</style>
