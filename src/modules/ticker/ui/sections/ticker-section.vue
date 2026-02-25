<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRef, watch } from 'vue';

import { UiSkeleton } from '@/shared/ui/skeleton';
import { UiText } from '@/shared/ui/text';
import { useTickerSectionLoader } from '../../composables';
import type { ISectionItem, ISectionItemHeightConfig, LayoutType, TickerSectionComponent } from '../../models';
import { isNumber } from '@/shared/lib';

import TickerSectionError from './ticker-section-error.vue';

interface IProps {
	sectionType: TickerSectionComponent;
	title: string;
	height: number | ISectionItemHeightConfig;
	section: ISectionItem;
	layout: LayoutType;
}

interface IEmits {
	error: [error: Error];
	dismiss: [];
	loaded: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const preparedHeight = computed(() => {
	if (isNumber(props.height)) {
		return `${props.height}px`;
	}

	const current = props.height[props.layout];
	return `${current}px`;
});

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
}

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
			<ui-text token="title-300">{{ props.title }}</ui-text>
		</div>
		<div :class="classes.contentWrapper" :style="{ minHeight: preparedHeight }">
			<ticker-section-error
				v-if="error"
				@retry="handleRetry"
			/>
			<suspense
				v-else-if="isVisible"
				:key="componentKey"
				@resolve="handleResolve"
			>
				<template #default>
					<component
						:is="component"
						v-if="component"
						:section="props.section"
						:layout="props.layout"
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
				v-else
				:class="classes.skeleton"
				border-radius="12px"
				width="100%"
				:height="preparedHeight"
			/>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: var(--padding-s4, 6px);
}

.sectionTitle {
	position: sticky;
	top: 0;
	z-index: 10;
	padding: var(--padding-s11, 20px) 0 var(--padding-s9, 16px) 0;
	color: #ffffff;
	background: var(--bg-color-surface-00);
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
</style>
