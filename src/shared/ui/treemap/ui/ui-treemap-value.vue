<script setup lang="ts">
import { computed } from 'vue';

import { prepareNumber, preparePercent } from '../utils';

interface IVisibleConfig {
	isShowLogo: boolean;
	isShowTicker: boolean;
	isPercent: boolean;
}

interface IUiTreemapItem {
	ticker: string;
	logoUrl: string;
	value: number;

	color: string;

	visibleConfig: IVisibleConfig;
}

const props = defineProps<IUiTreemapItem>();

const emit = defineEmits<{
	(e: 'hover', ticker: string): void;
	(e: 'unhover'): void;
}>();

const preparedValue = computed(() => {
	if (props.visibleConfig.isPercent) {
		return preparePercent(props.value);
	}

	return prepareNumber(props.value);
});

</script>
<template>
	<div
		:style="{
			backgroundColor: props.color,
		}"
		class="item"
		@mouseenter="emit('hover', props.ticker)"
		@mouseleave="emit('unhover')"
	>
		<div
			v-if="props.visibleConfig.isShowLogo"
			class="item-logo"
		>
			<!-- <img src="@/assets/images/currency/BTC.png" class="item-logo-image" /> -->
			<img :src="props.logoUrl" class="item-logo-image" />
		</div>
		<div
			v-if="props.visibleConfig.isShowTicker"
			class="item-ticker"
		>
			{{ props.ticker }}
		</div>
		<div
			class="item-value"
		>
			{{ preparedValue }}
		</div>
	</div>
</template>

<style scoped>
.item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	color: #ffffff;
	border: 1px solid #000000;
	container-type: size;
}

.item-logo {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 40px;
	height: 40px;
	margin-bottom: 6px;
	background: var(--color-bg-surface-02, #161618);
	border: 1px solid #000000;
	border-radius: 50%;

	img {
		flex-shrink: 0;
	}
}

.item-ticker {
	font-size: 24px;
	line-height: 150%;
	text-align: center;
}

.item-value {
	font-size: 17px;
	line-height: 150%;
}

@container (height < 170px) {
	.item-logo {
		width: 24px;
		height: 24px;
	}

	.item-ticker {
		font-size: 15px;
		line-height: 170%;
	}

	.item-value {
		font-size: 13px;
		line-height: 160%;
	}
}

@container (height < 110px) {
	.item-logo {
		width: 24px;
		height: 24px;
	}

	.item-ticker {
		font-size: 10px;
		line-height: 170%;
	}

	.item-value {
		font-size: 10px;
		line-height: 170%;
	}
}

@container (height < 70px) {
	.item-logo {
		width: 20px;
		height: 20px;
	}

	.item-value {
		display: none;
	}
}

@container (height < 40px) {
	.item-logo {
		display: none;
	}

	.item-ticker {
		display: none;
	}
}

@container (width < 80px) {
	.item-logo {
		width: 20px;
		height: 20px;
		margin: 0;
	}

	.item-ticker {
		display: none;
	}

	.item-value {
		display: none;
	}
}

@container (width < 40px) {
	.item-logo {
		display: none;
	}

	.item-ticker {
		display: none;
	}
}
</style>
