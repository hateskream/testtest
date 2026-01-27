<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, toRef, type CSSProperties } from 'vue';

import { useTickerSectionLoader } from '../composables';
import type { TickerSectionComponent } from '../models';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IProps {
	sectionType: TickerSectionComponent;
	title: string;
	height: CSSProperties['height'];
}

interface IEmits {
	(e: 'error', error: Error): void;

	(e: 'dismiss'): void;

	(e: 'loaded'): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const componentKey = ref(0);
const isRetrying = ref(false);
const isVisible = ref(false);
const containerRef = ref<HTMLElement | null>(null);

let observer: IntersectionObserver | null = null;

const {
	component,
	error,
	retry,
} = useTickerSectionLoader(toRef(props, 'sectionType'));


watch(error, (newError) => {
	if (newError) {
		emit('error', newError);
	}
});

function handleResolve() {
	isRetrying.value = false;
	emit('loaded');
}

async function handleRetry() {
	if (isRetrying.value) {
		return;
	}

	isRetrying.value = true;
	componentKey.value += 1;

	try {
		await retry();
	} finally {
		setTimeout(() => {
			isRetrying.value = false;
		}, 500);
	}
};

onMounted(() => {
	if (!containerRef.value) {
		return;
	}

	observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && !isVisible.value) {
					isVisible.value = true;
					if (observer) {
						observer.disconnect();
					}
				}
			});
		},
		{
			threshold: 0.1,
		},
	);

	observer.observe(containerRef.value);
	onUnmounted(() => {
		if (observer) {
			observer.disconnect();
		}
	});
});


</script>

<template>
	<div ref="containerRef" :class="classes.container">
		<div :class="classes.sectionTitle">
			<ui-icon
				:id="IconIds.Deals"
				:class="classes.titleIcon"
				width="20px"
				height="20px"
			/>
			<span>{{ props.title }}</span>
		</div>

		<div :class="classes.contentWrapper" :style="{minHeight: props.height + 'px'}">
			<suspense
				v-if="!error && isVisible"
				:key="componentKey"
				@resolve="handleResolve"
			>
				<template #default>
					<component
						:is="component"
						v-if="component"
						v-bind="$attrs"
					/>
				</template>

				<template #fallback>
					<ui-skeleton
						:class="classes.skeleton"
						border-radius="12px"
						width="100%"
						height="100%"
					/>
				</template>
			</suspense>

			<ui-skeleton
				v-else-if="!error && !isVisible"
				:class="classes.skeleton"
				border-radius="12px"
				width="100%"
				:height="`${props.height}px`"
			/>

			<div
				v-else-if="error"
				:class="classes.errorContainer"
				:style="{height: props.height}"
			>
				<div :class="classes.errorContent">
					<p>Не удалось загрузить</p>
					<div :class="classes.narrowContent" @click="handleRetry">
						<span :class="classes.retryContainer">
							<svg
								:class="classes.icon"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0
6.84-2.55
7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22
1.78L13 11h7V4l-2.35 2.35z"
									fill="currentColor"
								/>
							</svg>
							<span :class="classes.retryText">Повторить</span>
						</span>
						<button :class="classes.retryButton">R</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.sectionTitle {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	margin-bottom: 22px;
	padding: 12px 16px 12px 0;
	font-size: var(--font-title-400-size);
	background: var(--bg-color-surface-00);
	gap: 8px;
}

.titleIcon {
	color: #ffffff;
}

.contentWrapper {
	position: relative;
}

.skeleton {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}

.errorContainer {
	display: flex;
	justify-content: center;
	padding: 6px 0;
}

.errorContent {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: fit-content;
	padding: 8px 32px;
	color: var(--text-color-base-100);
	background-color: var(--bg-color-base-100);
	border-radius: 28px;
}

.errorContent p {
	margin: 0;
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
}

.narrowContent {
	display: flex;
	align-items: center;
	gap: 8px;
}

.retryContainer {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
}

.icon {
	color: var(--text-color-base-300);
}

.retryText {
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	color: var(--text-color-base-300);
}

.retryButton {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	font-weight: 500;
	font-size: 14px;
	color: var(--text-color-base-100);
	background-color: var(--bg-color-base-300);
	border: none;
	border-radius: 6px;
	cursor: pointer;
}
</style>
