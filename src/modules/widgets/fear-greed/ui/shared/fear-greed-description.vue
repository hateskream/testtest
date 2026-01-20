<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import { UiTransitionFade } from '@/shared/ui/transition';
import type { ISettings, ISize, ITension, ITensionTextData } from '@/modules/widgets/fear-greed/model';
import { UiText } from '@/shared/ui/text';

interface IProps {
	tension: ITension;
	viewState: ISettings;
	size: ISize;
	text: ITensionTextData;
	showDescription: boolean;
}

const props = defineProps<IProps>();

const metricTextStyles = computed<CSSProperties>(() => ({
	marginTop: props.viewState.isShowChart && props.size.h > 2 ? '-30px' : 0,
}));
</script>

<template>
	<div
		:class="classes.metricDescription"
		:style="metricTextStyles"
	>
		<ui-text
			token="text-500-b"
			:class="classes.count"
			:style="{ color: props.text.colors.text }"
		>
			{{ tension.tension }}
		</ui-text>
		<ui-transition-fade>
			<ui-text
				v-if="props.viewState.isShowName"
				:class="classes.dossier"
				token="text-300-r"
			>
				{{ props.text.text.main }}
			</ui-text>
		</ui-transition-fade>
		<ui-transition-fade>
			<ui-text
				v-if="props.showDescription"
				token="text-300-b"
				:class="classes.desc"
			>
				{{ props.text.text.sub }}
			</ui-text>
		</ui-transition-fade>
	</div>
</template>

<style module="classes">
.metricDescription > h3 {
	font-weight: 460;
	font-size: 28px;
	color: var(--common-color-white-700);
}

.metricDescription {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	height: 70px;
}

.count {
	overflow: hidden;
	font-style: normal;
	font-weight: 460;
	font-size: var(--typography-headers-size-h03, 28px);
	line-height: 130%;
	text-align: center;
	color: var(--color-text-base-500, #ffffff);
	text-overflow: ellipsis;
}

.dossier {
	overflow: hidden;
	font-style: normal;
	font-weight: 400;
	font-size: var(--typography-paragraph-size-p00, 13px);
	line-height: 160%; /* 20.8px */
	color: var(--color-text-active-info-500-active, #ffffff);
	letter-spacing: 0.143px;
	text-overflow: ellipsis;
}

.desc {
	overflow: hidden;
	font-style: normal;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-02, 10px);
	line-height: 170%; /* 17px */
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.08px;
	text-overflow: ellipsis;
}
</style>
